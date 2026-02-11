#!/bin/bash
# Quick Fix Script for 502 Bad Gateway on Hostinger
# Run this on your Hostinger server at 72.61.250.35

echo "=========================================="
echo "Elite Shine ERP - 502 Error Quick Fix"
echo "=========================================="
echo ""

# Navigate to project directory
PROJECT_DIR="/opt/eliteshine"
if [ ! -d "$PROJECT_DIR" ]; then
    echo "ERROR: Project directory not found at $PROJECT_DIR"
    echo "Please update PROJECT_DIR variable in this script"
    exit 1
fi

cd $PROJECT_DIR
echo "Working directory: $(pwd)"
echo ""

# Step 1: Check current status
echo "[1/6] Checking current container status..."
docker compose ps
echo ""

# Step 2: Check backend logs for errors
echo "[2/6] Checking backend logs (last 50 lines)..."
docker compose logs backend --tail=50
echo ""

# Step 3: Check if backend is responding
echo "[3/6] Testing backend connectivity..."
BACKEND_STATUS=$(docker compose exec -T backend curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/auth/login/ 2>/dev/null || echo "FAILED")
if [ "$BACKEND_STATUS" = "FAILED" ]; then
    echo "❌ Backend is NOT responding - needs restart"
else
    echo "✓ Backend HTTP status: $BACKEND_STATUS"
fi
echo ""

# Step 4: Check database connectivity
echo "[4/6] Checking database status..."
docker compose ps db
DB_STATUS=$(docker compose exec -T db pg_isready -U eliteshine_user 2>/dev/null || echo "FAILED")
if [ "$DB_STATUS" = "FAILED" ]; then
    echo "❌ Database is NOT responding"
else
    echo "✓ Database is ready"
fi
echo ""

# Step 5: Restart services
echo "[5/6] Restarting all services..."
docker compose restart
echo "Waiting 15 seconds for services to start..."
sleep 15
echo ""

# Step 6: Verify fix
echo "[6/6] Verifying services are running..."
docker compose ps
echo ""

echo "Testing backend again..."
BACKEND_STATUS_AFTER=$(docker compose exec -T backend curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/auth/login/ 2>/dev/null || echo "FAILED")
if [ "$BACKEND_STATUS_AFTER" = "FAILED" ]; then
    echo "❌ Backend still not responding"
    echo ""
    echo "NEXT STEPS:"
    echo "1. Check backend logs: docker compose logs backend --tail=100"
    echo "2. Try full rebuild: docker compose down && docker compose up -d --build"
    echo "3. Check disk space: df -h"
    echo "4. Check memory: free -h"
else
    echo "✅ Backend is now responding! HTTP status: $BACKEND_STATUS_AFTER"
    echo ""
    echo "Try accessing your application at: http://72.61.250.35"
fi

echo ""
echo "=========================================="
echo "Quick fix script completed"
echo "=========================================="
