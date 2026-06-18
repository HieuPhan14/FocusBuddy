from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select 
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models import User, Session, SessionPreset, SessionStatus
from auth import CurrentUser
from config import settings
from database import get_db
from schemas import SessionCreate, SessionResponse, PaginatedSessionResponse

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


# #####
# while remain_time > 0:

#         if remain_time / (cycle_focus_seconds + cycle_break_seconds) > 1:

#             if session.mode == SessionPreset.light or session.mode == SessionPreset.intense:
#                 focus_counter += 1
#                 if focus_counter % long_break_threshold != 0:
#                     schedule.append((cycle_focus_seconds, cycle_break_seconds))
#                     remain_time = remain_time - cycle_focus_seconds - cycle_break_seconds
#                 else:
#                     schedule.append((cycle_focus_seconds, long_break_cycle))
#                     remain_time = remain_time - cycle_focus_seconds - long_break_cycle
#                     focus_counter = 0
                    
#             elif session.mode == SessionPreset.custom:
#                 total_focus += cycle_focus_seconds
#                 if focus_counter / (180*SECONDS_PER_MINUTE) >= 1 and (cycle_break_seconds < 30*SECONDS_PER_MINUTE):
#                     schedule.append((cycle_focus_seconds, 30*SECONDS_PER_MINUTE))
#                     remain_time = remain_time - cycle_focus_seconds - 30*SECONDS_PER_MINUTE
#                     total_focus = 0
#                 else: 
#                     schedule.append((cycle_focus_seconds, cycle_break_seconds))
#                     remain_time = remain_time - cycle_focus_seconds - cycle_break_seconds

#             elif session.mode == SessionPreset.normal:
#                 schedule.append((cycle_focus_seconds, cycle_break_seconds))
#                 remain_time = remain_time - cycle_focus_seconds - cycle_break_seconds
                
#         else:
#             if remain_time >= MEANINGFUL_FOCUS_CHUNK:
#                 schedule.append((remain_time, 0))
#             else:
#                 if schedule:
#                     schedule[-1] = (schedule[-1][0] + remain_time + schedule[-1][1], 0)
#                 else:
#                     schedule.append((remain_time, 0))
#             remain_time = 0