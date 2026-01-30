# Backend Dockerfile - Django Application
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Set work directory
WORKDIR /app

# Install system dependencies for Python packages
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    postgresql-client \
    libpq-dev \
    python3-dev \
    libcairo2-dev \
    pkg-config \
    # For Pillow/PIL
    libjpeg-dev \
    zlib1g-dev \
    libfreetype6-dev \
    liblcms2-dev \
    libwebp-dev \
    # For OpenCV
    libopencv-dev \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    # For numpy/scipy
    libopenblas-dev \
    liblapack-dev \
    gfortran \
    # For other packages
    libffi-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements_docker.txt requirements.txt

# Install Python dependencies  
RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

# Copy project
COPY . .

# Collect static files
RUN python manage.py collectstatic --noinput || echo "Static files collection skipped"

# Expose port
EXPOSE 8000

# Run migrations and start production server with Gunicorn
CMD ["sh", "-c", "python manage.py migrate && gunicorn core.wsgi:application --bind 0.0.0.0:8000 --workers 3 --threads 2 --timeout 120"]
