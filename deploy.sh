#!/bin/bash
# ============================================
# EliteShine ERP - Production Deployment Script
# Optimized for CI/CD pipelines
# ============================================

set -e

echo "=========================================="
echo "  EliteShine ERP - Deployment Automation"
echo "=========================================="

# Step 1: Ensure Docker is ready
if ! command -v docker &> /dev/null; then
    echo "Error: Docker not installed on host."
    exit 1
fi

# Step 2: Setup Environment
PROJECT_DIR="/opt/eliteshine"
mkdir -p $PROJECT_DIR

if [ ! -f $PROJECT_DIR/.env ]; then
    echo "Warning: .env not found in $PROJECT_DIR. Using environment defaults."
fi

# Step 3: Deployment Logic
echo "[1/3] Refreshing container stack..."
# Auth is handled in GitHub Actions before running this
cd $PROJECT_DIR
docker compose pull

echo "[2/3] Restarting services with latest builds..."
docker compose up -d

echo "[3/3] Running post-deployment hooks..."
docker compose exec -T backend python manage.py migrate --noinput
docker compose exec -T backend python manage.py collectstatic --noinput

echo "Pruning stale images..."
docker image prune -f

echo "=========================================="
echo "  EliteShine ERP - Deployment Successful!"
echo "=========================================="
docker compose ps
