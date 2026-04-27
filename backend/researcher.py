"""Core research orchestrator — gathers data from APIs then streams Claude analysis."""

import os
import asyncio
from typing import AsyncGenerator, Any
import anthropic

from backend.pubmed import fetch_disease_context
from backend.clinicaltrials import fetch_trials
from backend.openfda import fetch_approved_drugs

SYSTEM_PROMPT = """\
You are a senior researcher at a top-tier healthcare consulting firm (ZS, McKinsey, BCG) \
specializing in patient support services, market access, and commercialization strategy.

Your task is to conduct a comprehensive, end-to-end analysis of the disease area or product \
provided by the user.

## OBJECTIVE
Develop a structured, insight-driven view of:
- Disease and therapy landscape
- Market dynamics
- Patient journey and barriers
- Patient support services (PSPs)
- Strategic implications for pharma

## OPERATING PRINCIPLES
- Be hypothesis-driven and MECE where possible
- Use precise clinical and commercial terminology
- Quantify wherever possible (state assumptions clearly if needed)
- Distinguish US vs ex-US when relevant
- Avoid generic descriptions — focus on insights and implications
- Highlight uncertainties and data gaps explicitly
- Prioritize synthesis over exhaustive listing

## OUTPUT STRUCTURE

### 1. Disease & Therapy Area Overview
- Pathophysiology and key disease drivers
- Subtypes, staging, and progression
- Epidemiology: incidence and prevalence (US + global), diagnosed vs treated population, \
key patient segments (severity, biomarkers, lines of therapy)
- Standard of care: treatment guidelines by line of therapy, treatment goals
- Key unmet needs (clinical + patient experience)

### 2. Therapeutic Landscape & Competitive Intelligence
- Key approved products table: Brand | Generic | Manufacturer | Approval Year | \
Line of Therapy | Route of Administration
- Mechanism of action: explain major classes (not just individual drugs)
- Competitive segmentation by drug class (biologics, small molecules, gene therapies, etc.)
- Differentiation: efficacy, safety, dosing, administration burden
- Pipeline: late-stage assets (Phase II/III), expected shifts in standard of care
- Summary synthesis of how crowded/differentiated the market is

### 3. Market Landscape & Commercial Dynamics
- Market size: total addressable population, treated population, revenue estimates (US/global)
- Growth drivers: epidemiology trends, innovation and new modalities, label expansions
- Constraints: pricing pressure, access restrictions, generics/biosimilars
- Competitive dynamics: market share if available, leader vs challenger brands
- Clearly state assumptions where data is uncertain

### 4. Patient Journey & Barriers
Map the end-to-end journey: Symptom onset → Diagnosis → Treatment initiation → \
Adherence → Persistence

For each stage identify barriers across:
- Clinical (misdiagnosis, side effects, comorbidities)
- Access (prior auth, step edits, provider access)
- Financial (OOP cost, insurance coverage)
- Behavioral/social (health literacy, stigma, support systems)
- System-level (care coordination, fragmentation)

Output as a structured markdown table and highlight key drop-off points.

### 5. Patient Support Programs (PSPs)
- Types of services: hub services (benefits verification, prior auth), financial assistance \
(copay, PAPs), adherence programs, nurse educators/case management, digital tools
- Mapping: which services address which barriers?
- Competitive benchmarking: how leading brands differentiate
- Effectiveness: evidence of impact (adherence, persistence, time-to-therapy)
- Gaps: where current PSPs fall short, opportunities for innovation

### 6. Synthesis & Strategic Implications
- 5–7 key insights across clinical, market, and patient experience
- Most critical barriers to therapy initiation and persistence
- Implications for pharma: PSP investment priorities, differentiation opportunities, \
commercial risks
- Define a "best-in-class" patient support strategy for this therapy area

## OUTPUT FORMAT REQUIREMENTS
- Use clear ## and ### section headers
- Include markdown tables where appropriate
- Be concise but insight-dense
- Avoid repetition across sections
- Explicitly call out assumptions and data gaps with **[ASSUMPTION]** or **[DATA GAP]** tags

## OPTIONAL (INCLUDE IF RELEVANT)
- Regional nuances (US vs EU vs emerging markets)
- Rare disease vs specialty vs primary care dynamics
- Provider ecosystem (specialists vs PCPs)

Deliver consulting-grade, synthesis-driven output suitable for strategic decision-making.\
"""


def _build_user_message(therapy_area: str, search_type: str, context: dict) -> str:
    sections = []

    if context.get("pubmed"):
        sections.append(f"## Recent Literature (PubMed)\n\n{context['pubmed']}")
    if context.get("trials"):
        sections.append(f"## Active Clinical Trials (ClinicalTrials.gov)\n\n{context['trials']}")
    if context.get("fda"):
        sections.append(f"## FDA-Approved Drugs (OpenFDA)\n\n{context['fda']}")

    grounding = "\n\n---\n\n".join(sections)

    subject_line = (
        f"**Product/Drug:** {therapy_area}" if search_type == "product"
        else f"**Disease/Therapy Area:** {therapy_area}"
    )

    product_note = (
        "\nFocus the competitive analysis section specifically on this product, its approved "
        "indications, mechanism of action, and how it is differentiated from competitors.\n"
        if search_type == "product" else ""
    )

    return f"""\
Please conduct a comprehensive consulting-grade analysis for:

{subject_line}
{product_note}
I have gathered the following real-world data to ground your analysis:

{grounding if grounding else "_No external data retrieved — rely on your training knowledge._"}

Follow the complete six-section output structure defined in your instructions. \
Use markdown formatting with tables where called for.\
"""


async def run_research(
    therapy_area: str,
    search_type: str = "ta",
) -> AsyncGenerator[dict[str, Any], None]:
    """Async generator that yields SSE-compatible event dicts."""
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        yield {"type": "error", "message": "ANTHROPIC_API_KEY is not set. Please add it to your .env file."}
        return

    # ── Step 1: Gather external data concurrently ──────────────────────────
    yield {"type": "status", "step": "pubmed", "message": f"Searching PubMed for '{therapy_area}' literature…"}
    yield {"type": "status", "step": "trials", "message": "Querying ClinicalTrials.gov for active Phase 2/3 trials…"}
    yield {"type": "status", "step": "fda",    "message": "Fetching FDA drug approvals from OpenFDA…"}

    pubmed_data, trials_data, fda_data = await asyncio.gather(
        fetch_disease_context(therapy_area),
        fetch_trials(therapy_area),
        fetch_approved_drugs(therapy_area),
        return_exceptions=True,
    )

    context = {
        "pubmed": pubmed_data  if isinstance(pubmed_data,  str) else "",
        "trials": trials_data  if isinstance(trials_data,  str) else "",
        "fda":    fda_data     if isinstance(fda_data,     str) else "",
    }

    sources_found = sum(1 for v in context.values() if v)
    yield {
        "type": "sources_done",
        "pubmed": bool(context["pubmed"]),
        "trials": bool(context["trials"]),
        "fda":    bool(context["fda"]),
        "message": f"Retrieved data from {sources_found}/3 sources. Starting AI analysis…",
    }

    # ── Step 2: Stream Claude response ─────────────────────────────────────
    yield {"type": "status", "step": "claude", "message": "Synthesizing analysis with Claude…"}

    user_message = _build_user_message(therapy_area, search_type, context)
    client = anthropic.AsyncAnthropic(api_key=api_key)

    try:
        async with client.messages.stream(
            model="claude-sonnet-4-6",
            max_tokens=8000,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        ) as stream:
            async for text in stream.text_stream:
                yield {"type": "content", "text": text}
    except anthropic.AuthenticationError:
        yield {"type": "error", "message": "Invalid ANTHROPIC_API_KEY. Please check your .env file."}
        return
    except Exception as e:
        yield {"type": "error", "message": f"Claude API error: {str(e)}"}
        return

    yield {"type": "done"}
