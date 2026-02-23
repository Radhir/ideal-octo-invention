# Backend Dockerfile - Optimized Django Application
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Set work directory
WORKDIR /app

# Install only essential system dependencies
# Consolidated to a single RUN to reduce layers
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    postgresql-client \
    libpq-dev \
    # For PDF Generation & Image Processing
    libcairo2 \
    libffi-dev \
    libjpeg-dev \
    libwebp-dev \
    zlib1g-dev \
    libfreetype6-dev \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    gdk-pixbuf2.0-common \
    libxml2-dev \
    libxslt1-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements_docker.txt requirements.txt

# Install Python dependencies  
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# Copy project (Ensure .dockerignore skips massive folders)
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput || echo "Static files collection skipped"

# Expose port
EXPOSE 8000

# Run migrations and start production server
CMD ["sh", "-c", "python manage.py migrate && gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3 --threads 2 --timeout 120"]
