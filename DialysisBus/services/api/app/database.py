"""SQLAlchemy engine lifecycle and readiness probe."""

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine

from .config import get_settings

_engine: Engine | None = None


def get_engine() -> Engine:
    global _engine
    if _engine is None:
        _engine = create_engine(
            get_settings().database_url,
            connect_args={"connect_timeout": 2},
            pool_pre_ping=True,
            pool_recycle=300,
            pool_timeout=2,
        )
    return _engine


def database_is_ready() -> bool:
    with get_engine().connect() as connection:
        connection.execute(text("SELECT 1"))
    return True
