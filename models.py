from __future__ import annotations
from enum import Enum
import uuid
from datetime import UTC, datetime
from sqlalchemy import DateTime, ForeignKey, Integer, String, UUID, Enum as SAEnum
from sqlalchemy.orm import relationship, Mapped, mapped_column
from config import settings
from database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(200), nullable=False)
    image_file: Mapped[str | None] = mapped_column(String(200), nullable=True, default= None)

    reset_tokens: Mapped[list[PasswordResetToken]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )

    sessions: Mapped[list[Session]] = relationship(
        back_populates="owner",
        cascade="all, delete-orphan",
    )

    @property
    def image_path(self) -> str:
        if self.image_file:
            return f"https://{settings.s3_bucket_name}.s3.{settings.s3_region}.amazonaws.com/profile_pics/{self.image_file}"
        return "/static/profile_pics/default.jpg"
    

class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

    user: Mapped[User] = relationship(
        back_populates="reset_tokens"
    )

class SessionPreset(str, Enum):
    light = "light"
    normal = "normal"
    intense = "intense"
    custom = "custom"

class SessionStatus(str, Enum):
    completed = "completed"
    abandoned = "abandoned"
    in_progress = "in_progress"

class Session(Base):
    __tablename__ = "sessions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    session_planned_seconds: Mapped[int] = mapped_column(Integer, nullable=False, default=7200)
    mode: Mapped[SessionPreset] = mapped_column(SAEnum(SessionPreset), default=SessionPreset.light)
    status: Mapped[SessionStatus] = mapped_column(
        SAEnum(SessionStatus),
        nullable=True,
        default=SessionStatus.in_progress
    )
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    cycle_focus_seconds: Mapped[int] = mapped_column(Integer, nullable=False, default=3120) # 52 minutes
    cycle_break_seconds: Mapped[int] = mapped_column(Integer, nullable=False, default=1020) # 17 minutes

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    owner: Mapped[User] = relationship(
        back_populates="sessions"
    )