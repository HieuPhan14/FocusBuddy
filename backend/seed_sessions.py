"""One-off dev script: seed N test sessions for a user so you can test StatPage pagination/stats.

Usage: uv run seed_sessions.py <email> [count]
"""
import asyncio
import random
import selectors
import sys
from datetime import UTC, datetime, timedelta

from sqlalchemy import select

from database import AsyncSessionLocal
from models import Session, SessionPreset, SessionStatus, User


async def seed(email: str, count: int) -> None:
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == email.lower()))
        user = result.scalars().first()

        if not user:
            print(f"No user found with email {email}")
            return

        now = datetime.now(UTC)

        for i in range(count):
            # spread sessions over the last `count` days, most recent first,
            # with some gaps so streaks aren't just one giant run
            days_ago = i + (i // 5)  # every 5th session skips a day, breaking the streak
            started_at = now - timedelta(days=days_ago, hours=random.randint(0, 5))

            status = random.choice(
                [SessionStatus.completed, SessionStatus.completed, SessionStatus.abandoned]
            )
            planned_seconds = random.choice([1500, 3120, 6000])  # 25min/52min/100min
            ended_at = started_at + timedelta(
                seconds=planned_seconds if status == SessionStatus.completed
                else random.randint(300, planned_seconds)
            )

            db.add(Session(
                session_planned_seconds=planned_seconds,
                mode=random.choice(list(SessionPreset)),
                status=status,
                started_at=started_at,
                ended_at=ended_at,
                cycle_focus_seconds=3120,
                cycle_break_seconds=1020,
                user_id=user.id,
            ))

        await db.commit()
        print(f"Seeded {count} sessions for {email}")


if __name__ == "__main__":
    email = sys.argv[1] if len(sys.argv) > 1 else None
    count = int(sys.argv[2]) if len(sys.argv) > 2 else 33

    if not email:
        print("Usage: uv run seed_sessions.py <email> [count]")
        sys.exit(1)

    asyncio.run(
        seed(email, count),
        loop_factory=lambda: asyncio.SelectorEventLoop(selectors.SelectSelector()),
    )
