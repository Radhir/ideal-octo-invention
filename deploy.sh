#!/bin/bash

# Configuration
PROJECT_DIR="webplot" # Folder name on server

echo "🚀 Starting Automated Deployment for EliteShine..."

# Navigate to project directory
if [ ! -d "$PROJECT_DIR" ]; then
    echo "📥 Cloning project for the first time..."
    # User will need to run git clone once manually or we can ask for URL
    # git clone <GIT_URL> $PROJECT_DIR
    echo "❌ Project folder not found. Please ensure you are in the parent directory of $PROJECT_DIR"
    exit 1
fi

cd $PROJECT_DIR

echo "📥 Pulling latest changes from GitHub..."
git pull origin main

echo "🐳 Rebuilding Docker containers..."
# Use --build to ensure code changes are baked into images
docker compose up --build -d

echo "📊 Running Database Migrations..."
docker exec eliteshine_backend python manage.py migrate

echo "✅ Deployment Successful!"
echo "Global IP: http://72.61.250.35"
echo "Cloud URL: http://srv1306978.hstgr.cloud"
