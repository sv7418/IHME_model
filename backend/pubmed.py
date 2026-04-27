"""PubMed/NCBI E-utilities integration for literature retrieval."""

import os
import asyncio
import httpx
from typing import List

NCBI_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"


async def _search_pmids(client: httpx.AsyncClient, query: str, max_results: int = 5) -> List[str]:
    params = {
        "db": "pubmed",
        "term": query,
        "retmax": max_results,
        "retmode": "json",
        "sort": "relevance",
    }
    api_key = os.getenv("NCBI_API_KEY")
    if api_key:
        params["api_key"] = api_key

    try:
        r = await client.get(f"{NCBI_BASE}/esearch.fcgi", params=params)
        r.raise_for_status()
        return r.json().get("esearchresult", {}).get("idlist", [])
    except Exception:
        return []


async def _fetch_abstracts(client: httpx.AsyncClient, pmids: List[str]) -> str:
    if not pmids:
        return ""
    params = {
        "db": "pubmed",
        "id": ",".join(pmids),
        "rettype": "abstract",
        "retmode": "text",
    }
    api_key = os.getenv("NCBI_API_KEY")
    if api_key:
        params["api_key"] = api_key

    try:
        r = await client.get(f"{NCBI_BASE}/efetch.fcgi", params=params)
        r.raise_for_status()
        return r.text
    except Exception:
        return ""


async def fetch_disease_context(disease: str, max_chars: int = 12000) -> str:
    """Fetch PubMed abstracts across multiple queries for a disease/TA."""
    queries = [
        f'"{disease}"[Title/Abstract] AND (epidemiology OR prevalence OR incidence) AND Review[PT]',
        f'"{disease}"[Title/Abstract] AND (treatment guidelines OR standard of care) AND Review[PT]',
        f'"{disease}"[Title/Abstract] AND (patient support program OR adherence OR persistence)',
        f'"{disease}"[Title/Abstract] AND (market access OR commercial OR health economics)',
        f'"{disease}"[Title/Abstract] AND (unmet need OR barriers OR patient burden)',
    ]

    async with httpx.AsyncClient(timeout=20.0) as client:
        pmid_lists = await asyncio.gather(
            *[_search_pmids(client, q, max_results=4) for q in queries],
            return_exceptions=True,
        )

    # Deduplicate across queries
    seen = set()
    unique_pmids = []
    for result in pmid_lists:
        if isinstance(result, list):
            for pmid in result:
                if pmid not in seen:
                    seen.add(pmid)
                    unique_pmids.append(pmid)
        if len(unique_pmids) >= 15:
            break

    if not unique_pmids:
        return ""

    async with httpx.AsyncClient(timeout=30.0) as client:
        raw = await _fetch_abstracts(client, unique_pmids[:12])

    return raw[:max_chars] if raw else ""
