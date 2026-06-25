from typing import Annotated
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from database import engine, get_db
from routers import users, sessions
from config import settings

from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(_app: FastAPI):
    yield
    await engine.dispose()

app = FastAPI(lifespan=lifespan)

app.mount("/static", StaticFiles(directory="static"), name="static")

origins = ["http://localhost:5173"]

app.add_middleware(
  CORSMiddleware,
  allow_origins = origins,
  allow_credentials=True,
  allow_methods = ["*"],
  allow_headers = ["*"]
)
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(sessions.router, prefix="/api/sessions", tags=["sessions"])


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