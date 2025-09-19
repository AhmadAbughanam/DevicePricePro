# DevicePricePro 📱💰

> **AI-powered device price prediction platform with explainable ML insights**

DevicePricePro is a full-stack web application that predicts device prices using machine learning. Built with Flask (backend) and React (frontend), it provides both single device predictions and batch processing capabilities with comprehensive analytics and user management.

## 🚀 Features

- **Intelligent Price Prediction**: ML-powered predictions for smartphones, tablets, and other devices
- **Batch Processing**: Upload CSV files for bulk price predictions
- **User Authentication**: Secure JWT-based authentication system
- **Prediction History**: Track and analyze your prediction history
- **Analytics Dashboard**: Comprehensive insights with charts and export capabilities
- **Real-time API**: RESTful API with comprehensive endpoints
- **Modern UI**: React-based responsive frontend with intuitive design
- **Production Ready**: Docker containerization for easy deployment

## 🏗️ Architecture

```
┌─────────────────┐    HTTP/REST     ┌──────────────────┐
│   React Frontend│ ◄──────────────► │  Flask Backend   │
│                 │                  │                  │
│ • Device Forms  │                  │ • ML Predictions │
│ • Batch Upload  │                  │ • User Auth      │
│ • Analytics     │                  │ • Data Processing│
│ • History       │                  │ • SQLite DB      │
└─────────────────┘                  └──────────────────┘
                                               │
                                               ▼
                                    ┌──────────────────┐
                                    │  ML Model        │
                                    │                  │
                                    │ • LightGBM       │
                                    │ • Pipeline       │
                                    │ • Feature Eng.   │
                                    └──────────────────┘
```

## 🛠️ Tech Stack

**Backend:**
- Flask 2.x - Web framework
- LightGBM - Machine learning model
- SQLite - Database
- SQLAlchemy - ORM
- JWT - Authentication
- Pandas - Data manipulation
- Scikit-learn - Preprocessing pipeline

**Frontend:**
- React 18 - UI framework
- JavaScript/JSX - Language
- Recharts - Data visualization
- React Router - Navigation
- CSS - Styling

**Infrastructure:**
- Docker & Docker Compose
- Python 3.9+
- Node.js 18+
- Nginx - Production web server

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

## 🤖 ML Model

The application uses a LightGBM model trained on device specifications to predict prices. The model is stored as `lgb_pipeline.pkl` in the `backend/models-ai/` directory.

**Model Features:**
- Brand, model, screen size, RAM, storage
- Operating system, camera, battery capacity
- Device age and other specifications

**Model Location:** `backend/models-ai/lgb_pipeline.pkl`

## 🔌 API Documentation

### Base URL: `http://localhost:5000`

#### Authentication Endpoints
```http
POST /auth/register
POST /auth/login
POST /auth/logout
```

#### Prediction Endpoints
```http
POST /predict/single
POST /predict/batch
GET /predict/history
```

#### User Management
```http
GET /user/profile
PUT /user/profile
```

## 📁 Project Structure

```
DevicePricePro/
├── backend/                    # Flask backend
│   ├── app.py                 # Main application
│   ├── config.py              # Configuration
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Backend container
│   ├── models/               # Database models
│   │   ├── user.py          # User model
│   │   └── device.py        # Device model
│   ├── models-ai/           # ML models
│   │   └── lgb_pipeline.pkl # Trained LightGBM model
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   │   ├── auth_service.py  # Authentication logic
│   │   └── device_service.py # Device prediction logic
│   ├── utils/               # Helper functions
│   ├── database/            # Database files
│   └── db/                  # Database utilities
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Home.jsx            # Landing page
│   │   │   ├── Login.jsx           # Login form
│   │   │   ├── Register.jsx        # Registration form
│   │   │   ├── Dashboard.js        # Main dashboard
│   │   │   ├── SinglePrediction.jsx # Single device prediction
│   │   │   ├── BatchPrediction.jsx  # Batch processing
│   │   │   ├── PredictionHistory.jsx # History view
│   │   │   ├── Analytics.jsx       # Analytics dashboard
│   │   │   └── Profile.jsx         # User profile
│   │   └── utils/           # Frontend utilities
│   ├── public/              # Static assets
│   ├── Dockerfile          # Frontend container
│   ├── nginx.conf          # Nginx configuration
│   └── package.json        # Dependencies
├── colab/                  # Colab training notebooks
├── docs/                   # Documentation
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

Create `.env` file in root directory:
```env
# Backend Configuration
FLASK_ENV=production
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///database/app.db
JWT_SECRET_KEY=your-jwt-secret

# Frontend Configuration
REACT_APP_API_URL=http://localhost:5000
```

## 🎯 Key Features

### User Authentication
- JWT-based secure authentication
- User registration and login
- Protected routes and API endpoints

### Device Price Prediction
- **Single Predictions**: Predict individual device prices
- **Batch Processing**: Upload CSV files for bulk predictions
- **History Tracking**: View all your previous predictions

### Analytics Dashboard
- Comprehensive prediction analytics
- Visual charts and statistics
- Export capabilities (CSV, PDF, JSON)
- Performance metrics and trends

### User Management
- User profiles with editable information
- Prediction history per user
- Secure data isolation

## 🧪 Application Pages

- **Home** - Landing page with features and pricing
- **Login/Register** - User authentication
- **Dashboard** - Main application hub
- **Single Prediction** - Individual device price prediction
- **Batch Prediction** - CSV upload for bulk processing
- **History** - View prediction history with filters
- **Analytics** - Comprehensive data insights
- **Profile** - User account management

## 🐛 Troubleshooting

### Common Issues

**Model not found error**
- Ensure `lgb_pipeline.pkl` is in `backend/models-ai/`
- Check file permissions and path

**Database connection issues**
- Check if `database/` directory exists
- Verify SQLite permissions

**Frontend can't connect to backend**
- Ensure backend runs on port 5000
- Check CORS settings in Flask app
- Verify `REACT_APP_API_URL` configuration

**Docker build fails**
```bash
docker system prune -f
docker-compose down --volumes
docker-compose up --build --force-recreate
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [LightGBM](https://lightgbm.readthedocs.io/) for machine learning capabilities
- [React](https://reactjs.org/) for the frontend framework
- [Flask](https://flask.palletsprojects.com/) for the backend API
- [Recharts](https://recharts.org/) for data visualization

---

**Built with ❤️ for accurate device price predictions**

For questions or support, please [open an issue](https://github.com/your-username/DevicePricePro/issues).
