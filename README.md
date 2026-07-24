# Focus Ducky

**[Try it live → www.focusducky.com](https://www.focusducky.com)**

A cozy focus timer that schedules your breaks using research on attention and
recovery, instead of guessing. No account required to start a session.

## Features

- **Science-backed focus modes** — Light (90/20), Normal (52/17), Intense (25/5
Pomodoro), and Custom, each derived from real research (see the [About
page](https://www.focusducky.com/about) for citations)
- **JWT authentication** — register, log in, forgot/reset password, profile
management, with automatic access-token refresh via refresh tokens
- **Session persistence** — in-progress sessions survive page navigation and
browser refresh
- **Stats dashboard** — total focus time, completed sessions, longest streak,
session history
- **Cozy pixel-art scenes** — 3 parallax background themes (summer, beach,
night) with a companion duck, ambient music
- **Profile customization** — username/email updates, profile picture upload
(S3-backed)

## Tech Stack

**Backend:** FastAPI, PostgreSQL, SQLAlchemy (async) + Alembic, JWT auth (PyJWT + argon2 password hashing), AWS S3 for image storage, Resend (SMTP) for transactional email

**Frontend:** React + TypeScript, Vite, Tailwind CSS v4, React Router v7, Axios, Vitest

## Local Development

**Backend** (requires Python 3.13+, [uv](https://docs.astral.sh/uv/)):

    cd backend
    uv sync
    uv run alembic upgrade head
    uv run fastapi dev main.py

Required environment variables (`backend/.env`) — see `backend/config.py` for the full list:

    DATABASE_URL=postgresql+psycopg://user:password@localhost/focusducky
    SECRET_KEY=your-secret-key
    S3_BUCKET_NAME=your-bucket
    MAIL_SERVER=smtp.resend.com
    MAIL_USERNAME=resend
    MAIL_PASSWORD=your-resend-api-key

**Frontend** (requires Node.js):

    cd frontend
    npm install
    npm run dev

Set `VITE_API_URL` in `frontend/.env` to point at your local backend (default `http://127.0.0.1:8000`).

## Credits

Art assets from Little Dreamyland (paid pack, **not included** in this repo — its license prohibits redistribution). Purchase at [starmixu.itch.io/little-dreamyland-asset-pack](https://starmixu.itch.io/little-dreamyland-asset-pack) and place in `frontend/public/frame/`.

Full credits (icons, music, fonts, research citations) are on the [About page](https://www.focusducky.com/about).

## License

Source available for viewing. Not licensed for reuse.
