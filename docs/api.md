# DevicePricePro API Documentation

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://api.devicepricepro.com`

## Authentication

Currently, the API is open and doesn't require authentication. Future versions will implement API key authentication.

## Content Types

- **Request**: `application/json` or `multipart/form-data` (file uploads)
- **Response**: `application/json`

## Response Format

All API responses follow this standard format:

```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation completed successfully",
  "timestamp": "2025-09-16T20:30:45Z",
  "version": "1.0.0"
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": ["Brand is required", "RAM must be positive"]
  },
  "timestamp": "2025-09-16T20:30:45Z",
  "version": "1.0.0"
}
```

## Endpoints

### 1. Health Check

Check if the API is running and healthy.

**Endpoint:** `GET /`  
**Description:** Basic health check

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "service": "DevicePricePro API",
    "uptime": "2 hours, 15 minutes"
  },
  "message": "API is running smoothly"
}
```

### 2. Detailed Health Check

**Endpoint:** `GET /health`  
**Description:** Comprehensive health status including model status

**Response:**

```json
{
  "success": true,
  "data": {
    "api_status": "healthy",
    "model_status": "loaded",
    "model_version": "1.0.0",
    "database_status": "connected",
    "uptime_seconds": 8127,
    "memory_usage_mb": 245.7,
    "predictions_served": 1547
  },
  "message": "All systems operational"
}
```

### 3. Single Device Prediction

Predict the price of a single device.

**Endpoint:** `POST /predict`  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "brand": "Apple",
  "model_name": "iPhone 14 Pro",
  "screen_size": 6.1,
  "ram_gb": 6,
  "storage_gb": 256,
  "operating_system": "iOS",
  "connectivity": "5G",
  "storage_type": "NVMe",
  "color": "Deep Purple",
  "battery_mah": 3200,
  "camera_mp": 48,
  "weight_g": 206,
  "age_years": 1
}
```

**Required Fields:**

- `brand` (string): Device manufacturer
- `ram_gb` (number): RAM in gigabytes
- `storage_gb` (number): Storage in gigabytes

**Optional Fields:**

- `model_name` (string): Specific model name
- `screen_size` (number): Screen size in inches
- `operating_system` (string): Operating system
- `connectivity` (string): Network connectivity
- `storage_type` (string): Storage technology
- `color` (string): Device color
- `battery_mah` (number): Battery capacity
- `camera_mp` (number): Camera resolution
- `weight_g` (number): Weight in grams
- `age_years` (number): Years since release

**Response:**

```json
{
  "success": true,
  "data": {
    "predicted_price": 899.45,
    "price_range": {
      "min": 849.32,
      "max": 949.58
    },
    "confidence_score": 0.87,
    "prediction_metadata": {
      "model_version": "1.0.0",
      "processing_time_ms": 45,
      "features_used": 12,
      "similar_devices_count": 156
    }
  },
  "message": "Price prediction completed successfully"
}
```

### 4. Batch Predictions

Predict prices for multiple devices at once.

**Endpoint:** `POST /predict/batch`  
**Content-Type:** `multipart/form-data`

**Request:**

- **Method 1 - CSV File Upload:**

  ```
  file: devices.csv (form-data)
  ```

- **Method 2 - JSON Array:**
  ```json
  {
    "devices": [
      {
        "brand": "Apple",
        "model_name": "iPhone 14",
        "ram_gb": 6,
        "storage_gb": 128
        // ... other fields
      },
      {
        "brand": "Samsung",
        "model_name": "Galaxy S23",
        "ram_gb": 8,
        "storage_gb": 256
        // ... other fields
      }
    ]
  }
  ```

**CSV Format:**

```csv
brand,model_name,ram_gb,storage_gb,screen_size,operating_system,battery_mah,camera_mp,age_years
Apple,iPhone 14,6,128,6.1,iOS,3279,12,1
Samsung,Galaxy S23,8,256,6.1,Android,3900,50,0.5
Google,Pixel 7,8,128,6.3,Android,4355,50,1
```

**Response:**

```json
{
  "success": true,
  "data": {
    "total_predictions": 3,
    "processing_time_ms": 127,
    "predictions": [
      {
        "device_id": 1,
        "input": {
          "brand": "Apple",
          "model_name": "iPhone 14"
        },
        "predicted_price": 799.23,
        "confidence_score": 0.89
      },
      {
        "device_id": 2,
        "input": {
          "brand": "Samsung",
          "model_name": "Galaxy S23"
        },
        "predicted_price": 899.87,
        "confidence_score": 0.91
      }
    ],
    "summary": {
      "average_price": 849.55,
      "price_range": {
        "min": 799.23,
        "max": 899.87
      },
      "average_confidence": 0.9
    }
  },
  "message": "Batch prediction completed successfully"
}
```

### 5. SHAP Explanations

Get feature importance explanations for predictions.

**Endpoint:** `POST /predict/explain`  
**Content-Type:** `application/json`

**Request Body:**

```json
{
  "brand": "Samsung",
  "model_name": "Galaxy S23 Ultra",
  "screen_size": 6.8,
  "ram_gb": 12,
  "storage_gb": 512,
  "operating_system": "Android",
  "connectivity": "5G",
  "battery_mah": 5000,
  "camera_mp": 200,
  "weight_g": 234,
  "age_years": 0.5
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "predicted_price": 1199.67,
    "base_price": 650.0,
    "shap_values": [
      {
        "feature": "brand",
        "value": "Samsung",
        "impact": 180.45,
        "description": "Premium brand increases price"
      },
      {
        "feature": "ram_gb",
        "value": 12,
        "impact": 165.22,
        "description": "High RAM capacity adds significant value"
      },
      {
        "feature": "storage_gb",
        "value": 512,
        "impact": 145.8,
        "description": "Large storage capacity increases price"
      },
      {
        "feature": "camera_mp",
        "value": 200,
        "impact": 78.45,
        "description": "High-resolution camera adds premium"
      },
      {
        "feature": "screen_size",
        "value": 6.8,
        "impact": 45.3,
        "description": "Large screen size increases cost"
      },
      {
        "feature": "age_years",
        "value": 0.5,
        "impact": -65.55,
        "description": "Recent device, minimal depreciation"
      }
    ],
    "explanation_summary": {
      "top_positive_factors": ["brand", "ram_gb", "storage_gb"],
      "top_negative_factors": ["age_years"],
      "confidence_score": 0.93
    }
  },
  "message": "SHAP explanation generated successfully"
}
```

### 6. Model Information

Get information about the current ML model.

**Endpoint:** `GET /model/info`

**Response:**

```json
{
  "success": true,
  "data": {
    "model_version": "1.0.0",
    "model_type": "Ensemble (Random Forest + Gradient Boosting + Linear)",
    "training_date": "2025-09-01T10:30:00Z",
    "features_count": 12,
    "training_samples": 15847,
    "performance_metrics": {
      "mae": 89.32,
      "rmse": 156.21,
      "r2_score": 0.874,
      "mape": 8.9
    },
    "supported_features": [
      "brand",
      "model_name",
      "screen_size",
      "ram_gb",
      "storage_gb",
      "operating_system",
      "connectivity",
      "storage_type",
      "color",
      "battery_mah",
      "camera_mp",
      "weight_g",
      "age_years"
    ],
    "supported_brands": [
      "Apple",
      "Samsung",
      "Google",
      "OnePlus",
      "Xiaomi",
      "Huawei",
      "Sony",
      "LG",
      "Motorola"
    ]
  },
  "message": "Model information retrieved successfully"
}
```

## Error Codes

| Code               | HTTP Status | Description                     |
| ------------------ | ----------- | ------------------------------- |
| `VALIDATION_ERROR` | 400         | Invalid input parameters        |
| `MODEL_ERROR`      | 500         | ML model processing error       |
| `FILE_ERROR`       | 400         | File upload or processing error |
| `NOT_FOUND`        | 404         | Endpoint not found              |
| `RATE_LIMIT`       | 429         | Too many requests               |
| `SERVER_ERROR`     | 500         | Internal server error           |

## Rate Limits

- **Development**: No limits
- **Production**: 1000 requests per hour per IP
- **Batch Processing**: 50 requests per hour per IP

## Sample Requests

### cURL Examples

**Single Prediction:**

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Apple",
    "model_name": "iPhone 14",
    "ram_gb": 6,
    "storage_gb": 128,
    "screen_size": 6.1,
    "operating_system": "iOS",
    "battery_mah": 3279,
    "camera_mp": 12,
    "age_years": 1
  }'
```

**Batch Upload:**

```bash
curl -X POST http://localhost:5000/predict/batch \
  -F "file=@devices.csv"
```

**SHAP Explanation:**

```bash
curl -X POST http://localhost:5000/predict/explain \
  -H "Content-Type: application/json" \
  -d '{
    "brand": "Samsung",
    "ram_gb": 8,
    "storage_gb": 256
  }'
```

### JavaScript/Axios Examples

**Single Prediction:**

```javascript
const axios = require("axios");

const deviceData = {
  brand: "Google",
  model_name: "Pixel 7 Pro",
  ram_gb: 12,
  storage_gb: 256,
  screen_size: 6.7,
  operating_system: "Android",
  camera_mp: 50,
  age_years: 1,
};

try {
  const response = await axios.post(
    "http://localhost:5000/predict",
    deviceData
  );
  console.log("Predicted price:", response.data.data.predicted_price);
} catch (error) {
  console.error("Error:", error.response.data);
}
```

**Batch Prediction:**

```javascript
const FormData = require("form-data");
const fs = require("fs");

const form = new FormData();
form.append("file", fs.createReadStream("devices.csv"));

try {
  const response = await axios.post(
    "http://localhost:5000/predict/batch",
    form,
    {
      headers: form.getHeaders(),
    }
  );
  console.log("Batch predictions:", response.data.data.predictions);
} catch (error) {
  console.error("Error:", error.response.data);
}
```

### Python Examples

**Single Prediction:**

```python
import requests

url = 'http://localhost:5000/predict'
data = {
    'brand': 'OnePlus',
    'model_name': 'OnePlus 11',
    'ram_gb': 16,
    'storage_gb': 256,
    'screen_size': 6.7,
    'operating_system': 'Android',
    'camera_mp': 50,
    'battery_mah': 5000,
    'age_years': 0.5
}

response = requests.post(url, json=data)
if response.status_code == 200:
    result = response.json()
    print(f"Predicted price: ${result['data']['predicted_price']:.2f}")
else:
    print(f"Error: {response.json()}")
```

**Batch Upload:**

```python
import requests

url = 'http://localhost:5000/predict/batch'
files = {'file': open('devices.csv', 'rb')}

response = requests.post(url, files=files)
if response.status_code == 200:
    result = response.json()
    for prediction in result['data']['predictions']:
        device_id = prediction['device_id']
        price = prediction['predicted_price']
        print(f"Device {device_id}: ${price:.2f}")
else:
    print(f"Error: {response.json()}")
```

## Postman Collection

You can import this Postman collection to test all endpoints:

```json
{
  "info": {
    "name": "DevicePricePro API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/health",
          "host": ["{{base_url}}"],
          "path": ["health"]
        }
      }
    },
    {
      "name": "Single Prediction",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"brand\": \"Apple\",\n  \"model_name\": \"iPhone 14\",\n  \"ram_gb\": 6,\n  \"storage_gb\": 128,\n  \"screen_size\": 6.1,\n  \"operating_system\": \"iOS\",\n  \"battery_mah\": 3279,\n  \"camera_mp\": 12,\n  \"age_years\": 1\n}"
        },
        "url": {
          "raw": "{{base_url}}/predict",
          "host": ["{{base_url}}"],
          "path": ["predict"]
        }
      }
    },
    {
      "name": "Batch Prediction",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "file",
              "type": "file",
              "src": "devices.csv"
            }
          ]
        },
        "url": {
          "raw": "{{base_url}}/predict/batch",
          "host": ["{{base_url}}"],
          "path": ["predict", "batch"]
        }
      }
    },
    {
      "name": "SHAP Explanation",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"brand\": \"Samsung\",\n  \"model_name\": \"Galaxy S23 Ultra\",\n  \"ram_gb\": 12,\n  \"storage_gb\": 512,\n  \"screen_size\": 6.8,\n  \"operating_system\": \"Android\",\n  \"camera_mp\": 200,\n  \"battery_mah\": 5000,\n  \"age_years\": 0.5\n}"
        },
        "url": {
          "raw": "{{base_url}}/predict/explain",
          "host": ["{{base_url}}"],
          "path": ["predict", "explain"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000"
    }
  ]
}
```

## WebSocket Support (Future)

Real-time price monitoring will be available via WebSocket connections:

```javascript
// Future WebSocket implementation
const socket = io("ws://localhost:5000");

socket.on("price_update", (data) => {
  console.log("Price updated:", data);
});

socket.emit("monitor_device", {
  brand: "Apple",
  model_name: "iPhone 15",
});
```

## Changelog

### v1.0.0 (Current)

- Initial API release
- Single and batch predictions
- SHAP explanations
- Health monitoring

### Future Versions

- **v1.1.0**: Authentication & API keys
- **v1.2.0**: WebSocket support
- **v1.3.0**: GraphQL endpoint
- **v2.0.0**: Enhanced ML models

## Support

- **Documentation**: https://docs.devicepricepro.com
- **API Status**: https://status.devicepricepro.com
- **Issues**: https://github.com/devicepricepro/issues
- **Email**: api-support@devicepricepro.com

## Terms of Use

- API is provided "as-is" without warranty
- Rate limits apply to prevent abuse
- Commercial usage requires separate agreement
- Data privacy policy applies to all requests

---

**Last Updated**: September 16, 2025  
**API Version**: 1.0.0
