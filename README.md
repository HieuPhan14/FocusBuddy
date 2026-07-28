# Focus Ducky

**[Try it live → focusducky.com](https://focusducky.com)**

A cozy focus timer that schedules your breaks using research on attention and
recovery, instead of guessing. No account required to start a session.

## Features

- **Science-backed focus modes** — Light (90/20), Normal (52/17), Intense (25/5 Pomodoro), and Custom, each derived from real research (see the [About page](https://focusducky.com/about) for citations)
- **JWT authentication** — register, log in, forgot/reset password, profile management, with automatic access-token refresh via refresh tokens
- **Session persistence** — in-progress sessions survive page navigation and browser refresh
- **Stats dashboard** — total focus time, completed sessions, longest streak, session history
- **Cozy pixel-art scenes** — 3 parallax background themes (summer, beach, night) with a companion duck, ambient music
- **Profile customization** — username/email updates, profile picture upload (S3-backed)

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

## Deployment

Single VPS running Docker Compose (API + PostgreSQL) behind Nginx, which also serves the built frontend as static files and handles TLS via Let's Encrypt/Certbot.

**Initial setup** (once per server):

    git clone https://github.com/HieuPhan14/focusducky.git
    cd focusducky
    # create root .env (POSTGRES_USER/PASSWORD/DB) and backend/.env — see backend/config.py for required fields
    docker compose up -d --build
    docker compose exec api alembic upgrade head

The frontend is built separately and served as static files by Nginx — it's not part of Docker Compose:

    cd frontend
    npm run build
    # copy dist/ to the server; point Nginx's root at it

Nginx reverse-proxies `/api/` to the API container (bound to `127.0.0.1:8000`, never exposed directly to the internet) and serves everything else from the built frontend, with a SPA fallback (`try_files $uri /index.html`) so client-side routing survives a page refresh.

**Updating a deployed instance:**

    git pull
    docker compose build api
    docker compose up -d api
    docker compose exec api alembic upgrade head

**Server hardening:**

- SSH key-only authentication (password login and root login both disabled)
- UFW firewall — only SSH, HTTP, and HTTPS ports open
- Fail2Ban — bans IPs after repeated failed SSH attempts
- Automatic security updates (`unattended-upgrades`)
- Nginx security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) plus HSTS with preload
- `.env` files restricted to owner-only read/write (`chmod 600`)
- API container only reachable via Nginx — never exposed directly to the internet

## Credits

Art assets from Little Dreamyland (paid pack, **not included** in this repo — its license prohibits redistribution). Purchase at [starmixu.itch.io/little-dreamyland-asset-pack](https://starmixu.itch.io/little-dreamyland-asset-pack) and place in `frontend/public/frame/`.

Full credits (icons, music, fonts, research citations) are on the [About page](https://focusducky.com/about).

## License

Source available for viewing. Not licensed for reuse.