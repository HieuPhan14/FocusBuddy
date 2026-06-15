from typing import Annotated
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from database import engine, get_db
from routers import users, sessions
from config import settings

@asynccontextmanager
async def lifespan(_app: FastAPI):
    yield
    await engine.dispose()

app = FastAPI(lifespan=lifespan)

app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(users.router, prefix="/api/sessions", tags=["sessions"])

@app.get("/health")
async def health_check(
    db: Annotated[AsyncSession, Depends(get_db)]
):
    try: 
        await db.execute(text("SELECT 1"))
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable"
        ) from exc
    return {"status": "healthy"}