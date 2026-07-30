"""Environment-backed service configuration."""

import os
from dataclasses import dataclass
from functools import lru_cache


@dataclass(frozen=True)
class Settings:
    app_env: str
    app_version: str
    database_url: str
    cors_allowed_origins: tuple[str, ...]


@lru_cache
def get_settings() -> Settings:
    origins = tuple(
        origin.strip()
        for origin in os.getenv(
            "CORS_ALLOWED_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000",
        ).split(",")
        if origin.strip()
    )
    return Settings(
        app_env=os.getenv("APP_ENV", "development"),
        app_version=os.getenv("APP_VERSION", "0.1.0"),
        database_url=os.getenv(
            "DATABASE_URL",
            "postgresql+psycopg://dialysis_app:"
            "change-this-for-local-development@localhost:5432/dialysis_transit",
        ),
        cors_allowed_origins=origins,
    )
