#!/bin/bash
# EliteShine ERP - Production Management Utility

set -e

PROJECT_DIR="/opt/eliteshine"
cd $PROJECT_DIR

function usage() {
    echo "Usage: ./manage-prod.sh [command]"
    echo ""
    echo "Commands:"
    echo "  status       Check health of all components"
    echo "  logs         Tail logs from all services"
    echo "  restart      Restart all services"
    echo "  update       Pull latest images and restart (CI/CD utility)"
    echo "  db-backup    Perform a PostgreSQL database dump"
    echo "  db-shell     Enter the PostgreSQL shell"
    echo "  shell        Enter the backend bash shell"
}

case "$1" in
    status)
        echo "=== Component Health Status ==="
        docker compose ps
        echo ""
        echo "=== Resource Usage ==="
        docker stats --no-stream
        ;;
    logs)
        docker compose logs -f --tail=100
        ;;
    restart)
        echo "Restarting services..."
        docker compose restart
        ;;
    update)
        echo "Updating system..."
        docker compose pull
        docker compose up -d
        docker image prune -f
        ;;
    db-backup)
        TIMESTAMP=$(date +%Y%m%d_%H%M%S)
        mkdir -p ./backups
        echo "Backing up database to ./backups/db_backup_$TIMESTAMP.sql..."
        docker compose exec -T db pg_dump -U eliteshine_user eliteshine_erp > ./backups/db_backup_$TIMESTAMP.sql
        echo "Backup complete."
        ;;
    db-shell)
        docker compose exec db psql -U eliteshine_user -d eliteshine_erp
        ;;
    shell)
        docker compose exec backend bash
        ;;
    *)
        usage
        ;;
esac
