#!/bin/bash
set -euo pipefail

echo "==> Deploying backend..."
ssh focusducky "cd /var/www/focusducky && git pull && docker compose build api && docker compose up -d api && docker compose exec api alembic upgrade head"

echo "==> Building frontend..."
cd frontend
npm run build
cd ..

echo "==> Deploying frontend (atomic swap, zero downtime)..."
ssh focusducky "rm -rf /var/www/focusducky/frontend/dist_new"
scp -r frontend/dist focusducky:/var/www/focusducky/frontend/dist_new
ssh focusducky "mv /var/www/focusducky/frontend/dist /var/www/focusducky/frontend/dist_old && mv /var/www/focusducky/frontend/dist_new /var/www/focusducky/frontend/dist && rm -rf /var/www/focusducky/frontend/dist_old"

echo "==> Deploy complete."