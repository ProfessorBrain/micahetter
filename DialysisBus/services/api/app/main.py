"""FastAPI application entry point."""

import json
import logging
from collections.abc import Callable
from datetime import UTC, datetime
from time import perf_counter
from uuid import uuid4

from fastapi import FastAPI, Request
from fastapi.concurrency import run_in_threadpool
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from .config import get_settings
from .database import database_is_ready

settings = get_settings()


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        return json.dumps(
            {
                "timestamp": datetime.now(UTC).isoformat(),
                "level": record.levelname.lower(),
                "logger": record.name,
                "message": record.getMessage(),
            },
            separators=(",", ":"),
        )


handler = logging.StreamHandler()
handler.setFormatter(JsonFormatter())
logger = logging.getLogger("dialysis_transit_api")
logger.handlers.clear()
logger.addHandler(handler)
logger.setLevel(logging.INFO)
logger.propagate = False


class HealthResponse(BaseModel):
    status: str
    service: str = "dialysis-transit-explorer-api"
    version: str
    request_id: str
    database: str | None = None


app = FastAPI(
    title="Dialysis & Transit Explorer API",
    description=(
        "Read-only spatial and metadata service for the Phase 1 research tool."
    ),
    version=settings.app_version,
    docs_url="/docs" if settings.app_env != "production" else None,
    redoc_url=None,
)
app.state.readiness_probe = database_is_ready

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_allowed_origins),
    allow_credentials=False,
    allow_methods=["GET", "OPTIONS"],
    allow_headers=["Accept", "Content-Type", "X-Request-ID"],
    expose_headers=["X-Request-ID"],
)


@app.middleware("http")
async def request_context(request: Request, call_next: Callable):
    supplied_request_id = request.headers.get("X-Request-ID", "").strip()
    request_id = (
        supplied_request_id[:128] if supplied_request_id else str(uuid4())
    )
    request.state.request_id = request_id
    started_at = perf_counter()

    try:
        response = await call_next(request)
    except Exception:
        logger.exception(
            json.dumps(
                {
                    "event": "unhandled_request_error",
                    "request_id": request_id,
                    "method": request.method,
                    "path": request.url.path,
                }
            )
        )
        response = JSONResponse(
            status_code=500,
            content={
                "error": {
                    "code": "INTERNAL_SERVER_ERROR",
                    "message": "The request could not be completed.",
                    "request_id": request_id,
                }
            },
        )

    response.headers["X-Request-ID"] = request_id
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = (
        "camera=(), microphone=(), geolocation=()"
    )
    duration_ms = round((perf_counter() - started_at) * 1000, 2)
    logger.info(
        json.dumps(
            {
                "event": "request_completed",
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "status": response.status_code,
                "duration_ms": duration_ms,
            },
            separators=(",", ":"),
        )
    )
    return response


def health_payload(request: Request, database: str | None = None) -> dict[str, str]:
    payload = {
        "status": "ok",
        "service": "dialysis-transit-explorer-api",
        "version": settings.app_version,
        "request_id": request.state.request_id,
    }
    if database is not None:
        payload["database"] = database
    return payload


@app.get("/api/v1/health/live", response_model=HealthResponse, tags=["health"])
@app.get("/health/live", response_model=HealthResponse, include_in_schema=False)
async def live(request: Request) -> dict[str, str]:
    return health_payload(request)


@app.get("/api/v1/health/ready", response_model=HealthResponse, tags=["health"])
@app.get("/health/ready", response_model=HealthResponse, include_in_schema=False)
async def ready(request: Request):
    try:
        is_ready = await run_in_threadpool(app.state.readiness_probe)
    except Exception:
        is_ready = False

    if not is_ready:
        return JSONResponse(
            status_code=503,
            content={
                "error": {
                    "code": "DATABASE_UNAVAILABLE",
                    "message": "The database readiness check did not succeed.",
                    "request_id": request.state.request_id,
                }
            },
        )
    return health_payload(request, database="ready")


@app.get("/api/v1", tags=["metadata"])
async def api_root(request: Request) -> dict[str, str]:
    return {
        "name": "Dialysis & Transit Explorer API",
        "phase": "Epic 1 platform",
        "status": "read-only",
        "request_id": request.state.request_id,
    }
