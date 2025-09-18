# DevicePricePro 📱💰

> **AI-powered device price prediction platform with explainable ML insights**

DevicePricePro is a full-stack web application that predicts device prices using machine learning. Built with Flask (backend) and React (frontend), it provides both single device predictions and batch processing capabilities with SHAP explainability features.

![DevicePricePro Demo](docs/images/demo.gif)

## 🚀 Features

- **Intelligent Price Prediction**: ML-powered predictions for smartphones, tablets, and other devices
- **Batch Processing**: Upload CSV files for bulk price predictions
- **Explainable AI**: SHAP-based feature importance visualization
- **Real-time API**: RESTful API with comprehensive endpoints
- **Modern UI**: React-based responsive frontend with intuitive design
- **Production Ready**: Docker containerization for easy deployment
- **Comprehensive Testing**: Automated tests for backend and frontend

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/REST     ┌──────────────────┐
│   React Frontend│ ◄──────────────► │  Flask Backend   │
│                 │                  │                  │
│ • Device Forms  │                  │ • ML Predictions │
│ • Batch Upload  │                  │ • SHAP Analysis  │
│ • Visualizations│                  │ • Data Processing│
└─────────────────┘                  └──────────────────┘
                                               │
                                               ▼
                                    ┌──────────────────┐
                                    │  ML Model        │
                                    │                  │
                                    │ • Scikit-learn   │
                                    │ • Preprocessing  │
                                    │ • Feature Eng.   │
                                    └──────────────────┘
```

## 🛠️ Tech Stack

**Backend:**

- Flask 2.x - Web framework
- Scikit-learn - Machine learning
- Pandas - Data manipulation
- SHAP - Model explainability
- Joblib - Model serialization

**Frontend:**

- React 18 - UI framework
- TypeScript - Type safety
- Recharts - Data visualization
- Axios - HTTP client
- Tailwind CSS - Styling

**Infrastructure:**

- Docker & Docker Compose
- Python 3.9+
- Node.js 18+

## 📦 Quick Start

### Using Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/DevicePricePro.git
   cd DevicePricePro
   ```

2. **Start the application**

   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Manual Installation

#### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

#### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## 📊 Training the ML Model

The ML model is trained using Google Colab for easy access to GPUs and collaborative development.

1. **Open the training notebook**: [Train_DevicePrice_Model.ipynb](notebooks/Train_DevicePrice_Model.ipynb)
2. **Run all cells** to train the model
3. **Download** the generated `model.joblib` file
4. **Place** it in `backend/models/model.joblib`

See [Model Training Guide](docs/model_training.md) for detailed instructions.

## 🔌 API Documentation

### Base URL: `http://localhost:5000`

#### Endpoints

**Single Prediction**

```http
POST /predict
Content-Type: application/json

{
  "brand": "Apple",
  "model_name": "iPhone 14",
  "screen_size": 6.1,
  "ram_gb": 6,
  "storage_gb": 128,
  "operating_system": "iOS",
  "camera_mp": 12,
  "battery_mah": 3279,
  "age_years": 1
}
```

**Batch Predictions**

```http
POST /predict/batch
Content-Type: multipart/form-data
file: devices.csv
```

**SHAP Explanations**

```http
POST /predict/explain
Content-Type: application/json

{
  "brand": "Samsung",
  "model_name": "Galaxy S23",
  ...
}
```

See [API Documentation](docs/api.md) for complete endpoint details.

## 🧪 Testing

```bash
# Backend tests
cd backend
python -m pytest tests/

# Frontend tests
cd frontend
npm test
```

## 📁 Project Structure

```
DevicePricePro/
├── backend/                 # Flask backend
│   ├── app.py              # Main application
│   ├── config.py           # Configuration
│   ├── models/             # ML models
│   ├── ml/                 # ML utilities
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Helper functions
│   └── tests/              # Backend tests
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── utils/          # Frontend utilities
│   │   └── types/          # TypeScript types
│   └── public/             # Static assets
├── docs/                   # Documentation
├── notebooks/              # Colab training notebooks
├── docker-compose.yml      # Development setup
├── docker-compose.prod.yml # Production setup
└── README.md              # This file
```

## 🚀 Deployment

### Production Deployment

```bash
# Build and run production containers
docker-compose -f docker-compose.prod.yml up --build -d
```

### Environment Variables

Create `.env` files for configuration:

**.env.backend**

```env
FLASK_ENV=production
ML_MODEL_PATH=/app/models/model.joblib
DATABASE_URL=your_database_url
```

**.env.frontend**

```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_ENVIRONMENT=production
```

## 📊 Model Performance

| Metric              | Value        |
| ------------------- | ------------ |
| Mean Absolute Error | $89.32       |
| R² Score            | 0.874        |
| RMSE                | $156.21      |
| Training Time       | ~3.2 minutes |

See [Model Card](docs/model_card.md) for detailed performance metrics.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

See [Contributing Guidelines](docs/contributing.md) for detailed information.

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Model Training Guide](docs/model_training.md)
- [Model Card](docs/model_card.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guidelines](docs/contributing.md)

## 🐛 Troubleshooting

### Common Issues

**Docker build fails**

```bash
# Clean Docker cache
docker system prune -f
docker-compose down --volumes
docker-compose up --build --force-recreate
```

**Model not found error**

- Ensure `model.joblib` is in `backend/models/`
- Check file permissions
- Verify model was trained with compatible scikit-learn version

**Frontend can't connect to backend**

- Check if backend is running on port 5000
- Verify CORS settings in Flask app
- Update `REACT_APP_API_URL` in frontend

See [Troubleshooting Guide](docs/troubleshooting.md) for more solutions.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Scikit-learn](https://scikit-learn.org/) for machine learning capabilities
- [SHAP](https://shap.readthedocs.io/) for model explainability
- [React](https://reactjs.org/) for the frontend framework
- [Flask](https://flask.palletsprojects.com/) for the backend API

---

**Built with ❤️ for accurate device price predictions**

For questions or support, please [open an issue](https://github.com/your-username/DevicePricePro/issues).
