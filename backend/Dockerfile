FROM python:3.11

WORKDIR /app

# Install comprehensive system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    libc6-dev \
    libffi-dev \
    libssl-dev \
    python3-dev \
    pkg-config \
    curl \
    ca-certificates \
    libatlas3-base \
    libopenblas-dev \
    liblapack-dev \
    cmake \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install build tools
RUN python -m pip install --upgrade pip setuptools wheel

# Install packages in specific order to avoid binary incompatibilities
RUN pip install --no-cache-dir --force-reinstall numpy==2.0.2
RUN pip install --no-cache-dir --force-reinstall pandas==2.2.2
RUN pip install --no-cache-dir --force-reinstall scipy==1.13.1
RUN pip install --no-cache-dir --force-reinstall scikit-learn==1.6.1
RUN pip install --no-cache-dir --force-reinstall lightgbm==4.1.0

# Copy requirements and install remaining packages
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Ensure directories exist
RUN mkdir -p /app/models /app/models-ai /app/logs && chmod -R 777 /app/models /app/models-ai /app/logs

# Environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PYTHONPATH=/app

# Non-root user
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app
USER app

EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/ || exit 1

CMD ["python", "app.py"]