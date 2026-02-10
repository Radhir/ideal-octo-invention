#!/bin/bash
# ============================================
# EliteShine ERP - Hostinger VPS Deployment
# Server: srv1306978.hstgr.cloud (72.61.250.35)
# ============================================

set -e

echo "=========================================="
echo "  EliteShine ERP - Deployment Script"
echo "=========================================="

# Step 1: Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "[1/5] Installing Docker..."
    apt-get update
    apt-get install -y ca-certificates curl gnupg
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    systemctl enable docker
    systemctl start docker
    echo "Docker installed successfully!"
else
    echo "[1/5] Docker already installed."
fi

# Step 2: Setup project directory & .env
echo "[2/5] Setting up project..."
PROJECT_DIR="/opt/eliteshine"
mkdir -p $PROJECT_DIR/certbot/conf $PROJECT_DIR/certbot/www

if [ ! -f $PROJECT_DIR/.env ]; then
    SECRET_KEY=$(openssl rand -base64 50 | tr -d '\n')
    DB_PASSWORD=$(openssl rand -base64 24 | tr -d '=/+\n')

    cat > $PROJECT_DIR/.env << EOF
POSTGRES_DB=eliteshine_erp
POSTGRES_USER=eliteshine_user
POSTGRES_PASSWORD=${DB_PASSWORD}
USE_POSTGRES=True
DB_HOST=db
DB_PORT=5432
DEBUG=False
SECRET_KEY=${SECRET_KEY}
ALLOWED_HOSTS=srv1306978.hstgr.cloud,72.61.250.35,localhost
CORS_ALLOWED_ORIGINS=http://srv1306978.hstgr.cloud,http://72.61.250.35
CSRF_TRUSTED_ORIGINS=http://srv1306978.hstgr.cloud,http://72.61.250.35
VITE_API_BASE_URL=/api
EOF
    echo "Generated .env with secure credentials:"
    echo "  DB Password: ${DB_PASSWORD}"
    echo "  (Save these somewhere safe!)"
fi

# Step 3: Open firewall
echo "[3/5] Configuring firewall..."
if command -v ufw &> /dev/null; then
    ufw allow 80/tcp 2>/dev/null || true
    ufw allow 443/tcp 2>/dev/null || true
    ufw allow 22/tcp 2>/dev/null || true
fi

# Step 3.5: Extract project files
echo "[3.5/5] Extracting files..."
if [ -f "project-clean.zip" ]; then
    echo "Extracting project-clean.zip to $PROJECT_DIR..."
    # Install unzip if missing
    if ! command -v unzip &> /dev/null; then
        apt-get install -y unzip
    fi
    unzip -o project-clean.zip -d $PROJECT_DIR
    rm project-clean.zip
fi

if [ -f "patch.zip" ]; then
    echo "Applying patch.zip to $PROJECT_DIR..."
    unzip -o patch.zip -d $PROJECT_DIR
    rm patch.zip
fi

# Step 4: Build and start
echo "[4/5] Building and starting containers..."
cd $PROJECT_DIR
docker compose up --build -d

# Step 5: Verify
echo "[5/5] Checking containers..."
sleep 10
docker compose ps

echo ""
echo "=========================================="
echo "  Deployment Complete!"
echo "=========================================="
echo "  http://72.61.250.35"
echo "  http://srv1306978.hstgr.cloud"
echo "=========================================="
