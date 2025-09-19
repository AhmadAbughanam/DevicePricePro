# DevicePricePro Backend API

> Flask-based REST API for AI-powered device price predictions with user authentication and comprehensive data management.

## Features

### Core Functionality
- **ML-Powered Predictions** - LightGBM model for accurate device price forecasting
- **Single & Batch Processing** - Individual predictions and CSV bulk processing
- **User Authentication** - JWT-based secure authentication system
- **Prediction History** - Complete tracking of user predictions with metadata
- **User Management** - Profile management and account settings

### Technical Features
- **RESTful API** - Clean, documented endpoints following REST principles
- **SQLite Database** - Lightweight, file-based database with SQLAlchemy ORM
- **Model Pipeline** - Preprocessing and feature engineering pipeline
- **Error Handling** - Comprehensive error handling with meaningful responses
- **CORS Support** - Cross-origin requests for frontend integration
- **Input Validation** - Request validation and sanitization

## Tech Stack

- **Flask 2.x** - Web framework
- **SQLAlchemy** - Database ORM
- **LightGBM** - Machine learning model
- **JWT** - Authentication tokens
- **Pandas** - Data processing
- **Scikit-learn** - Data preprocessing pipeline
- **SQLite** - Database
- **Python 3.9+** - Runtime environment

## Quick Start

### Prerequisites
- Python 3.9 or higher
- pip package manager
- Virtual environment (recommended)

### Installation

1. **Clone and navigate to backend**
   ```bash
   cd DevicePricePro/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Initialize database**
   ```bash
   python -c "from app import db; db.create_all()"
   ```

6. **Run the application**
   ```bash
   python app.py
   ```

7. **API available at**
   ```
   http://localhost:5000
   ```

## Project Structure

```
backend/
├── app.py                  # Main Flask application
├── config.py               # Application configuration
├── requirements.txt        # Python dependencies
├── Dockerfile             # Container configuration
├── .env                   # Environment variables
├── models/                # Database models
│   ├── __init__.py
│   ├── user.py           # User model
│   └── device.py         # Device/Prediction model
├── models-ai/            # Machine learning models
│   └── lgb_pipeline.pkl  # Trained LightGBM pipeline
├── routes/               # API route handlers
│   ├── __init__.py
│   ├── auth_routes.py    # Authentication endpoints
│   ├── prediction_routes.py # Prediction endpoints
│   └── user_routes.py    # User management endpoints
├── services/             # Business logic layer
│   ├── __init__.py
│   ├── auth_service.py   # Authentication logic
│   └── device_service.py # Prediction logic
├── utils/                # Utility functions
│   ├── __init__.py
│   ├── validators.py     # Input validation
│   └── helpers.py        # Helper functions
├── database/             # SQLite database files
│   └── app.db           # Application database
└── db/                   # Database utilities and migrations
```

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password",
  "first_name": "John",
  "last_name": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user_id": 1
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

### Prediction Endpoints

#### Single Device Prediction
```http
POST /predict/single
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "brand": "Apple",
  "model": "iPhone 14",
  "screen_size": 6.1,
  "ram_gb": 6,
  "storage_gb": 128,
  "operating_system": "iOS",
  "camera_mp": 48,
  "battery_mah": 3279,
  "age_years": 1,
  "condition": "Excellent"
}
```

**Response:**
```json
{
  "success": true,
  "prediction": {
    "predicted_price": 899.99,
    "confidence": 0.92,
    "price_range": "Premium",
    "prediction_id": "pred_123456789"
  },
  "device_info": {
    "brand": "Apple",
    "model": "iPhone 14",
    "specifications": {...}
  }
}
```

#### Batch Predictions
```http
POST /predict/batch
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

file: devices.csv
```

**CSV Format:**
```csv
brand,model,screen_size,ram_gb,storage_gb,operating_system,camera_mp,battery_mah,age_years,condition
Apple,iPhone 14,6.1,6,128,iOS,48,3279,1,Excellent
Samsung,Galaxy S23,6.1,8,256,Android,50,3900,0,New
```

**Response:**
```json
{
  "success": true,
  "batch_id": "batch_123456789",
  "total_predictions": 2,
  "results": [
    {
      "row_id": 1,
      "predicted_price": 899.99,
      "confidence": 0.92,
      "device": {...}
    },
    {...}
  ],
  "summary": {
    "average_price": 849.99,
    "price_range_distribution": {...}
  }
}
```

#### Prediction History
```http
GET /predict/history?page=1&limit=20&filter=brand:Apple
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "predictions": [
    {
      "id": 1,
      "predicted_price": 899.99,
      "confidence": 0.92,
      "device": {...},
      "created_at": "2024-01-15T10:30:00Z",
      "type": "single"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "total_pages": 3
  }
}
```

### User Management

#### Get User Profile
```http
GET /user/profile
Authorization: Bearer <jwt_token>
```

#### Update User Profile
```http
PUT /user/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Smith",
  "email": "johnsmith@example.com"
}
```

## Database Models

### User Model
```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
```

### Device/Prediction Model
```python
class DevicePrediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    brand = db.Column(db.String(50), nullable=False)
    model = db.Column(db.String(100))
    predicted_price = db.Column(db.Float, nullable=False)
    confidence = db.Column(db.Float)
    prediction_type = db.Column(db.String(20))  # 'single' or 'batch'
    batch_id = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    device_specs = db.Column(db.JSON)
```

## Machine Learning Pipeline

### Model Details
- **Algorithm**: LightGBM Gradient Boosting
- **Pipeline**: Preprocessing + Feature Engineering + Model
- **Location**: `models-ai/lgb_pipeline.pkl`
- **Input Features**: 20+ device specifications
- **Output**: Price prediction with confidence score

### Feature Engineering
```python
# Key features processed by the pipeline:
features = [
    'brand', 'model', 'screen_size', 'ram_gb', 'storage_gb',
    'operating_system', 'camera_mp', 'battery_mah', 'age_years',
    'condition', 'network_type', 'processor_speed', 'display_type',
    'build_material', 'color', 'weight', 'thickness', 'water_resistance'
]
```

### Model Loading
```python
import joblib
import pandas as pd

# Load the trained pipeline
pipeline = joblib.load('models-ai/lgb_pipeline.pkl')

# Make prediction
def predict_price(device_data):
    df = pd.DataFrame([device_data])
    prediction = pipeline.predict(df)
    confidence = pipeline.predict_proba(df).max()
    return prediction[0], confidence
```

## Configuration

### Environment Variables
```env
# Flask Configuration
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key

# Database Configuration  
DATABASE_URL=sqlite:///database/app.db

# Model Configuration
MODEL_PATH=models-ai/lgb_pipeline.pkl

# API Configuration
CORS_ORIGINS=http://localhost:3000
MAX_CONTENT_LENGTH=16777216  # 16MB file upload limit
```

### Configuration Class
```python
# config.py
class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///database/app.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
```

## Authentication & Security

### JWT Implementation
```python
from flask_jwt_extended import JWTManager, create_access_token, jwt_required

# Token creation
def create_user_token(user_id):
    additional_claims = {"user_id": user_id}
    access_token = create_access_token(
        identity=user_id,
        additional_claims=additional_claims
    )
    return access_token

# Protected routes
@app.route('/predict/single', methods=['POST'])
@jwt_required()
def predict_single():
    current_user_id = get_jwt_identity()
    # ... prediction logic
```

### Input Validation
```python
def validate_device_input(data):
    required_fields = ['brand', 'model', 'ram_gb', 'storage_gb']
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
    
    # Validate numeric fields
    numeric_fields = ['ram_gb', 'storage_gb', 'screen_size', 'camera_mp']
    for field in numeric_fields:
        if field in data and not isinstance(data[field], (int, float)):
            return False, f"Field {field} must be numeric"
    
    return True, None
```

## Error Handling

### Standard Error Responses
```python
# 400 - Bad Request
{
    "success": false,
    "error": "Invalid input data",
    "details": {"field": "ram_gb must be a number"}
}

# 401 - Unauthorized
{
    "success": false,
    "error": "Authentication required",
    "message": "Please provide a valid JWT token"
}

# 404 - Not Found
{
    "success": false,
    "error": "Resource not found",
    "message": "Prediction with ID 123 not found"
}

# 500 - Internal Server Error
{
    "success": false,
    "error": "Internal server error",
    "message": "An unexpected error occurred"
}
```

## Docker Support

### Dockerfile
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]
```

### Docker Commands
```bash
# Build image
docker build -t devicepricepro-backend .

# Run container
docker run -p 5000:5000 devicepricepro-backend

# Run with Docker Compose
docker-compose up backend
```

## Testing

### Test Structure
```bash
backend/
├── tests/
│   ├── __init__.py
│   ├── test_auth.py         # Authentication tests
│   ├── test_predictions.py  # Prediction endpoint tests
│   ├── test_models.py       # Database model tests
│   └── conftest.py          # Test configuration
```

### Running Tests
```bash
# Install test dependencies
pip install pytest pytest-flask

# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py
```

### Example Test
```python
def test_user_registration(client):
    response = client.post('/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'testpassword123'
    })
    assert response.status_code == 201
    assert response.json['success'] == True
```

## Performance Considerations

### Database Optimization
- Indexed frequently queried fields (user_id, created_at)
- Connection pooling for concurrent requests
- Query optimization with SQLAlchemy

### Model Loading
- Single model load at application startup
- Model cached in memory for fast predictions
- Efficient pandas DataFrame operations

### API Performance
- Request/response compression
- Efficient JSON serialization
- Pagination for large datasets

## Deployment

### Production Setup
```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn --bind 0.0.0.0:5000 app:app

# With multiple workers
gunicorn --bind 0.0.0.0:5000 --workers 4 app:app
```

### Environment Setup
```bash
# Production environment variables
export FLASK_ENV=production
export SECRET_KEY=production-secret-key
export DATABASE_URL=sqlite:///database/production.db
```

## Monitoring & Logging

### Logging Configuration
```python
import logging
from logging.handlers import RotatingFileHandler

# Configure logging
if not app.debug:
    file_handler = RotatingFileHandler('logs/app.log', maxBytes=10240, backupCount=10)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database file
ls -la database/app.db

# Recreate database
python -c "from app import db; db.drop_all(); db.create_all()"
```

#### Model Loading Issues
```bash
# Check model file
ls -la models-ai/lgb_pipeline.pkl

# Verify model format
python -c "import joblib; model = joblib.load('models-ai/lgb_pipeline.pkl'); print(type(model))"
```

#### Port Issues
```bash
# Check if port 5000 is in use
lsof -i :5000

# Kill process using port
kill -9 $(lsof -t -i:5000)
```

## Contributing

### Development Setup
1. Fork the repository
2. Create a virtual environment
3. Install dependencies: `pip install -r requirements.txt`
4. Create feature branch: `git checkout -b feature/new-feature`
5. Make changes and test
6. Submit pull request

### Code Style
- Follow PEP 8 Python style guidelines
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Write comprehensive tests for new features

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

---

**Built with Flask and LightGBM for accurate device price predictions**

For questions or support, please [open an issue](https://github.com/yourusername/DevicePricePro/issues).
