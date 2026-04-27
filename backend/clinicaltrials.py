"""ClinicalTrials.gov v2 API integration for pipeline intelligence."""

import httpx

CT_BASE = "https://clinicaltrials.gov/api/v2/studies"


async def fetch_trials(condition: str, max_results: int = 15) -> str:
    """Return a formatted summary of active Phase 2/3 trials for a condition."""
    params = {
        "query.cond": condition,
        "filter.phase": "PHASE2,PHASE3",
        "filter.overallStatus": "RECRUITING,ACTIVE_NOT_RECRUITING,ENROLLING_BY_INVITATION",
        "pageSize": max_results,
        "fields": (
            "NCTId,BriefTitle,Phase,OverallStatus,Condition,"
            "InterventionName,StartDate,PrimaryCompletionDate,"
            "BriefSummary,EnrollmentCount,StudyType"
        ),
        "format": "json",
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            r = await client.get(CT_BASE, params=params)
            r.raise_for_status()
            data = r.json()
    except Exception:
        return ""

    studies = data.get("studies", [])
    if not studies:
        return ""

    lines = [f"Active Phase 2/3 Clinical Trials for {condition} ({len(studies)} found):\n"]

    for s in studies:
        proto = s.get("protocolSection", {})
        id_mod = proto.get("identificationModule", {})
        status_mod = proto.get("statusModule", {})
        desc_mod = proto.get("descriptionModule", {})
        arms_mod = proto.get("armsInterventionsModule", {})
        design_mod = proto.get("designModule", {})

        nct = id_mod.get("nctId", "N/A")
        title = id_mod.get("briefTitle", "No title")
        phases = design_mod.get("phases", [])
        phase_str = ", ".join(phases) if phases else "N/A"
        status = status_mod.get("overallStatus", "N/A")
        summary = desc_mod.get("briefSummary", "")[:250].replace("\n", " ")

        interventions = [
            i.get("name", "")
            for i in arms_mod.get("interventions", [])
            if i.get("type", "") in ("DRUG", "BIOLOGICAL", "GENETIC", "COMBINATION_PRODUCT")
        ]

        lines.append(f"• {nct}: {title}")
        lines.append(f"  Phase: {phase_str} | Status: {status}")
        if interventions:
            lines.append(f"  Interventions: {', '.join(interventions[:4])}")
        if summary:
            lines.append(f"  Summary: {summary}")
        lines.append("")

    return "\n".join(lines)
