from flask import Blueprint, jsonify
import os
import joblib
import logging
from db import db
from datetime import datetime
import psutil
from config import MODEL_PATH, DEBUG

health_bp = Blueprint('health', __name__)

@health_bp.route('/', methods=['GET'])
def health_check():
    """Basic health check endpoint"""
    try:
        return jsonify({
            'status': 'healthy',
            'message': 'DevicePricePro API is running',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0'
        }), 200
    except Exception as e:
        logging.error(f"Health check error: {str(e)}")
        return jsonify({
            'status': 'unhealthy',
            'message': 'Health check failed',
            'error': str(e)
        }), 500

@health_bp.route('/detailed', methods=['GET'])
def detailed_health():
    """Detailed health check with system information"""
    try:
        health_status = {
            'status': 'healthy',
            'timestamp': datetime.utcnow().isoformat(),
            'version': '1.0.0',
            'components': {}
        }
        
        # Check database connection
        try:
            db.engine.execute('SELECT 1')
            health_status['components']['database'] = {
                'status': 'healthy',
                'message': 'Database connection successful'
            }
        except Exception as e:
            health_status['components']['database'] = {
                'status': 'unhealthy',
                'message': f'Database connection failed: {str(e)}'
            }
            health_status['status'] = 'degraded'
        
        # Check ML model availability
        try:
            if os.path.exists(MODEL_PATH):
                # Try to load the model
                joblib.load(MODEL_PATH)
                health_status['components']['ml_model'] = {
                    'status': 'healthy',
                    'message': 'ML model loaded successfully',
                    'path': MODEL_PATH,
                    'model_type': 'LightGBM Pipeline'
                }
            else:
                health_status['components']['ml_model'] = {
                    'status': 'unhealthy',
                    'message': 'ML model file not found',
                    'path': MODEL_PATH,
                    'expected_location': 'models-ai/lgb_pipeline.pkl'
                }
                health_status['status'] = 'degraded'
        except Exception as e:
            health_status['components']['ml_model'] = {
                'status': 'unhealthy',
                'message': f'ML model loading failed: {str(e)}',
                'path': MODEL_PATH
            }
            health_status['status'] = 'degraded'
        
        # System resources
        try:
            health_status['system'] = {
                'cpu_percent': psutil.cpu_percent(interval=1),
                'memory_percent': psutil.virtual_memory().percent,
                'disk_percent': psutil.disk_usage('/').percent,
                'python_version': os.sys.version
            }
        except Exception as e:
            logging.warning(f"Could not get system info: {str(e)}")
            health_status['system'] = {
                'message': 'System info unavailable',
                'error': str(e)
            }
        
        # Environment info
        health_status['environment'] = {
            'flask_env': os.environ.get('FLASK_ENV', 'development'),
            'debug_mode': DEBUG,
            'database_uri': 'configured' if os.environ.get('DATABASE_URL') else 'default',
            'model_path': MODEL_PATH
        }
        
        return jsonify(health_status), 200
        
    except Exception as e:
        logging.error(f"Detailed health check error: {str(e)}")
        return jsonify({
            'status': 'unhealthy',
            'message': 'Detailed health check failed',
            'error': str(e)
        }), 500

@health_bp.route('/ready', methods=['GET'])
def readiness_check():
    """Readiness probe for deployment"""
    try:
        # Check if the application is ready to serve requests
        checks = []
        
        # Database check
        try:
            db.engine.execute('SELECT 1')
            checks.append({'name': 'database', 'status': 'ready'})
        except Exception as e:
            checks.append({'name': 'database', 'status': 'not_ready', 'error': str(e)})
        
        # Model check
        if os.path.exists(MODEL_PATH):
            checks.append({'name': 'ml_model', 'status': 'ready'})
        else:
            checks.append({'name': 'ml_model', 'status': 'not_ready', 'error': 'Model file not found'})
        
        # Determine overall readiness
        all_ready = all(check['status'] == 'ready' for check in checks)
        
        response = {
            'ready': all_ready,
            'checks': checks,
            'timestamp': datetime.utcnow().isoformat()
        }
        
        status_code = 200 if all_ready else 503
        return jsonify(response), status_code
        
    except Exception as e:
        logging.error(f"Readiness check error: {str(e)}")
        return jsonify({
            'ready': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 503

@health_bp.route('/live', methods=['GET'])
def liveness_check():
    """Liveness probe for deployment"""
    try:
        # Simple check to see if the application is alive
        return jsonify({
            'alive': True,
            'timestamp': datetime.utcnow().isoformat(),
            'uptime': 'running'
        }), 200
        
    except Exception as e:
        logging.error(f"Liveness check error: {str(e)}")
        return jsonify({
            'alive': False,
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500