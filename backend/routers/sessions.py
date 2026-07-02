from datetime import UTC, datetime, timedelta
from typing import Annotated
import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select 
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models import Session, SessionPreset, SessionStatus
from auth import CurrentUser
from config import settings
from database import get_db
from schemas import SessionCreate, SessionResponse, PaginatedSessionResponse, SessionUpdate, StatResponse

router = APIRouter()

SECONDS_PER_MINUTE = 60

# Minimum time for final standalone focus block. If remaining time below this one, it get added 
# to the previous focus block. Never ends a session with break and always preserved users' time input.
MEANINGFUL_FOCUS_CHUNK = 15*SECONDS_PER_MINUTE

PRESET: dict[str, tuple[int, int]] = {
    "light": (90*SECONDS_PER_MINUTE, 20*SECONDS_PER_MINUTE),
    "normal": (52*SECONDS_PER_MINUTE, 17*SECONDS_PER_MINUTE),
    "intense": (25*SECONDS_PER_MINUTE, 5*SECONDS_PER_MINUTE)
}

LONG_BREAK: dict[SessionPreset, tuple[int, int]] = {
    "light": (2, 30*SECONDS_PER_MINUTE),    #bumped every 2nd break to 30 minutes
    "intense": (4, 15*SECONDS_PER_MINUTE)   #bumped every 4th break to 15 minutes
}

def generate_schedule(session: SessionCreate) -> dict:
    remain_time = session.session_planned_seconds
    focus_counter = 0
    total_focus = 0
    schedule = []

    if session.mode != SessionPreset.custom:
        cycle_focus_seconds, cycle_break_seconds = PRESET[session.mode.value]
    else:
        cycle_focus_seconds = session.cycle_focus_seconds
        cycle_break_seconds = session.cycle_break_seconds

    long_break_threshold, long_break_cycle = None, None
    if session.mode.value in LONG_BREAK:
        long_break_threshold, long_break_cycle = LONG_BREAK[session.mode.value]

    while remain_time > 0:
        true_break = cycle_break_seconds

        if session.mode == SessionPreset.light or session.mode == SessionPreset.intense:
            focus_counter += 1
        elif session.mode == SessionPreset.custom:
            total_focus += cycle_focus_seconds

        if long_break_threshold is not None and focus_counter % long_break_threshold == 0:
            true_break = long_break_cycle
            focus_counter = 0

        if total_focus >= (180*SECONDS_PER_MINUTE) and (cycle_break_seconds < 30*SECONDS_PER_MINUTE):
            true_break = 30*SECONDS_PER_MINUTE
            total_focus = 0

        if remain_time > (cycle_focus_seconds + true_break):
            schedule.append((cycle_focus_seconds, true_break))
            remain_time = remain_time - cycle_focus_seconds - true_break
                
        else:
            if remain_time >= MEANINGFUL_FOCUS_CHUNK:
                schedule.append((remain_time, 0))
            else:
                if schedule:
                    schedule[-1] = (schedule[-1][0] + remain_time + schedule[-1][1], 0)
                else:
                    schedule.append((remain_time, 0))
            remain_time = 0

    return {
        "schedule": schedule,
        "cycle_focus_seconds": cycle_focus_seconds,
        "cycle_break_seconds": cycle_break_seconds
    }


@router.post("", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
async def create_session(
    session: SessionCreate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)]
):
    session_info = generate_schedule(session)

    new_session = Session(
        session_planned_seconds=session.session_planned_seconds,
        mode=session.mode,
        cycle_focus_seconds=session_info["cycle_focus_seconds"],
        cycle_break_seconds=session_info["cycle_break_seconds"],
        user_id=current_user.id
    )

    db.add(new_session)
    await db.commit()
    await db.refresh(new_session, attribute_names=["owner"])

    response = SessionResponse.model_validate(new_session)
    return response.model_copy(update={"schedule": session_info["schedule"]})


@router.post("/schedule", status_code=status.HTTP_200_OK)
async def create_session_no_auth(
    session: SessionCreate
):
    return generate_schedule(session)
        

@router.get("", response_model=PaginatedSessionResponse)
async def get_sessions(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    skip: Annotated[int, Query(ge=0)] = 0,
    limit: Annotated[int, Query(ge=1, le=100)] = settings.sessions_per_page
):
    
    count_result = await db.execute(
        select(func.count()).
        select_from(Session).
        where(Session.user_id == current_user.id)
    )
    total = count_result.scalar() or 0

    result = await db.execute(
        select(Session).
        options(selectinload(Session.owner)).
        where(Session.user_id == current_user.id).
        order_by(Session.started_at.desc()).
        offset(skip).
        limit(limit)
    )
    sessions = result.scalars().all()

    has_more = skip + len(sessions) < total

    return PaginatedSessionResponse(
        sessions=[SessionResponse.model_validate(session) for session in sessions],
        total=total,
        skip=skip,
        limit=limit,
        has_more=has_more
    )


@router.get("/stats", response_model=StatResponse)
async def get_user_stats(
    db:  Annotated[AsyncSession, Depends(get_db)],
    current_user: CurrentUser,
):
    result = await db.execute(
        select(Session).
        where(Session.user_id == current_user.id).
        order_by(Session.started_at.desc())
    )
    sessions = result.scalars().all()

    if not sessions:
        return StatResponse()

    last_session_date = sessions[0].started_at
    total_focus_time = 0
    number_of_completed_sessions = 0
    current_streak = 1
    longest_streak = current_streak

    for i, session in enumerate(sessions):
        if i >= 1:
            daygap = sessions[i-1].started_at.date() - sessions[i].started_at.date()
            if daygap == timedelta(days=0):
                pass
            elif daygap == timedelta(days=1):
                current_streak += 1
            else:
                longest_streak = max(current_streak, longest_streak)
                current_streak = 1

        if session.status == SessionStatus.completed:
            number_of_completed_sessions += 1
            total_focus_time += session.session_planned_seconds

        elif session.status == SessionStatus.abandoned:
            total_focus_time += (session.ended_at - session.started_at).total_seconds()

    return StatResponse(
        total_focus_time = round(total_focus_time / 3600, 1),
        number_of_completed_sessions = number_of_completed_sessions,
        last_session_date = last_session_date,
        longest_streak= max(current_streak, longest_streak)
    )

    
@router.get("/{session_id}", response_model=SessionResponse)
async def get_session(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    session_id: uuid.UUID
):
    result = await db.execute(
        select(Session).
        options(selectinload(Session.owner)).
        where(Session.user_id == current_user.id, Session.id == session_id)
    )
    session = result.scalars().first()

    if session:
        session_create = SessionCreate(
            session_planned_seconds=session.session_planned_seconds,
            mode=session.mode,
            cycle_focus_seconds=session.cycle_focus_seconds,
            cycle_break_seconds=session.cycle_break_seconds
        )

        session_info = generate_schedule(session_create)
        response = SessionResponse.model_validate(session)
        return response.model_copy(update={"schedule": session_info["schedule"]})
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Session not found"
    )


@router.patch("/{session_id}", response_model=SessionResponse)
async def update_session_status(
    db: Annotated[AsyncSession, Depends(get_db)],
    session_id: uuid.UUID,
    current_user: CurrentUser,
    status_update: SessionUpdate
):
    result = await db.execute(
        select(Session).
        where(Session.id == session_id)
    )
    session = result.scalars().first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    if session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this session"
        )
    
    session.status = status_update.status
    session.ended_at = datetime.now(UTC)

    await db.commit()
    await db.refresh(session, attribute_names=["owner"])
    return session


@router.delete("/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_session(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    session_id: uuid.UUID
):
    result = await db.execute(
        select(Session).
        where(Session.id == session_id)
    )
    session = result.scalars().first()

    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )

    if session.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this session"
        )
    
    await db.delete(session)
    await db.commit()




