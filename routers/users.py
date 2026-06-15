from datetime import datetime, UTC, timedelta
from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, UploadFile, status
from fastapi.security import OAuth2PasswordRequestForm
from PIL import UnidentifiedImageError
from sqlalchemy import delete as sql_delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from starlette.concurrency import run_in_threadpool

from models import User, Session, PasswordResetToken
from auth import CurrentUser, create_access_token, generate_reset_token, hash_password, hash_reset_token, verify_password

from config import settings
from database import get_db

from schemas import Token, UserCreate, UserPrivate, UserPublic, UserUpdate

router = APIRouter()

@router.post("", response_model=UserPrivate, status_code=status.HTTP_201_CREATED)
async def create_user(
    user: UserCreate,
    db: Annotated[AsyncSession, Depends(get_db)]
):
    result = await db.execute(
        select(User).
        where(func.lower(User.username) == user.username.lower())
    )
    existing_user = result.scalars().first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )
    
    result = await db.execute(
        select(User).
        where(func.lower(User.email) == user.email.lower())
    )
    existing_email = result.scalars().first()

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    new_user = User(
        username=user.username,
        email=user.email.lower(),
        password_hash=hash_password(user.password)
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_db)]
):
    result = await db.execute(
        select(User).
        where(func.lower(User.email) == form_data.username.lower())
    )
    user = result.scalars().first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")


@router.get("/me", response_model=UserPrivate)
async def get_current_user(current_user: CurrentUser):
    return current_user



    

