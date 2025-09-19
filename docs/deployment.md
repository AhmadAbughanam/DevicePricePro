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
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
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
- Health Check: http://localhost:5000/health

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

# Create production environment file
cp .env.example .env

# Edit environment file
nano .env

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

    # Authentication endpoints
    location ~ ^/(auth|user)/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
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

Your existing `docker-compose.yml`:

```yaml
version: "3.8"
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app
      - ./backend/database:/app/database
      - ./backend/models-ai:/app/models-ai
    environment:
      - FLASK_ENV=development
      - FLASK_DEBUG=1
    env_file:
      - .env

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - backend
```

### Production Environment

Your `docker-compose.prod.yml`:

```yaml
version: "3.8"
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      - FLASK_ENV=production
    env_file:
      - .env
    volumes:
      - ./backend/database:/app/database
      - ./backend/models-ai:/app/models-ai
      - ./backend/logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:80/"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./frontend/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./ssl:/etc/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped
```

### Production Dockerfiles

**Backend Dockerfile (Production):**

```dockerfile
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd --create-home --shell /bin/bash app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p database logs models-ai

# Set ownership
RUN chown -R app:app /app
USER app

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

EXPOSE 5000
CMD ["python", "app.py"]
```

**Frontend Dockerfile (Production):**

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

# Create nginx user
RUN addgroup -g 101 -S nginx
RUN adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Frontend nginx.conf:**

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
}
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

docker build -t devicepricepro-frontend ./frontend
docker tag devicepricepro-frontend:latest <account-id>.dkr.ecr.us-west-2.amazonaws.com/devicepricepro-frontend:latest
docker push <account-id>.dkr.ecr.us-west-2.amazonaws.com/devicepricepro-frontend:latest
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
    --allow-unauthenticated \
    --memory 2Gi \
    --cpu 2

gcloud run deploy devicepricepro-frontend \
    --image gcr.io/PROJECT-ID/devicepricepro-frontend \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

### Heroku Deployment

```bash
# Install Heroku CLI and login
heroku login

# Create apps
heroku create devicepricepro-backend
heroku create devicepricepro-frontend

# Backend deployment
cd backend
git init
heroku git:remote -a devicepricepro-backend

# Create Procfile
echo "web: python app.py" > Procfile

# Deploy
git add .
git commit -m "Deploy backend"
git push heroku main

# Frontend deployment
cd ../frontend
git init
heroku git:remote -a devicepricepro-frontend

# Create static.json for SPA routing
echo '{"root": "build/", "routes": {"/**": "index.html"}}' > static.json

# Add buildpack
heroku buildpacks:set mars/create-react-app

# Deploy
git add .
git commit -m "Deploy frontend"
git push heroku main
```

## Environment Configuration

### Environment Variables (.env)

```env
# Flask Configuration
FLASK_ENV=production
SECRET_KEY=your-super-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# Database Configuration
DATABASE_URL=sqlite:///database/app.db

# Model Configuration
MODEL_PATH=models-ai/lgb_pipeline.pkl

# CORS Settings
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Logging
LOG_LEVEL=INFO

# Security
BCRYPT_LOG_ROUNDS=12

# Email Configuration (if needed)
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# File Upload Limits
MAX_CONTENT_LENGTH=16777216  # 16MB

# Rate Limiting (if implemented)
RATE_LIMIT_PER_HOUR=1000
```

### Frontend Environment

Frontend environment is handled through `REACT_APP_API_URL` in your build process:

```bash
# Development
REACT_APP_API_URL=http://localhost:5000 npm start

# Production
REACT_APP_API_URL=https://api.yourdomain.com npm run build
```

## Monitoring & Logging

### Application Monitoring

Add monitoring to your Flask app:

```python
# backend/utils/monitoring.py
import time
import psutil
from flask import request, g, current_app
import logging

def setup_monitoring(app):
    @app.before_request
    def before_request():
        g.start_time = time.time()

    @app.after_request
    def after_request(response):
        if hasattr(g, 'start_time'):
            duration = time.time() - g.start_time
            
            # Log request details
            current_app.logger.info(
                f"Request: {request.method} {request.path} - "
                f"Status: {response.status_code} - "
                f"Duration: {duration:.3f}s"
            )

        return response

    return app
```

### Health Check Endpoint

Enhance your health check:

```python
# backend/routes/health.py
from flask import jsonify
import time
import os
from datetime import datetime

@app.route('/health')
def health_check():
    """Comprehensive health check endpoint."""
    start_time = time.time()
    
    health_data = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "DevicePricePro API",
        "version": "1.0.0"
    }
    
    try:
        # Check model file exists
        model_path = os.getenv('MODEL_PATH', 'models-ai/lgb_pipeline.pkl')
        if os.path.exists(model_path):
            health_data["model_status"] = "loaded"
        else:
            health_data["model_status"] = "missing"
            health_data["status"] = "degraded"
        
        # Check database
        if os.path.exists('database/app.db'):
            health_data["database_status"] = "connected"
        else:
            health_data["database_status"] = "missing"
            health_data["status"] = "degraded"
            
    except Exception as e:
        health_data["status"] = "error"
        health_data["error"] = str(e)
    
    health_data["response_time"] = time.time() - start_time
    
    status_code = 200 if health_data["status"] == "healthy" else 503
    return jsonify(health_data), status_code
```

### Logging Configuration

```python
# backend/config.py
import logging
import os

class Config:
    # ... other config
    
    @staticmethod
    def init_app(app):
        # Configure logging
        if not app.debug and not app.testing:
            # Create logs directory
            if not os.path.exists('logs'):
                os.mkdir('logs')
            
            # File handler
            file_handler = logging.FileHandler('logs/app.log')
            file_handler.setFormatter(logging.Formatter(
                '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
            ))
            file_handler.setLevel(logging.INFO)
            app.logger.addHandler(file_handler)
            
            app.logger.setLevel(logging.INFO)
            app.logger.info('DevicePricePro startup')
```

## Backup & Recovery

### Database Backup

Since you're using SQLite, backup is straightforward:

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_FILE="backend/database/app.db"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup SQLite database
if [ -f "$DB_FILE" ]; then
    cp "$DB_FILE" "$BACKUP_DIR/app_backup_$DATE.db"
    echo "Database backed up: app_backup_$DATE.db"
else
    echo "Database file not found: $DB_FILE"
fi

# Backup model files
if [ -d "backend/models-ai" ]; then
    tar -czf "$BACKUP_DIR/models_backup_$DATE.tar.gz" backend/models-ai/
    echo "Models backed up: models_backup_$DATE.tar.gz"
fi

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.db" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### Automated Backups

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh

# Weekly backup notification
0 3 * * 0 echo "Weekly backup completed" | mail -s "DevicePricePro Backup" admin@yourdomain.com
```

## Security Considerations

### API Security

```python
# backend/utils/security.py
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from functools import wraps
import jwt
from flask import request, jsonify, current_app

# Rate limiting
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["1000 per hour"]
)

# JWT token verification
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token is invalid'}), 401
        
        return f(*args, **kwargs)
    return decorated
```

### Input Validation

```python
# backend/utils/validation.py
def validate_device_input(data):
    """Validate device prediction input."""
    required_fields = ['brand', 'ram_gb', 'storage_gb']
    
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
    
    # Validate numeric fields
    numeric_fields = ['ram_gb', 'storage_gb', 'screen_size', 'camera_mp', 'battery_mah']
    for field in numeric_fields:
        if field in data:
            try:
                value = float(data[field])
                if value < 0:
                    return False, f"Field {field} must be positive"
            except (ValueError, TypeError):
                return False, f"Field {field} must be a number"
    
    # Validate string fields
    if len(data['brand'].strip()) == 0:
        return False, "Brand cannot be empty"
    
    return True, None
```

### Docker Security

```dockerfile
# Use specific version tags
FROM python:3.9.17-slim

# Create non-root user
RUN groupadd -r app && useradd -r -g app app

# Set proper permissions
COPY --chown=app:app . /app
USER app

# Health check with timeout
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1
```

## Troubleshooting

### Common Issues

1. **Model Loading Errors**

   ```bash
   # Check if model file exists
   ls -la backend/models-ai/lgb_pipeline.pkl
   
   # Test model loading
   cd backend
   python -c "import joblib; model = joblib.load('models-ai/lgb_pipeline.pkl'); print('Model loaded successfully')"
   ```

2. **Database Issues**

   ```bash
   # Check database file
   ls -la backend/database/app.db
   
   # Check database permissions
   sqlite3 backend/database/app.db ".tables"
   ```

3. **Container Networking**

   ```bash
   # Test backend from frontend container
   docker exec frontend-container curl http://backend:5000/health
   
   # Check container logs
   docker-compose logs backend
   docker-compose logs frontend
   ```

4. **Authentication Issues**

   ```bash
   # Test JWT token generation
   python -c "
   import jwt
   token = jwt.encode({'user_id': 1}, 'your-secret-key', algorithm='HS256')
   print(token)
   "
   ```

### Performance Optimization

```python
# Use connection pooling for database
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool

engine = create_engine(
    'sqlite:///database/app.db',
    poolclass=StaticPool,
    connect_args={
        'check_same_thread': False,
        'timeout': 30
    }
)

# Optimize model predictions
import numpy as np

def batch_predict_optimized(model, data_list):
    """Optimized batch prediction."""
    if len(data_list) == 1:
        return [model.predict([data_list[0]])[0]]
    
    # Batch processing for multiple items
    features_array = np.array([extract_features(item) for item in data_list])
    predictions = model.predict(features_array)
    return predictions.tolist()
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] Database initialized
- [ ] Model file present and loadable
- [ ] Health checks passing
- [ ] Logs configured and rotating
- [ ] Backups scheduled
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Monitoring alerts set up

---

**Deployment Status**: Production Ready  
**Last Updated**: December 2024  
**Next Review**: March 2025
