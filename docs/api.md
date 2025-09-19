# DevicePricePro API Documentation

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://api.devicepricepro.com`

## Authentication

The API uses JWT (JSON Web Token) based authentication. Include the token in the Authorization header for protected endpoints.

```
Authorization: Bearer <your_jwt_token>
```

## Content Types

- **Request**: `application/json` or `multipart/form-data` (file uploads)
- **Response**: `application/json`

## Response Format

All API responses follow this standard format:

**Success Response:**
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation completed successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

## Endpoints

### Authentication Endpoints

#### 1. User Registration

**Endpoint:** `POST /auth/register`  
**Authentication:** Not required  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password123",
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

#### 2. User Login

**Endpoint:** `POST /auth/login`  
**Authentication:** Not required  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secure_password123"
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

#### 3. User Logout

**Endpoint:** `POST /auth/logout`  
**Authentication:** Required  

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Prediction Endpoints

#### 4. Single Device Prediction

**Endpoint:** `POST /predict/single`  
**Authentication:** Required  
**Content-Type:** `application/json`

**Request Body:**
```json
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
  "condition": "Excellent",
  "color": "Deep Purple",
  "network_type": "5G"
}
```

**Required Fields:**
- `brand` (string): Device manufacturer
- `ram_gb` (number): RAM in gigabytes
- `storage_gb` (number): Storage capacity in gigabytes

**Response:**
```json
{
  "success": true,
  "data": {
    "predicted_price": 899.45,
    "confidence": 0.87,
    "price_range": "Premium",
    "prediction_id": "pred_123456789",
    "device_specs": {
      "brand": "Apple",
      "model": "iPhone 14",
      "ram_gb": 6,
      "storage_gb": 128
    }
  },
  "message": "Price prediction completed successfully"
}
```

#### 5. Batch Predictions

**Endpoint:** `POST /predict/batch`  
**Authentication:** Required  
**Content-Type:** `multipart/form-data`

**Request:**
Upload CSV file with device specifications:

```csv
brand,model,ram_gb,storage_gb,screen_size,operating_system,camera_mp,battery_mah,age_years,condition
Apple,iPhone 14,6,128,6.1,iOS,48,3279,1,Excellent
Samsung,Galaxy S23,8,256,6.1,Android,50,3900,0,New
Google,Pixel 7,8,128,6.3,Android,50,4355,1,Good
```

**Response:**
```json
{
  "success": true,
  "data": {
    "batch_id": "batch_123456789",
    "total_predictions": 3,
    "successful_predictions": 3,
    "failed_predictions": 0,
    "results": [
      {
        "row_id": 1,
        "predicted_price": 799.23,
        "confidence": 0.89,
        "price_range": "Premium",
        "device": {
          "brand": "Apple",
          "model": "iPhone 14"
        }
      },
      {
        "row_id": 2,
        "predicted_price": 899.87,
        "confidence": 0.91,
        "price_range": "Premium",
        "device": {
          "brand": "Samsung",
          "model": "Galaxy S23"
        }
      }
    ],
    "summary": {
      "average_price": 849.55,
      "min_price": 699.45,
      "max_price": 899.87,
      "average_confidence": 0.9
    }
  },
  "message": "Batch prediction completed successfully"
}
```

#### 6. Prediction History

**Endpoint:** `GET /predict/history`  
**Authentication:** Required  

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `type` (optional): Filter by prediction type ("single" or "batch")
- `brand` (optional): Filter by device brand

**Example:** `GET /predict/history?page=1&limit=10&brand=Apple`

**Response:**
```json
{
  "success": true,
  "data": {
    "predictions": [
      {
        "id": 1,
        "predicted_price": 899.45,
        "confidence": 0.87,
        "price_range": "Premium",
        "prediction_type": "single",
        "device_specs": {
          "brand": "Apple",
          "model": "iPhone 14",
          "ram_gb": 6,
          "storage_gb": 128
        },
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "total_pages": 5
    }
  },
  "message": "Prediction history retrieved successfully"
}
```

### User Management Endpoints

#### 7. Get User Profile

**Endpoint:** `GET /user/profile`  
**Authentication:** Required  

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "created_at": "2024-01-01T12:00:00Z",
    "total_predictions": 25,
    "last_login": "2024-01-15T10:30:00Z"
  },
  "message": "Profile retrieved successfully"
}
```

#### 8. Update User Profile

**Endpoint:** `PUT /user/profile`  
**Authentication:** Required  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "email": "johnsmith@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "johnsmith@example.com",
    "first_name": "John",
    "last_name": "Smith"
  },
  "message": "Profile updated successfully"
}
```

### System Endpoints

#### 9. Health Check

**Endpoint:** `GET /health`  
**Authentication:** Not required  

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "model_status": "loaded",
    "database_status": "connected",
    "uptime_seconds": 8127,
    "version": "1.0.0"
  },
  "message": "API is running smoothly"
}
```

#### 10. Model Information

**Endpoint:** `GET /model/info`  
**Authentication:** Not required  

**Response:**
```json
{
  "success": true,
  "data": {
    "model_type": "LightGBM Pipeline",
    "model_file": "lgb_pipeline.pkl",
    "supported_features": [
      "brand",
      "model", 
      "screen_size",
      "ram_gb",
      "storage_gb",
      "operating_system",
      "camera_mp",
      "battery_mah",
      "age_years",
      "condition",
      "color",
      "network_type"
    ],
    "supported_brands": [
      "Apple",
      "Samsung",
      "Google",
      "OnePlus",
      "Xiaomi",
      "Huawei",
      "Sony",
      "Motorola"
    ]
  },
  "message": "Model information retrieved successfully"
}
```

## Error Codes

| HTTP Status | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid input parameters or malformed request |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Endpoint or resource not found |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Server processing error |

## Sample Requests

### cURL Examples

**User Registration:**
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

**User Login:**
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Single Prediction:**
```bash
curl -X POST http://localhost:5000/predict/single \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "brand": "Apple",
    "model": "iPhone 14",
    "ram_gb": 6,
    "storage_gb": 128,
    "screen_size": 6.1,
    "operating_system": "iOS",
    "camera_mp": 48,
    "battery_mah": 3279,
    "age_years": 1
  }'
```

**Batch Upload:**
```bash
curl -X POST http://localhost:5000/predict/batch \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@devices.csv"
```

**Get Prediction History:**
```bash
curl -X GET "http://localhost:5000/predict/history?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### JavaScript Examples

**Login and Get Token:**
```javascript
const axios = require('axios');

async function loginUser() {
  try {
    const response = await axios.post('http://localhost:5000/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = response.data.token;
    console.log('Login successful, token:', token);
    return token;
  } catch (error) {
    console.error('Login failed:', error.response.data);
  }
}
```

**Single Prediction:**
```javascript
async function predictPrice(token) {
  try {
    const response = await axios.post(
      'http://localhost:5000/predict/single',
      {
        brand: 'Apple',
        model: 'iPhone 14 Pro',
        ram_gb: 6,
        storage_gb: 256,
        screen_size: 6.1,
        operating_system: 'iOS',
        camera_mp: 48,
        battery_mah: 3200,
        age_years: 1
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Predicted price:', response.data.data.predicted_price);
    return response.data;
  } catch (error) {
    console.error('Prediction failed:', error.response.data);
  }
}
```

**Batch Upload:**
```javascript
const FormData = require('form-data');
const fs = require('fs');

async function uploadBatch(token) {
  const form = new FormData();
  form.append('file', fs.createReadStream('devices.csv'));
  
  try {
    const response = await axios.post(
      'http://localhost:5000/predict/batch',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('Batch predictions:', response.data.data.results);
    return response.data;
  } catch (error) {
    console.error('Batch upload failed:', error.response.data);
  }
}
```

### Python Examples

**Complete Workflow:**
```python
import requests
import json

# Base URL
BASE_URL = 'http://localhost:5000'

# 1. Register user
def register_user():
    url = f'{BASE_URL}/auth/register'
    data = {
        'username': 'testuser',
        'email': 'test@example.com', 
        'password': 'password123',
        'first_name': 'Test',
        'last_name': 'User'
    }
    
    response = requests.post(url, json=data)
    if response.status_code == 201:
        print('User registered successfully')
        return response.json()
    else:
        print(f'Registration failed: {response.json()}')
        return None

# 2. Login user
def login_user():
    url = f'{BASE_URL}/auth/login'
    data = {
        'email': 'test@example.com',
        'password': 'password123'
    }
    
    response = requests.post(url, json=data)
    if response.status_code == 200:
        token = response.json()['token']
        print('Login successful')
        return token
    else:
        print(f'Login failed: {response.json()}')
        return None

# 3. Make prediction
def predict_device_price(token):
    url = f'{BASE_URL}/predict/single'
    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json'
    }
    data = {
        'brand': 'Samsung',
        'model': 'Galaxy S23',
        'ram_gb': 8,
        'storage_gb': 256,
        'screen_size': 6.1,
        'operating_system': 'Android',
        'camera_mp': 50,
        'battery_mah': 3900,
        'age_years': 0
    }
    
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        result = response.json()
        price = result['data']['predicted_price']
        confidence = result['data']['confidence']
        print(f'Predicted price: ${price:.2f} (confidence: {confidence:.2f})')
        return result
    else:
        print(f'Prediction failed: {response.json()}')
        return None

# 4. Get prediction history
def get_history(token):
    url = f'{BASE_URL}/predict/history'
    headers = {'Authorization': f'Bearer {token}'}
    params = {'page': 1, 'limit': 10}
    
    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        history = response.json()
        print(f"Total predictions: {history['data']['pagination']['total']}")
        return history
    else:
        print(f'Failed to get history: {response.json()}')
        return None

# Usage example
if __name__ == '__main__':
    # Register and login
    register_user()
    token = login_user()
    
    if token:
        # Make predictions
        predict_device_price(token)
        
        # Get history
        get_history(token)
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);
```

### Device Predictions Table
```sql
CREATE TABLE device_predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    brand VARCHAR(50) NOT NULL,
    model VARCHAR(100),
    predicted_price FLOAT NOT NULL,
    confidence FLOAT,
    prediction_type VARCHAR(20),
    batch_id VARCHAR(100),
    device_specs JSON,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## Rate Limits

- **Development**: No limits
- **Production**: 
  - 1000 requests per hour per user
  - 100 batch uploads per day per user
  - 50 registrations per hour per IP

## Changelog

### v1.0.0 (Current)
- JWT authentication system
- Single and batch predictions
- User management
- Prediction history with filtering
- SQLite database integration
- LightGBM model integration

### Future Versions
- **v1.1.0**: Enhanced analytics endpoints
- **v1.2.0**: Model performance metrics
- **v1.3.0**: Advanced filtering and search
- **v2.0.0**: Real-time predictions via WebSocket

## Support

- **GitHub Issues**: https://github.com/yourusername/DevicePricePro/issues
- **Email**: support@devicepricepro.com
- **Documentation**: Full API docs available in repository

---

**Last Updated**: December 2024  
**API Version**: 1.0.0
