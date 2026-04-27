"""FastAPI application — serves the frontend and exposes the research streaming API."""

import json
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

load_dotenv()

from backend.researcher import run_research  # noqa: E402 — must load env first

app = FastAPI(title="Therapy Area Research Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = Path(__file__).parent.parent / "static"
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# ── Common therapy areas ────────────────────────────────────────────────────
THERAPY_AREAS = sorted([
    "Alzheimer's Disease",
    "Amyotrophic Lateral Sclerosis (ALS)",
    "Ankylosing Spondylitis",
    "Asthma",
    "Atopic Dermatitis",
    "Atrial Fibrillation",
    "B-cell Lymphoma",
    "Breast Cancer",
    "Chronic Kidney Disease",
    "Chronic Lymphocytic Leukemia",
    "Colorectal Cancer",
    "COPD",
    "Cystic Fibrosis",
    "Glioblastoma",
    "Heart Failure",
    "Hemophilia A",
    "Hemophilia B",
    "Hepatitis C",
    "HIV/AIDS",
    "Inflammatory Bowel Disease (Crohn's Disease)",
    "Lupus (SLE)",
    "Major Depressive Disorder",
    "Melanoma",
    "Migraine",
    "Multiple Myeloma",
    "Multiple Sclerosis",
    "NASH / Metabolic Dysfunction-Associated Steatohepatitis",
    "Non-Small Cell Lung Cancer",
    "Ovarian Cancer",
    "Parkinson's Disease",
    "Prostate Cancer",
    "Psoriasis",
    "Psoriatic Arthritis",
    "Rheumatoid Arthritis",
    "Schizophrenia",
    "Sickle Cell Disease",
    "Spinal Muscular Atrophy",
    "Type 1 Diabetes",
    "Type 2 Diabetes",
    "Ulcerative Colitis",
])


class ResearchRequest(BaseModel):
    therapy_area: str
    search_type: str = "ta"   # "ta" = therapy area, "product" = drug/product name


@app.get("/")
async def serve_index():
    return FileResponse(str(STATIC_DIR / "index.html"))


@app.get("/api/therapy-areas")
async def get_therapy_areas():
    return {"therapy_areas": THERAPY_AREAS}


@app.post("/api/research/stream")
async def stream_research(request: ResearchRequest):
    async def event_generator():
        try:
            async for event in run_research(request.therapy_area, request.search_type):
                yield f"data: {json.dumps(event)}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
