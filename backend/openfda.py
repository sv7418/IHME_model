"""OpenFDA API integration for approved drug intelligence."""

import httpx

FDA_LABEL_URL = "https://api.fda.gov/drug/label.json"
FDA_DRUGSFDA_URL = "https://api.fda.gov/drug/drugsfda.json"


async def fetch_approved_drugs(condition: str, max_results: int = 10) -> str:
    """Return a formatted summary of FDA-approved drugs for a condition."""
    output_parts: list[str] = []

    # Query 1: Drug labels mentioning the condition in indications
    label_result = await _search_drug_labels(condition, max_results)
    if label_result:
        output_parts.append(label_result)

    return "\n\n".join(output_parts) if output_parts else ""


async def _search_drug_labels(condition: str, limit: int) -> str:
    params = {
        "search": f'indications_and_usage:"{condition}"',
        "limit": limit,
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            r = await client.get(FDA_LABEL_URL, params=params)
            if r.status_code == 404:
                return ""
            r.raise_for_status()
            data = r.json()
    except Exception:
        return ""

    results = data.get("results", [])
    if not results:
        return ""

    lines = [f"FDA-Approved Drug Labels Referencing {condition}:\n"]
    seen_brands: set[str] = set()

    for item in results:
        openfda = item.get("openfda", {})
        brand_names = openfda.get("brand_name", [])
        generic_names = openfda.get("generic_name", [])
        manufacturer = openfda.get("manufacturer_name", [])
        routes = openfda.get("route", [])
        drug_classes = openfda.get("pharm_class_epc", [])

        brand = brand_names[0].title() if brand_names else ""
        generic = generic_names[0].lower() if generic_names else ""
        mfr = manufacturer[0] if manufacturer else "Unknown"
        route = routes[0].lower() if routes else "N/A"
        drug_class = drug_classes[0] if drug_classes else ""

        key = brand or generic
        if not key or key in seen_brands:
            continue
        seen_brands.add(key)

        entry = f"• {brand or generic.title()}"
        if brand and generic:
            entry += f" ({generic})"
        entry += f" | {mfr} | Route: {route}"
        if drug_class:
            entry += f" | Class: {drug_class}"
        lines.append(entry)

    if len(lines) == 1:
        return ""

    return "\n".join(lines)
