# DevicePricePro Deployment Guide

This guide covers deploying DevicePricePro to various environments, from local development to production cloud deployments.

## Table of Contents

- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Environment Configuration](#environment-configuration)
- [Monitoring & Logging](#monitoring--logging)
- [Backup & Recovery](#backup--recovery)
- [Security Considerations](#security-considerations)

## Local Development

### Prerequisites

- Docker & Docker Compose
- Python 3.9+
- Node.js 18+
- Git

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-username/DevicePricePro.git
cd DevicePricePro

# Start with Docker Compose
docker-compose up --build

# Or manually start services
# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend (new terminal)
cd frontend
npm install
npm start
```

**Access Points:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Documentation: http://localhost:5000/docs

## Production Deployment

### System Requirements

**Minimum:**

- 2 CPU cores
- 4GB RAM
- 20GB storage
- Ubuntu 20.04+ / RHEL 8+

**Recommended:**

- 4 CPU cores
- 8GB RAM
- 50GB SSD storage
- Load balancer
- SSL certificate

### Production Setup

#### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install Nginx (reverse proxy)
sudo apt install nginx -y

# Install Certbot (SSL)
sudo apt install certbot python3-certbot-nginx -y
```

#### 2. Application Deployment

```bash
# Clone and setup
git clone https://github.com/your-username/DevicePricePro.git
cd DevicePricePro

# Create production environment files
cp .env.backend.example .env.backend
cp .env.frontend.example .env.frontend

# Edit environment files
nano .env.backend
nano .env.frontend

# Deploy with production compose
docker-compose -f docker-compose.prod.yml up -d --build
```

#### 3. Nginx Configuration

Create `/etc/nginx/sites-available/devicepricepro`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozTLS:10m;
    ssl_session_tickets off;

    # Modern configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000" always;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # Frontend (React)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Increase timeout for ML predictions
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:3000;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/devicepricepro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. SSL Certificate

```bash
# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

## Docker Deployment

### Development Environment

```yaml
# docker-compose.yml
version: "3.8"
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app
    environment:
      - FLASK_ENV=development
      - FLASK_DEBUG=1
    env_file:
      - .env.backend

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
    env_file:
      - .env.frontend
```

### Production Environment

```yaml
# docker-compose.prod.yml
version: "3.8"
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    restart: unless-stopped
    environment:
      - FLASK_ENV=production
    env_file:
      - .env.backend
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    restart: unless-stopped
    env_file:
      - .env.frontend
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
```

### Multi-Stage Production Dockerfiles

**Backend Dockerfile.prod:**

```dockerfile
# Build stage
FROM python:3.9-slim as builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.9-slim

# Create non-root user
RUN useradd --create-home --shell /bin/bash app

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder /root/.local /home/app/.local
ENV PATH=/home/app/.local/bin:$PATH

# Copy application
COPY . .

# Set ownership
RUN chown -R app:app /app
USER app

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:5000/health')"

EXPOSE 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]
```

**Frontend Dockerfile.prod:**

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Cloud Deployment

### AWS Deployment (ECS)

#### 1. ECR Setup

```bash
# Create repositories
aws ecr create-repository --repository-name devicepricepro-backend
aws ecr create-repository --repository-name devicepricepro-frontend

# Get login token
aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-west-2.amazonaws.com

# Build and push
docker build -t devicepricepro-backend ./backend
docker tag devicepricepro-backend:latest <account-id>.dkr.ecr.us-west-2.amazonaws.com/devicepricepro-backend:latest
docker push <account-id>.dkr.ecr.us-west-2.amazonaws.com/devicepricepro-backend:latest
```

#### 2. ECS Task Definition

```json
{
  "family": "devicepricepro",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "<account-id>.dkr.ecr.us-west-2.amazonaws.com/devicepricepro-backend:latest",
      "portMappings": [
        {
          "containerPort": 5000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "FLASK_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/devicepricepro",
          "awslogs-region": "us-west-2",
          "awslogs-stream-prefix": "ecs"
        }
      }
    },
    {
      "name": "frontend",
      "image": "<account-id>.dkr.ecr.us-west-2.amazonaws.com/devicepricepro-frontend:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "REACT_APP_API_URL",
          "value": "https://api.yourdomain.com"
        }
      ]
    }
  ]
}
```

### Google Cloud Platform (Cloud Run)

```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT-ID/devicepricepro-backend ./backend
gcloud builds submit --tag gcr.io/PROJECT-ID/devicepricepro-frontend ./frontend

# Deploy to Cloud Run
gcloud run deploy devicepricepro-backend \
    --image gcr.io/PROJECT-ID/devicepricepro-backend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated

gcloud run deploy devicepricepro-frontend \
    --image gcr.io/PROJECT-ID/devicepricepro-frontend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

### Heroku Deployment

```bash
# Install Heroku CLI
# Create apps
heroku create devicepricepro-backend
heroku create devicepricepro-frontend

# Backend deployment
cd backend
heroku container:push web --app devicepricepro-backend
heroku container:release web --app devicepricepro-backend

# Frontend deployment
cd ../frontend
heroku container:push web --app devicepricepro-frontend
heroku container:release web --app devicepricepro-frontend
```

## Environment Configuration

### Backend Environment (.env.backend)

```env
# Flask Configuration
FLASK_ENV=production
FLASK_DEBUG=0
SECRET_KEY=your-secret-key-here

# Model Configuration
ML_MODEL_PATH=/app/models/model.joblib
MODEL_VERSION=1.0.0

# Database Configuration (if using)
DATABASE_URL=postgresql://user:password@localhost/devicepricepro

# Logging
LOG_LEVEL=INFO
LOG_FILE=/app/logs/app.log

# CORS Settings
CORS_ORIGINS=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_PER_HOUR=1000
RATE_LIMIT_STORAGE_URL=redis://localhost:6379

# Monitoring
SENTRY_DSN=your-sentry-dsn
HEALTH_CHECK_TOKEN=your-health-check-token

# Email Configuration (for notifications)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Frontend Environment (.env.frontend)

```env
# API Configuration
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_API_VERSION=v1

# Environment
REACT_APP_ENVIRONMENT=production

# Analytics
REACT_APP_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
REACT_APP_HOTJAR_ID=HOTJAR_ID

# Feature Flags
REACT_APP_ENABLE_BATCH_UPLOAD=true
REACT_APP_ENABLE_SHAP_EXPLANATIONS=true
REACT_APP_ENABLE_DARK_MODE=true

# Error Tracking
REACT_APP_SENTRY_DSN=your-frontend-sentry-dsn

# CDN Configuration
REACT_APP_CDN_URL=https://cdn.yourdomain.com

# Social Login (future feature)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
REACT_APP_GITHUB_CLIENT_ID=your-github-client-id
```

## Monitoring & Logging

### Application Monitoring

```python
# backend/utils/monitoring.py
import time
import psutil
from flask import request, g
import logging

def setup_monitoring(app):
    @app.before_request
    def before_request():
        g.start_time = time.time()

    @app.after_request
    def after_request(response):
        duration = time.time() - g.start_time

        # Log request details
        logging.info(f"Request: {request.method} {request.path} - "
                    f"Status: {response.status_code} - "
                    f"Duration: {duration:.3f}s")

        # Add performance headers
        response.headers['X-Response-Time'] = f"{duration:.3f}s"
        response.headers['X-Memory-Usage'] = f"{psutil.Process().memory_info().rss / 1024 / 1024:.1f}MB"

        return response
```

### Health Check Endpoint

```python
# backend/routes/health.py
from flask import Blueprint, jsonify
import time
import psutil
from datetime import datetime

health_bp = Blueprint('health', __name__)

@health_bp.route('/health')
def health_check():
    start_time = time.time()

    # Check model status
    model_status = "loaded" if predictor.model else "error"

    # System metrics
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage('/')

    health_data = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "uptime": time.time() - app_start_time,
        "model_status": model_status,
        "system": {
            "memory_usage_percent": memory.percent,
            "disk_usage_percent": disk.percent,
            "cpu_count": psutil.cpu_count()
        },
        "response_time": time.time() - start_time
    }

    return jsonify(health_data), 200
```

### Logging Configuration

```python
# backend/config/logging.py
import logging
import logging.handlers
import os

def setup_logging():
    log_level = os.getenv('LOG_LEVEL', 'INFO')
    log_file = os.getenv('LOG_FILE', 'logs/app.log')

    # Create logs directory
    os.makedirs(os.path.dirname(log_file), exist_ok=True)

    # Configure logging
    logging.basicConfig(
        level=getattr(logging, log_level),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            # Console handler
            logging.StreamHandler(),
            # File handler with rotation
            logging.handlers.RotatingFileHandler(
                log_file, maxBytes=10*1024*1024, backupCount=5
            )
        ]
    )
```

## Backup & Recovery

### Database Backup (if using database)

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="devicepricepro"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
pg_dump $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Backup model files
tar -czf $BACKUP_DIR/models_backup_$DATE.tar.gz backend/models/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### Automated Backups

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh

# Weekly full backup
0 3 * * 0 /path/to/full_backup.sh
```

## Security Considerations

### HTTPS/TLS Configuration

```nginx
# Strong SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;

# Security headers
add_header Strict-Transport-Security "max-age=63072000" always;
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;
add_header X-XSS-Protection "1; mode=block";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

### API Security

```python
# Rate limiting
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["1000 per hour"]
)

@app.route('/predict')
@limiter.limit("100 per hour")
def predict():
    # Prediction logic
    pass
```

### Docker Security

```dockerfile
# Use non-root user
RUN useradd --create-home --shell /bin/bash app
USER app

# Security scanning
RUN apk add --no-cache ca-certificates && update-ca-certificates

# Remove unnecessary packages
RUN apt-get autoremove -y && apt-get clean
```

## Troubleshooting

### Common Issues

1. **Container fails to start**

   ```bash
   docker logs container_name
   docker-compose logs service_name
   ```

2. **Memory issues**

   ```bash
   # Increase Docker memory limits
   docker run --memory=4g your_image
   ```

3. **Model loading errors**

   ```bash
   # Check model file exists and permissions
   ls -la backend/models/
   ```

4. **Network connectivity**
   ```bash
   # Test container networking
   docker exec -it container_name ping backend
   ```

### Performance Optimization

```python
# Use Gunicorn for production
gunicorn --bind 0.0.0.0:5000 --workers 4 --worker-class gevent app:app

# Enable caching
from flask_caching import Cache
cache = Cache(app, config={'CACHE_TYPE': 'redis'})
```

---

**Deployment Status**: Ready for Production  
**Last Updated**: September 16, 2025  
**Next Review**: December 2025
