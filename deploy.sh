#!/bin/bash

# ==============================================
# EliteShine ERP - Hostinger VPS Deployment Script
# ==============================================

# Configuration
DOCKER_COMPOSE_FILE="docker-compose.hostinger.yml"
PROJECT_DIR=$(pwd)

echo "🚀 Starting deployment in $PROJECT_DIR..."

# Check if .env exists
if [ ! -f .env ]; then
    if [ -f .env.production ]; then
        echo "⚠️ .env file not found. Copying from .env.production..."
        cp .env.production .env
        echo "‼️ ACTION REQUIRED: Edit the .env file and set your actual production secrets (POSTGRES_PASSWORD, SECRET_KEY, etc.)"
        exit 1
    else
        echo "❌ Error: Neither .env nor .env.production found. Please create one."
        exit 1
    fi
fi

# Check for SSL certificates (first-time setup hint)
if [ ! -d "./certbot/conf/live" ]; then
    echo "ℹ️ SSL certificates not found in ./certbot/conf/live"
    echo "ℹ️ If this is the first time, you may need to run certbot manually once or ensure port 80 is open for the challenge."
fi

# Build and start services
echo "📦 Building and starting containers..."
docker compose -f $DOCKER_COMPOSE_FILE up -d --build

# Clean up
echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment complete!"
echo "📡 Status:"
docker compose -f $DOCKER_COMPOSE_FILE ps
