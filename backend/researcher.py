"""Core research orchestrator — gathers data from APIs then streams LLM analysis.

Supported providers (set via LLM_PROVIDER env var):
  anthropic  — Claude API (default); requires ANTHROPIC_API_KEY
  ollama     — local Ollama instance; no API key needed
  mock       — pre-written sample report; no network required (alias: MOCK_MODE=true)
"""

import os
import asyncio
from typing import AsyncGenerator, Any

import anthropic
from openai import AsyncOpenAI

from backend.pubmed import fetch_disease_context
from backend.clinicaltrials import fetch_trials
from backend.openfda import fetch_approved_drugs

# ---------------------------------------------------------------------------
# Mock report — used when provider == "mock"
# ---------------------------------------------------------------------------
_MOCK_REPORT = """\
# Type 2 Diabetes (T2D) — Strategic Landscape Analysis

> **Note:** This is a **mock report** (`MOCK_MODE=true` / `LLM_PROVIDER=mock`).
> Set a real provider to generate live AI analysis.

---

## 1. Disease & Therapy Area Overview

### Pathophysiology
T2D is a progressive metabolic disorder characterised by insulin resistance in peripheral tissues
(muscle, liver, adipose) and eventual β-cell dysfunction leading to relative insulin deficiency.
Key drivers include obesity, physical inactivity, genetic predisposition, and chronic low-grade
inflammation.

### Subtypes & Staging
| Stage | Description |
|-------|-------------|
| Pre-diabetes | FPG 100–125 mg/dL or HbA1c 5.7–6.4% |
| Newly diagnosed T2D | HbA1c ≥6.5%, often asymptomatic |
| Established T2D | Duration >5 years, may have complications |
| Advanced / complicated | CKD, CVD, retinopathy, neuropathy |

### Epidemiology
- **Global prevalence:** ~537 million adults (IDF 2021); projected 783 million by 2045
- **US prevalence:** ~37 million diagnosed; ~96 million pre-diabetic
- **Diagnosed vs. treated:** ~90% of US T2D patients are diagnosed; ~75% receive pharmacotherapy
- **Key segments:** Newly diagnosed (metformin-naive), CV high-risk, CKD-comorbid, obesity-driven

### Standard of Care
- **1st line:** Metformin ± lifestyle modification
- **2nd line:** GLP-1 RA or SGLT-2i preferred in patients with established ASCVD, HF, or CKD
- **3rd line:** Combination therapy; insulin when HbA1c uncontrolled

### Key Unmet Needs
- Persistent HbA1c under-control (only ~50% of US patients at target <7%)
- Weight management — most oral agents are weight-neutral or cause gain
- Hypoglycaemia risk with insulin/SU use
- Medication burden and adherence in polypharmacy patients
- Health equity gaps in low-income populations

---

## 2. Therapeutic Landscape & Competitive Intelligence

### Approved Products

| Brand | Generic | Manufacturer | Approval | Line | Route |
|-------|---------|-------------|----------|------|-------|
| Ozempic / Rybelsus | Semaglutide | Novo Nordisk | 2017/2019 | 2nd+ | SC / Oral |
| Jardiance | Empagliflozin | Boehringer/Lilly | 2014 | 2nd+ | Oral |
| Farxiga | Dapagliflozin | AstraZeneca | 2014 | 2nd+ | Oral |
| Trulicity | Dulaglutide | Lilly | 2014 | 2nd+ | SC QW |
| Mounjaro / Zepbound | Tirzepatide | Lilly | 2022 | 2nd+ | SC QW |
| Januvia | Sitagliptin | Merck | 2006 | 2nd+ | Oral |

### MoA Classes
- **GLP-1 RAs:** Incretin mimetics — glucose-dependent insulin secretion, weight loss
- **SGLT-2 inhibitors:** Block renal glucose reabsorption; cardiorenal protective
- **GIP/GLP-1 dual agonists (tirzepatide):** Superior HbA1c and weight vs. GLP-1 mono
- **DPP-4 inhibitors:** Weight-neutral, well-tolerated oral option

### Pipeline
- **Oral semaglutide high-dose** (Novo Nordisk) — Phase 3
- **CagriSema** (cagrilintide + semaglutide) — Phase 3; >20% weight loss
- **Retatrutide** (Lilly) — GIP/GLP-1/glucagon triple agonist; Phase 3

---

## 3. Market Landscape & Commercial Dynamics

| Metric | Value |
|--------|-------|
| US T2D drug market | ~$35B (2023) **[ASSUMPTION]** |
| Global T2D drug market | ~$70B (2023) **[ASSUMPTION]** |
| Treated population (US) | ~28 million |
| GLP-1 RA segment share | ~55% of US market **[ASSUMPTION]** |

**Key constraints:** Prior auth for GLP-1 RA, $900/month list price, supply shortages (2022–2024).

---

## 4. Patient Journey & Barriers

| Stage | Key Barriers | Type |
|-------|-------------|------|
| Symptom onset | Asymptomatic; fatigue attributed to lifestyle | Clinical |
| Diagnosis | Avg. 4–7 year delay; screening gaps | Clinical, System |
| Treatment initiation | Physician inertia; injection hesitancy | Behavioral |
| Access | Prior auth; step therapy (metformin failure required) | Access |
| Financial | OOP $50–$200/month for branded agents | Financial |
| Adherence | GI side effects weeks 1–8 with GLP-1 RA | Clinical |
| Persistence | ~40% discontinue GLP-1 RA within 12 months | Behavioral, Financial |

---

## 5. Patient Support Programs (PSPs)

| Service | Addresses |
|---------|-----------|
| Hub / benefits verification | Access |
| Copay cards ($0–$25) | Financial (commercial only) |
| PAPs for uninsured | Financial |
| Nurse educator / CDE | Adherence, injection training |
| GI tolerability programme | Persistence |
| Digital dose reminders | Adherence |

**Gaps:** No Medicare copay support, minimal CGM integration, poor GI-phase guidance.

---

## 6. Synthesis & Strategic Implications

1. Weight loss is the new efficacy bar — tirzepatide reset expectations
2. Access gap is the primary commercial risk — prior auth limits uptake to ~35% of eligible patients
3. Persistence, not initiation, is the battleground — GI tolerability drives ~40% discontinuation
4. Cardiorenal positioning creates a high-value, less-penetrated segment
5. Biosimilar disruption is 5–8 years away for semaglutide but real now for liraglutide
6. Medicare coverage of obesity drugs could add 10M+ eligible patients
7. Health equity is an emerging payer priority

**Best-in-class PSP:** Proactive nurse outreach at weeks 2/4/8, bridge-to-Medicare affordability,
CGM-integrated digital tools, AI-assisted prior auth (<3 days), embedded CDE network.

> **[DATA GAP]** Individual PSP programme market share data is not publicly available.
"""


async def _stream_mock(therapy_area: str) -> AsyncGenerator[dict[str, Any], None]:
    report = _MOCK_REPORT.replace("Type 2 Diabetes (T2D)", f"{therapy_area} (Mock)")
    yield {"type": "status", "step": "pubmed", "message": f"[MOCK] Simulating PubMed search…"}
    await asyncio.sleep(0.6)
    yield {"type": "status", "step": "trials", "message": "[MOCK] Simulating ClinicalTrials.gov query…"}
    await asyncio.sleep(0.5)
    yield {"type": "status", "step": "fda",    "message": "[MOCK] Simulating OpenFDA lookup…"}
    await asyncio.sleep(0.5)
    yield {
        "type": "sources_done",
        "pubmed": True, "trials": True, "fda": True,
        "message": "[MOCK] Streaming pre-written sample report…",
    }
    yield {"type": "status", "step": "claude", "message": "[MOCK] Streaming sample report…"}
    await asyncio.sleep(0.3)
    chunk = 6
    for i in range(0, len(report), chunk):
        yield {"type": "content", "text": report[i:i + chunk]}
        await asyncio.sleep(0.01)
    yield {"type": "done"}


# ---------------------------------------------------------------------------
# Shared prompt
# ---------------------------------------------------------------------------
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
    return (
        f"Please conduct a comprehensive consulting-grade analysis for:\n\n"
        f"{subject_line}\n{product_note}\n"
        f"I have gathered the following real-world data to ground your analysis:\n\n"
        f"{grounding if grounding else '_No external data retrieved — rely on your training knowledge._'}\n\n"
        f"Follow the complete six-section output structure defined in your instructions. "
        f"Use markdown formatting with tables where called for."
    )


# ---------------------------------------------------------------------------
# Provider-specific streaming helpers
# ---------------------------------------------------------------------------

async def _stream_anthropic(
    user_message: str,
    api_key: str,
) -> AsyncGenerator[dict[str, Any], None]:
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
        yield {"type": "error", "message": "Invalid ANTHROPIC_API_KEY. Check your .env file."}
        return
    except Exception as e:
        yield {"type": "error", "message": f"Claude API error: {e}"}
        return
    yield {"type": "done"}


async def _stream_ollama(
    user_message: str,
    base_url: str,
    model: str,
) -> AsyncGenerator[dict[str, Any], None]:
    client = AsyncOpenAI(base_url=base_url, api_key="ollama")
    try:
        stream = await client.chat.completions.create(
            model=model,
            max_tokens=6000,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": user_message},
            ],
            stream=True,
        )
        async for chunk in stream:
            text = chunk.choices[0].delta.content
            if text:
                yield {"type": "content", "text": text}
    except Exception as e:
        msg = str(e)
        if "Connection refused" in msg or "ConnectError" in msg:
            yield {"type": "error", "message": (
                f"Cannot reach Ollama at {base_url}. "
                "Is Ollama running? Start it with: ollama serve"
            )}
        else:
            yield {"type": "error", "message": f"Ollama error: {msg}"}
        return
    yield {"type": "done"}


# ---------------------------------------------------------------------------
# Main entry point
# ---------------------------------------------------------------------------

async def run_research(
    therapy_area: str,
    search_type: str = "ta",
) -> AsyncGenerator[dict[str, Any], None]:
    """Async generator that yields SSE-compatible event dicts."""

    # Determine provider
    provider = os.getenv("LLM_PROVIDER", "anthropic").lower()
    if os.getenv("MOCK_MODE", "").lower() in ("1", "true", "yes"):
        provider = "mock"

    if provider == "mock":
        async for event in _stream_mock(therapy_area):
            yield event
        return

    # Validate credentials before hitting external data APIs
    if provider == "anthropic":
        api_key = os.getenv("ANTHROPIC_API_KEY", "").strip()
        if not api_key:
            yield {
                "type": "error",
                "message": (
                    "ANTHROPIC_API_KEY is not set. "
                    "Add it to .env, set LLM_PROVIDER=ollama to use a local model, "
                    "or set MOCK_MODE=true to test without any key."
                ),
            }
            return
    elif provider == "ollama":
        api_key = None
        ollama_base = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
        ollama_model = os.getenv("OLLAMA_MODEL", "llama3.1")
    else:
        yield {"type": "error", "message": f"Unknown LLM_PROVIDER: '{provider}'. Use 'anthropic' or 'ollama'."}
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
        "pubmed": pubmed_data if isinstance(pubmed_data, str) else "",
        "trials": trials_data if isinstance(trials_data, str) else "",
        "fda":    fda_data    if isinstance(fda_data,    str) else "",
    }

    sources_found = sum(1 for v in context.values() if v)
    yield {
        "type": "sources_done",
        "pubmed": bool(context["pubmed"]),
        "trials": bool(context["trials"]),
        "fda":    bool(context["fda"]),
        "message": f"Retrieved data from {sources_found}/3 sources. Starting AI analysis…",
    }

    # ── Step 2: Stream LLM response ────────────────────────────────────────
    user_message = _build_user_message(therapy_area, search_type, context)

    if provider == "anthropic":
        yield {"type": "status", "step": "claude", "message": "Synthesizing analysis with Claude…"}
        async for event in _stream_anthropic(user_message, api_key):
            yield event

    elif provider == "ollama":
        yield {
            "type": "status",
            "step": "claude",
            "message": f"Synthesizing analysis with Ollama ({ollama_model})…",
        }
        async for event in _stream_ollama(user_message, ollama_base, ollama_model):
            yield event
