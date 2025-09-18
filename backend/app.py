from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from routes.predict import predict_bp
from routes.health import health_bp
from routes.auth import auth_bp
from db import db  # import the SQLAlchemy instance
from models.user import User
from routes.device import device_bp
import config
import logging
import os

# Ensure logs folder exists
os.makedirs("logs", exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("logs/app.log"),
        logging.StreamHandler()
    ]
)

def create_app():
    app = Flask(__name__)
    
    # --- CORS Configuration ---
    CORS(app, 
         origins=["http://localhost:3000"],  # React dev server
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         allow_headers=["Content-Type", "Authorization"],
         supports_credentials=True
    )

    # --- Configuration from config.py ---
    app.config['DEBUG'] = config.DEBUG
    
    # --- 1. Configure database path ---
    db_path = os.path.join(config.BASE_DIR, 'db', 'database.db')
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Secret key for sessions and JWT
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'dev-jwt-secret-key-change-in-production')
    
    # Initialize JWT
    jwt = JWTManager(app)

    # --- 2. Initialize SQLAlchemy ---
    db.init_app(app)

    # --- 4. Create tables if they don't exist ---
    with app.app_context():
        # Ensure db directory exists
        os.makedirs(os.path.dirname(db_path), exist_ok=True)
        db.create_all()

    # Register blueprints
    app.register_blueprint(health_bp, url_prefix="/health")
    app.register_blueprint(predict_bp, url_prefix="/predict")
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(device_bp, url_prefix="/device")

    # Health check endpoint
    @app.route("/")
    def health_check():
        return jsonify({
            "status": "healthy",
            "message": "DevicePricePro API is running",
            "version": "1.0.0"
        })

    # Global error handler
    @app.errorhandler(Exception)
    def handle_exception(e):
        logging.error("Unhandled Exception: %s", str(e))
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

    return app

if __name__ == "__main__":
    app = create_app()
    # Run on all interfaces to work with Docker
    app.run(host='0.0.0.0', port=5000, debug=True)