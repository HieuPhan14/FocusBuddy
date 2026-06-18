from datetime import datetime
from typing import Self
import uuid
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator
import re

from models import SessionPreset, SessionStatus

def validate_password_strength(v: str) -> str:
    if len(v) < 8:
        raise ValueError("Password must be at least 8 characters")
    if not re.search(r"[A-Z]", v):
        raise ValueError("Password must contain at least one uppercase letter")
    if not re.search(r"[0-9]", v):
        raise ValueError("Password must contain at least one number")
    if not re.search(r"[!@#$%^&*]", v):
        raise ValueError("Password must contain at least one special character")
    return v

class UserBase(BaseModel):
    username: str = Field(min_length=1, max_length=50)
    email: EmailStr = Field(max_length=120)

class UserCreate(UserBase):
    password: str

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        return validate_password_strength(v)

class UserPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    username: str 
    image_file: str | None 
    image_path: str 

class UserPrivate(UserPublic):
    email: EmailStr

class UserUpdate(BaseModel):
    username: str | None = Field(default=None, min_length=1, max_length=50)
    email: EmailStr | None = Field(default=None, max_length=120)

class Token(BaseModel):
    access_token: str
    token_type: str

class ForgetPasswordRequest(BaseModel):
    email: EmailStr = Field(max_length=120)

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        return validate_password_strength(v)

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

    @field_validator("new_password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        return validate_password_strength(v)

class SessionBase(BaseModel):
    session_planned_seconds: int = Field(ge=600)

    @field_validator("session_planned_seconds")
    @classmethod
    def validate_session_planned_seconds(cls, v: int):
        if v > 36000:
            raise ValueError("Sessions length are capped at 10 hours to align with healthy focus limits")
        return v
    
    mode: SessionPreset
    cycle_focus_seconds: int | None = Field(default=None, ge=600, le=10800)
    cycle_break_seconds: int | None = Field(default=None, ge=60, le=3600)

    @model_validator(mode="after")
    def validate_custom_session(self) -> Self:
        if self.mode == SessionPreset.custom:
            if self.cycle_focus_seconds is None or self.cycle_break_seconds is None:
                raise ValueError("Custom mode requires both focus and break duration for cycles")
        return self

class SessionCreate(SessionBase):
    pass

class SessionResponse(SessionBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    status: SessionStatus
    started_at: datetime
    ended_at: datetime | None
    owner: UserPublic
    schedule: list[tuple[int, int]] = []

class PaginatedSessionResponse(BaseModel):
    sessions: list[SessionResponse]
    total: int
    skip: int
    limit: int
    has_more: bool
    