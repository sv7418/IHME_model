"""Core research orchestrator — gathers data from APIs then streams Claude analysis."""

import os
import asyncio
from typing import AsyncGenerator, Any
import anthropic

# ---------------------------------------------------------------------------
# Mock report — used when MOCK_MODE=true (no API key required)
# ---------------------------------------------------------------------------
_MOCK_REPORT = """\
# Type 2 Diabetes (T2D) — Strategic Landscape Analysis

> **Note:** This is a **mock report** generated without an API key (`MOCK_MODE=true`).
> Set `ANTHROPIC_API_KEY` in your `.env` and turn off `MOCK_MODE` for a real AI-generated analysis.

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
- Health equity gaps: under-diagnosis and under-treatment in low-income populations

---

## 2. Therapeutic Landscape & Competitive Intelligence

### Approved Products

| Brand | Generic | Manufacturer | Approval | Line | Route |
|-------|---------|-------------|----------|------|-------|
| Ozempic / Rybelsus | Semaglutide | Novo Nordisk | 2017/2019 | 2nd+ | SC / Oral |
| Jardiance | Empagliflozin | Boehringer/Lilly | 2014 | 2nd+ | Oral |
| Farxiga | Dapagliflozin | AstraZeneca | 2014 | 2nd+ | Oral |
| Trulicity | Dulaglutide | Lilly | 2014 | 2nd+ | SC QW |
| Victoza | Liraglutide | Novo Nordisk | 2010 | 2nd+ | SC QD |
| Januvia | Sitagliptin | Merck | 2006 | 2nd+ | Oral |
| Mounjaro / Zepbound | Tirzepatide | Lilly | 2022 | 2nd+ | SC QW |

### Mechanism of Action Classes
- **GLP-1 RAs:** Incretin mimetics — stimulate glucose-dependent insulin secretion, suppress glucagon, delay gastric emptying; weight loss benefit
- **SGLT-2 inhibitors:** Block renal glucose reabsorption; cardiorenal protective effects independent of glucose lowering
- **DPP-4 inhibitors:** Prolong endogenous GLP-1 action; weight-neutral, well-tolerated
- **GIP/GLP-1 dual agonists (tirzepatide):** Dual incretin action; superior HbA1c and weight reduction vs. GLP-1 mono

### Market Crowdedness
**Highly crowded but rapidly differentiating.** The market is bifurcating between commodity oral agents
(metformin, SUs, DPP-4i — heavy generic pressure) and premium injectables (GLP-1 RA, tirzepatide)
commanding $800–$1,000+/month list prices. Weight loss labelling (Wegovy, Zepbound) creates a parallel
obesity market that will reshape T2D prescribing.

### Pipeline Highlights
- **Oral semaglutide high-dose (Novo Nordisk):** Phase 3 — potential first oral GLP-1 RA at efficacious doses
- **CagriSema (cagrilintide + semaglutide):** Phase 3 — amylin/GLP-1 combo targeting >20% weight loss
- **Retatrutide (Lilly):** GIP/GLP-1/glucagon triple agonist — Phase 3; ~24% weight loss in Phase 2

---

## 3. Market Landscape & Commercial Dynamics

### Market Size
| Metric | Value | Source / Assumption |
|--------|-------|---------------------|
| US T2D drug market | ~$35B (2023) | **[ASSUMPTION]** based on public revenue disclosures |
| Global T2D drug market | ~$70B (2023) | **[ASSUMPTION]** |
| Treated population (US) | ~28 million | IDF + CDC data |
| GLP-1 RA segment share | ~55% of US market | **[ASSUMPTION]** |

### Growth Drivers
1. **Obesity epidemic** — rising T2D incidence; GLP-1 RA obesity indication expanding the addressable market
2. **Cardiorenal outcomes data** — EMPA-REG, DECLARE, LEADER trials driving guideline-preferred use of SGLT-2i + GLP-1 RA
3. **Oral GLP-1 availability** — removes injection barrier for injection-hesitant patients

### Constraints
- **Access / prior authorisation:** Most payers require metformin + 1–2 oral agent failures before approving GLP-1 RA
- **Cost:** Ozempic list price ~$900/month; significant OOP burden for non-Medicare patients
- **Supply shortages (2022–2024):** Semaglutide shortage driven by obesity demand
- **Generic / biosimilar threat:** Liraglutide biosimilars entering 2024; semaglutide patent expiry ~2032

---

## 4. Patient Journey & Barriers

| Stage | Key Barriers | Barrier Type |
|-------|-------------|-------------|
| Symptom onset | Asymptomatic early disease; fatigue / thirst attributed to lifestyle | Clinical |
| Diagnosis | Delayed diagnosis avg. 4–7 years; screening gaps in low-income populations | Clinical, System |
| Treatment initiation | Physician inertia on intensification; injection hesitancy for GLP-1 RA | Behavioral, Clinical |
| Access / formulary | Prior auth for GLP-1 RA; step therapy requiring metformin failure | Access |
| Financial | $0 copay rare; median OOP $50–$200/month for branded agents | Financial |
| Adherence | Complex regimens; GI side effects with GLP-1 RA in first 4–8 weeks | Clinical, Behavioral |
| Persistence | ~40% of GLP-1 RA patients discontinue within 12 months | Behavioral, Financial |

**Key drop-off points:** Treatment initiation (injection hesitancy) and 90-day persistence (GI tolerability + cost).

---

## 5. Patient Support Programs (PSPs)

### Service Landscape
| Service | Description | Addresses |
|---------|-------------|-----------|
| Hub / benefits verification | Insurance check, prior auth filing | Access barrier |
| Copay assistance | $0–$25 copay cards (commercially insured) | Financial barrier |
| Patient Assistance Programs | Free drug for uninsured/underinsured | Financial barrier |
| Nurse educator / CDE access | Injection training, dose titration support | Adherence, Clinical |
| Digital adherence tools | Apps for dose reminders, glucose logging | Adherence |
| GI tolerability programmes | Titration guides, dietary advice | Persistence |

### Competitive Benchmarking
- **Novo Nordisk (Ozempic/Wegovy):** NovoCare hub — strong copay programme, robust nurse educator network
- **Lilly (Mounjaro):** Lilly Cares — copay card + injection training; early access programme during shortage
- **AstraZeneca (Farxiga):** AZ&Me PAP — focus on CKD patient segment education

### PSP Gaps
- **Post-injection GI support** is underdeveloped — most patients titrate without clinical guidance, leading to early discontinuation
- **Medicare Part D patients** excluded from copay cards; high unmet need for affordability support
- **Digital integration** — very few PSPs connect to CGM/glucometer data for proactive outreach

---

## 6. Synthesis & Strategic Implications

### Key Insights
1. **Weight loss is the new efficacy bar** — Tirzepatide's ~20% weight loss has reset physician and payer expectations; any new entrant must compete on body weight, not just HbA1c
2. **The access gap is the primary commercial risk** — Prior auth and OOP cost limit GLP-1 RA uptake to ~35% of eligible patients despite guideline preference
3. **Persistence, not initiation, is the battleground** — GI tolerability in weeks 1–8 drives ~40% of GLP-1 RA discontinuation; PSPs that actively support this window drive measurable ROI
4. **Cardiorenal positioning creates segmentation opportunity** — CKD and HF patients are a high-value, less penetrated segment where SGLT-2i + GLP-1 combo evidence is growing
5. **Biosimilar disruption is 5–8 years away for semaglutide** but already real for liraglutide; incumbents should lock in patients on newer agents
6. **Health equity is an emerging payer and policy priority** — Programmes that address under-diagnosis in Hispanic and Black populations create goodwill and long-term market expansion
7. **Medicare coverage of obesity drugs (anticipated)** could add 10M+ eligible patients and reshape the commercial/government revenue mix

### Best-in-Class PSP Strategy
A market-leading PSP for T2D (GLP-1 RA era) should prioritise:

1. **Toleration support programme** — proactive nurse outreach at weeks 2, 4, and 8 to manage GI side effects; titration decision trees
2. **Bridge-to-Medicare affordability** — partner with PBMs or offer income-based PAP to cover the Medicare gap
3. **Digital-first adherence** — integrate with major CGM platforms (Dexcom, Abbott) for glucose-triggered outreach
4. **Prior auth automation** — AI-assisted PA submission to reduce time-to-therapy from 14 days to <3 days
5. **CDE network** — embed certified diabetes educators in high-prescribing endocrinology practices

> **[DATA GAP]** Market share data for individual PSP programmes is not publicly available;
> the benchmarking above is based on publicly disclosed programme features and payer contract filings.
"""


async def _stream_mock(therapy_area: str) -> AsyncGenerator[dict[str, Any], None]:
    """Stream the mock report word-by-word to exercise the full UI."""
    report = _MOCK_REPORT.replace("Type 2 Diabetes (T2D)", f"{therapy_area} (Mock)")

    yield {"type": "status", "step": "pubmed", "message": f"[MOCK] Simulating PubMed search for '{therapy_area}'…"}
    await asyncio.sleep(0.6)
    yield {"type": "status", "step": "trials", "message": "[MOCK] Simulating ClinicalTrials.gov query…"}
    await asyncio.sleep(0.5)
    yield {"type": "status", "step": "fda",    "message": "[MOCK] Simulating OpenFDA lookup…"}
    await asyncio.sleep(0.5)
    yield {
        "type": "sources_done",
        "pubmed": True, "trials": True, "fda": True,
        "message": "[MOCK] Data simulation complete. Streaming sample report…",
    }
    yield {"type": "status", "step": "claude", "message": "[MOCK] Streaming pre-written sample report…"}
    await asyncio.sleep(0.3)

    # Stream in small chunks to show the streaming UI
    chunk_size = 6  # characters per chunk
    for i in range(0, len(report), chunk_size):
        yield {"type": "content", "text": report[i:i + chunk_size]}
        await asyncio.sleep(0.01)

    yield {"type": "done"}

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

    # Mock mode — set MOCK_MODE=true in .env to bypass API calls entirely
    if os.getenv("MOCK_MODE", "").lower() in ("1", "true", "yes"):
        async for event in _stream_mock(therapy_area):
            yield event
        return

    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        yield {"type": "error", "message": "ANTHROPIC_API_KEY is not set. Add it to your .env file, or set MOCK_MODE=true to run without an API key."}
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
