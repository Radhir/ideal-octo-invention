#!/bin/bash

# Elite Shine ERP - VPS Redundancy Cleanup Script
# This script identifies and removes non-production containers to resolve conflicts.

echo "=========================================================="
echo "ELITE SHINE ERP - VPS CLEANUP & CONSOLIDATION"
echo "=========================================================="

# 1. Identify containers
echo "[1/3] Identifying redundant containers..."

# Redundant from default docker-compose.yml
CONTAINERS_TO_REMOVE=(
    "eliteshine_erp-db-1"
    "eliteshine_erp-frontend-1"
)

# Orphaned projects
PROJECTS_TO_REMOVE=(
    "eliteshine"
)

# 2. Stop and Remove specific containers
for container in "${CONTAINERS_TO_REMOVE[@]}"; do
    if docker ps -a --format '{{.Names}}' | grep -q "^${container}$"; then
        echo "  - Stopping and removing: ${container}"
        docker stop "${container}"
        docker rm "${container}"
    else
        echo "  - Container not found: ${container} (Skipping)"
    fi
done

# 3. Prune orphaned project if it exists
for project in "${PROJECTS_TO_REMOVE[@]}"; do
    if docker ps -a --format '{{.Names}}' | grep -q "^${project}-"; then
        echo "  - Cleaning up project: ${project}"
        docker ps -a --format '{{.Names}}' | grep "^${project}-" | xargs -r docker stop
        docker ps -a --format '{{.Names}}' | grep "^${project}-" | xargs -r docker rm
    fi
done

# 4. Final Prune (Safe)
echo "[2/3] Pruning unused Docker resources..."
docker image prune -f

# 5. Verify active stack
echo "[3/3] Verifying active Production Stack..."
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep "eliteshine_erp"

echo "=========================================================="
echo "CLEANUP COMPLETE. The Production Stack should now be stable."
echo "=========================================================="
