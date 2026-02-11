# Fix 502 Bad Gateway Error on Hostinger

## Problem
Your application at http://72.61.250.35 is returning 502 Bad Gateway errors:
- GET /forms/job-cards/api/photos/random_backgrounds/?limit=8 - 502
- POST /api/auth/login/ - 502

## Cause
502 errors mean nginx can't communicate with the Django backend. Common causes:
1. Backend container/service is not running
2. Backend crashed or failed to start
3. Port mismatch between nginx and backend
4. Backend is overloaded or timed out

## Solution Steps

### Step 1: SSH into Hostinger Server
```bash
ssh your_username@72.61.250.35
```

### Step 2: Navigate to Project Directory
```bash
cd /opt/eliteshine
# or wherever your project is deployed
```

### Step 3: Check Service Status
```bash
./manage-prod.sh status
# or
docker compose ps
```

Look for the backend service status. It should show "Up" and "healthy".

### Step 4: Check Backend Logs
```bash
./manage-prod.sh logs
# or
docker compose logs backend --tail=100
```

Look for errors like:
- Python import errors
- Database connection failures
- Port binding issues
- Gunicorn startup failures

### Step 5: Restart Services
```bash
./manage-prod.sh restart
# or
docker compose restart
```

### Step 6: If Restart Doesn't Work - Full Rebuild
```bash
# Stop all services
docker compose down

# Rebuild and start
docker compose up -d --build

# Check logs
docker compose logs -f backend
```

### Step 7: Check Nginx Configuration
```bash
# Check if nginx is running
docker compose ps nginx

# Check nginx logs
docker compose logs nginx --tail=50
```

### Step 8: Verify Backend is Accessible
```bash
# From inside the server, test backend directly
curl http://localhost:8000/api/auth/login/

# Or if using docker network
docker compose exec backend curl http://localhost:8000/api/auth/login/
```

## Common Fixes

### Fix 1: Backend Not Running
```bash
docker compose up -d backend
docker compose logs backend
```

### Fix 2: Database Connection Issue
```bash
# Check if database is running
docker compose ps db

# Restart database
docker compose restart db

# Wait 10 seconds, then restart backend
sleep 10
docker compose restart backend
```

### Fix 3: Port Conflict
Check if port 8000 is already in use:
```bash
netstat -tulpn | grep 8000
# or
lsof -i :8000
```

### Fix 4: Memory/Resource Issue
```bash
# Check resource usage
docker stats --no-stream

# If out of memory, restart with more resources
docker compose down
docker compose up -d
```

### Fix 5: Gunicorn Workers Crashed
```bash
# Restart backend with fresh workers
docker compose restart backend

# Or rebuild if needed
docker compose up -d --build backend
```

## Quick Diagnostic Commands

```bash
# 1. Check all containers
docker compose ps

# 2. Check backend health
docker compose exec backend python manage.py check

# 3. Test database connection
docker compose exec backend python manage.py dbshell

# 4. Check nginx config
docker compose exec nginx nginx -t

# 5. View all logs
docker compose logs --tail=200

# 6. Check disk space
df -h

# 7. Check memory
free -h
```

## Prevention

Add health checks to your docker-compose.yml:
```yaml
backend:
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:8000/api/health/"]
    interval: 30s
    timeout: 10s
    retries: 3
    start_period: 40s
```

## If Nothing Works

1. **Check Hostinger Control Panel** - Ensure your VPS/server is running
2. **Check Firewall** - Ensure ports 80, 443, 8000 are open
3. **Check DNS** - Verify IP 72.61.250.35 is correct
4. **Full System Restart**:
   ```bash
   docker compose down
   docker system prune -a -f
   docker compose up -d --build
   ```

## Contact Support
If issue persists, collect these logs and contact support:
```bash
docker compose logs > full_logs.txt
docker compose ps > container_status.txt
docker stats --no-stream > resource_usage.txt
```

## Expected Output When Fixed
After fixing, you should see:
- Backend container status: "Up" and "healthy"
- Nginx logs showing successful proxy_pass to backend
- Login endpoint responding with 200 or 401 (not 502)
- Application accessible at http://72.61.250.35
