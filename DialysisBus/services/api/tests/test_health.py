import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"


async def get(path: str, **kwargs):
    transport = ASGITransport(app=app)
    async with AsyncClient(
        transport=transport,
        base_url="http://testserver",
    ) as client:
        return await client.get(path, **kwargs)


@pytest.mark.anyio
async def test_live_health_has_request_id_and_security_headers() -> None:
    response = await get("/api/v1/health/live")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["service"] == "dialysis-transit-explorer-api"
    assert body["request_id"] == response.headers["x-request-id"]
    assert response.headers["x-content-type-options"] == "nosniff"


@pytest.mark.anyio
async def test_request_id_is_preserved() -> None:
    response = await get(
        "/api/v1/health/live",
        headers={"X-Request-ID": "test-request-123"},
    )

    assert response.status_code == 200
    assert response.json()["request_id"] == "test-request-123"
    assert response.headers["x-request-id"] == "test-request-123"


@pytest.mark.anyio
async def test_ready_health_succeeds_when_database_probe_succeeds() -> None:
    original_probe = app.state.readiness_probe
    app.state.readiness_probe = lambda: True
    try:
        response = await get("/api/v1/health/ready")
    finally:
        app.state.readiness_probe = original_probe

    assert response.status_code == 200
    assert response.json()["database"] == "ready"


@pytest.mark.anyio
async def test_ready_health_fails_closed_when_database_probe_fails() -> None:
    original_probe = app.state.readiness_probe
    app.state.readiness_probe = lambda: False
    try:
        response = await get("/api/v1/health/ready")
    finally:
        app.state.readiness_probe = original_probe

    assert response.status_code == 503
    assert response.json()["error"]["code"] == "DATABASE_UNAVAILABLE"
    assert (
        response.json()["error"]["request_id"]
        == response.headers["x-request-id"]
    )
