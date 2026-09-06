import os
import secrets

from fastapi import Depends, FastAPI, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .data import KNOWLEDGE, PAPERS, VIDEOS
from .database import (
    create_content,
    delete_content,
    initialize_database,
    list_content,
    list_messages,
    save_message,
    update_content,
)
from .schemas import (
    ContactMessage,
    ContactRequest,
    ContentCreate,
    ContentItem,
    KnowledgeDomain,
    Paper,
    SummarizeRequest,
    SummarizeResponse,
    Video,
)
from .summarizer import extractive_summary

app = FastAPI(
    title="ARGUS Research Lab API",
    description="Content and research tools for the ARGUS FCDS lab.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

origins = [
    origin.strip()
    for origin in os.getenv("ARGUS_CORS_ORIGINS", "http://localhost:3000").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)
initialize_database()


def require_admin(authorization: str | None = Header(default=None)) -> None:
    expected = os.getenv("ARGUS_ADMIN_TOKEN")
    if not expected or not authorization or not secrets.compare_digest(authorization, f"Bearer {expected}"):
        raise HTTPException(status_code=403, detail="Admin access required")


@app.get("/health", tags=["system"])
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "argus-api"}


@app.get("/api/videos", response_model=list[Video], tags=["library"])
async def list_videos(topic: str | None = Query(default=None)) -> list[Video]:
    return [video for video in VIDEOS if not topic or video.topic.casefold() == topic.casefold()]


@app.get("/api/knowledge", response_model=list[KnowledgeDomain], tags=["library"])
async def list_knowledge() -> list[KnowledgeDomain]:
    return KNOWLEDGE


@app.get("/api/papers", response_model=list[Paper], tags=["research"])
async def list_papers(area: str | None = Query(default=None)) -> list[Paper]:
    return [paper for paper in PAPERS if not area or paper.area.casefold() == area.casefold()]


@app.get("/api/content", response_model=list[ContentItem], tags=["library"])
async def content(
    section: str | None = Query(default=None),
    drafts: bool = Query(default=False),
    authorization: str | None = Header(default=None),
) -> list[dict]:
    if drafts:
        require_admin(authorization)
    try:
        return list_content(section, include_drafts=drafts)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@app.post("/api/admin/content", dependencies=[Depends(require_admin)], tags=["admin"])
async def add_content(payload: ContentCreate) -> dict[str, int]:
    try:
        return {"id": create_content(payload)}
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@app.patch("/api/admin/content/{content_id}", dependencies=[Depends(require_admin)], tags=["admin"])
async def edit_content(content_id: int, payload: ContentCreate) -> dict[str, bool]:
    try:
        updated = update_content(content_id, payload)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if not updated:
        raise HTTPException(status_code=404, detail="Content item not found")
    return {"updated": True}


@app.delete("/api/admin/content/{content_id}", dependencies=[Depends(require_admin)], tags=["admin"])
async def remove_content(content_id: int) -> dict[str, bool]:
    if not delete_content(content_id):
        raise HTTPException(status_code=404, detail="Content item not found")
    return {"deleted": True}


@app.get(
    "/api/admin/messages",
    response_model=list[ContactMessage],
    dependencies=[Depends(require_admin)],
    tags=["admin"],
)
async def messages() -> list[dict]:
    return list_messages()


@app.post("/api/contact", tags=["contact"])
async def contact(payload: ContactRequest) -> dict[str, bool]:
    save_message(payload.name, payload.email, payload.subject, payload.message)
    return {"received": True}


@app.post("/api/summarize", response_model=SummarizeResponse, tags=["tools"])
async def summarize(payload: SummarizeRequest) -> SummarizeResponse:
    summary = extractive_summary(payload.text, payload.max_sentences)
    return SummarizeResponse(summary=summary, original_words=len(payload.text.split()), summary_words=len(summary.split()))
