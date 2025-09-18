from flask import Blueprint, request, jsonify
import joblib
import pandas as pd
import numpy as np
import logging
import os
import json
from werkzeug.utils import secure_filename
import tempfile
from datetime import datetime
from config import MODEL_PATH, FEATURES

predict_bp = Blueprint('predict', __name__)

# Set up prediction logging
PREDICTION_LOG_FILE = 'logs/predict.log'

def setup_prediction_logging():
    """Setup logging for predictions"""
    # Ensure logs directory exists
    os.makedirs('logs', exist_ok=True)
    
    # Create a specific logger for predictions
    prediction_logger = logging.getLogger('predictions')
    prediction_logger.setLevel(logging.INFO)
    
    # Create file handler for predictions
    if not prediction_logger.handlers:
        handler = logging.FileHandler(PREDICTION_LOG_FILE, encoding='utf-8')
        formatter = logging.Formatter('%(asctime)s - %(message)s')
        handler.setFormatter(formatter)
        prediction_logger.addHandler(handler)
    
    return prediction_logger

# Initialize prediction logger
prediction_logger = setup_prediction_logging()

def log_prediction(user_id, prediction_data):
    """Log prediction to file"""
    try:
        log_entry = {
            'timestamp': datetime.utcnow().isoformat() + 'Z',
            'user_id': user_id,
            **prediction_data
        }
        prediction_logger.info(json.dumps(log_entry, ensure_ascii=False))
        logging.info(f"Logged prediction for user {user_id}")
    except Exception as e:
        logging.error(f"Error logging prediction: {str(e)}")

def load_model():
    """Load the ML model, handling potential errors"""
    try:
        if os.path.exists(MODEL_PATH):
            model = joblib.load(MODEL_PATH)
            logging.info(f"Model loaded successfully from {MODEL_PATH}")
            return model
        else:
            logging.error(f"Model file not found at {MODEL_PATH}")
            return None
    except Exception as e:
        logging.error(f"Error loading model: {str(e)}")
        return None

# Try to load model on startup
model = load_model()

def validate_device_data(data):
    """Validate device data input based on actual model features"""
    required_fields = FEATURES  # Use features from config
    
    for field in required_fields:
        if field not in data:
            return False, f"Missing required field: {field}"
    
    # Type validation for numeric fields
    numeric_fields = [
        'battery_power', 'clock_speed', 'fc', 'int_memory', 'm_dep',
        'mobile_wt', 'n_cores', 'pc', 'px_height', 'px_width', 'ram',
        'sc_h', 'sc_w', 'talk_time'
    ]
    
    boolean_fields = [
        'blue', 'dual_sim', 'four_g', 'three_g', 'touch_screen', 'wifi'
    ]
    
    # Validate numeric fields
    for field in numeric_fields:
        if field in data:
            try:
                data[field] = float(data[field])
            except (ValueError, TypeError):
                return False, f"Invalid numeric value for field {field}"
    
    # Validate boolean fields (convert to 0/1)
    for field in boolean_fields:
        if field in data:
            if isinstance(data[field], bool):
                data[field] = int(data[field])
            elif isinstance(data[field], (int, float)):
                data[field] = int(bool(data[field]))
            elif isinstance(data[field], str):
                data[field] = 1 if data[field].lower() in ['true', '1', 'yes'] else 0
            else:
                return False, f"Invalid boolean value for field {field}"
    
    return True, None

def prepare_features(data):
    """Prepare features for model prediction using exact feature order the model expects"""
    if hasattr(model, "feature_names_in_"):
        feature_order = model.feature_names_in_
    else:
        feature_order = FEATURES  # fallback
    
    feature_df = pd.DataFrame([{f: data.get(f, 0) for f in feature_order}])
    return feature_df

def read_user_predictions(user_id):
    """Read predictions from log file for a specific user"""
    predictions = []
    
    try:
        if not os.path.exists(PREDICTION_LOG_FILE):
            logging.info(f"Prediction log file not found: {PREDICTION_LOG_FILE}")
            return predictions
        
        with open(PREDICTION_LOG_FILE, 'r', encoding='utf-8') as file:
            for line_number, line in enumerate(file, 1):
                try:
                    # Parse log line - format: "timestamp - JSON"
                    if ' - ' in line:
                        parts = line.strip().split(' - ', 1)
                        if len(parts) >= 2:
                            json_part = parts[1]
                            log_data = json.loads(json_part)
                            
                            # Filter by user_id
                            if log_data.get('user_id') == user_id:
                                # Transform log data to match frontend expectations
                                prediction = {
                                    'id': log_data.get('id'),
                                    'type': log_data.get('type'),
                                    'predicted_price_range': log_data.get('predicted_price_range'),
                                    'predictedPriceRange': log_data.get('predicted_price_range'),  # Frontend expects this key
                                    'confidence': log_data.get('confidence', 95.0),
                                    'createdAt': log_data.get('timestamp'),
                                }
                                
                                # Add type-specific fields
                                if log_data.get('type') == 'single':
                                    prediction.update({
                                        'brand': log_data.get('brand'),
                                        'model': log_data.get('model'),
                                        'features': log_data.get('features', {})
                                    })
                                elif log_data.get('type') == 'batch':
                                    prediction.update({
                                        'fileName': log_data.get('fileName'),
                                        'totalDevices': log_data.get('totalDevices'),
                                        'summary': log_data.get('summary', {})
                                    })
                                
                                predictions.append(prediction)
                                
                except (json.JSONDecodeError, KeyError, IndexError) as e:
                    logging.warning(f"Error parsing log line {line_number}: {e}")
                    continue
                except Exception as e:
                    logging.error(f"Unexpected error parsing line {line_number}: {e}")
                    continue
        
        # Sort by timestamp, newest first
        predictions.sort(key=lambda x: x.get('createdAt', ''), reverse=True)
        logging.info(f"Successfully read {len(predictions)} predictions for user {user_id}")
        
    except Exception as e:
        logging.error(f"Error reading predictions from log: {str(e)}")
    
    return predictions


def feature_engineering(data):
    data['camera_total'] = data.get('fc',0) + data.get('pc',0)
    data['px_area'] = data.get('px_width',0) * data.get('px_height',0)
    data['log_px_width'] = np.log1p(data.get('px_width',0))
    data['log_px_height'] = np.log1p(data.get('px_height',0))
    data['log_px_area'] = np.log1p(data['px_area'])
    data['battery_per_wt'] = data.get('battery_power',0) / (data.get('mobile_wt',1)+1e-5)
    data['mem_ratio'] = data.get('ram',0) / (data.get('int_memory',1)+1e-5)
    data['log_battery_power'] = np.log1p(data.get('battery_power',0))
    data['log_ram'] = np.log1p(data.get('ram',0))
    data['log_int_memory'] = np.log1p(data.get('int_memory',0))
    data['ppi_proxy'] = (data['px_area']**0.5) / ((data.get('sc_h',1)**2 + data.get('sc_w',1)**2)**0.5 + 1e-5)
    data['connectivity_score'] = sum([
        int(data.get('blue',0)),
        int(data.get('wifi',0)),
        int(data.get('four_g',0)),
        int(data.get('three_g',0)),
        int(data.get('dual_sim',0)),
        int(data.get('touch_screen',0))
    ])
    
    # Ensure all FEATURES exist
    for f in FEATURES:
        if f not in data:
            data[f] = 0
    return data

@predict_bp.route('/', methods=['POST'])
def predict_single():
    """Single device price prediction"""
    try:
        if model is None:
            return jsonify({
                'error': 'ML model not available. Please ensure the model is trained and placed in the models directory.',
                'expected_path': MODEL_PATH
            }), 500
        
        # Use a default user_id since we're not using JWT authentication
        user_id = "anonymous_user"
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Validate input data
        is_valid, error_msg = validate_device_data(data)
        if not is_valid:
            return jsonify({'error': error_msg}), 400
        
        # Prepare features for prediction
        original_data = data.copy()  # Keep original for logging
        data = feature_engineering(data)
        features = prepare_features(data)
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Get prediction probability if available (for classification models)
        prediction_proba = None
        confidence = 95.0  # Default confidence
        if hasattr(model, 'predict_proba'):
            try:
                proba = model.predict_proba(features)[0]
                prediction_proba = proba.tolist()
                confidence = float(max(proba) * 100)  # Confidence as percentage
            except:
                pass
        
        # Log the prediction
        log_data = {
            'id': int(datetime.utcnow().timestamp() * 1000),  # Use timestamp as ID
            'type': 'single',
            'brand': original_data.get('brand', 'Unknown'),
            'model': original_data.get('model_name', original_data.get('model', 'Unknown')),
            'predicted_price_range': int(prediction),
            'confidence': confidence,
            'features': {
                'battery_power': data['battery_power'],
                'ram': data['ram'],
                'int_memory': data['int_memory'],
                'fc': data['fc'],
                'pc': data['pc'],
                'sc_h': data['sc_h'],
                'sc_w': data['sc_w'],
                'px_height': data['px_height'],
                'px_width': data['px_width'],
                'blue': bool(data['blue']),
                'dual_sim': bool(data['dual_sim']),
                'four_g': bool(data['four_g']),
                'three_g': bool(data['three_g']),
                'touch_screen': bool(data['touch_screen']),
                'wifi': bool(data['wifi'])
            }
        }
        
        log_prediction(user_id, log_data)
        
        # Format the response
        response = {
            'predicted_price_range': int(prediction),
            'confidence': prediction_proba,
            'device_features': {
                'battery_power': data['battery_power'],
                'ram': data['ram'],
                'internal_memory': data['int_memory'],
                'camera_front': data['fc'],
                'camera_primary': data['pc'],
                'screen_height': data['sc_h'],
                'screen_width': data['sc_w'],
                'pixel_height': data['px_height'],
                'pixel_width': data['px_width'],
                'has_bluetooth': bool(data['blue']),
                'has_dual_sim': bool(data['dual_sim']),
                'has_4g': bool(data['four_g']),
                'has_3g': bool(data['three_g']),
                'has_touch_screen': bool(data['touch_screen']),
                'has_wifi': bool(data['wifi'])
            }
        }
        
        logging.info(f"Prediction made for device: Price range {prediction}")
        return jsonify(response), 200
        
    except Exception as e:
        logging.error(f"Error in single prediction: {str(e)}")
        return jsonify({'error': 'Prediction failed', 'details': str(e)}), 500

@predict_bp.route('/batch', methods=['POST'])
def predict_batch():
    """Batch prediction from CSV upload"""
    try:
        if model is None:
            return jsonify({
                'error': 'ML model not available. Please ensure the model is trained and placed in the models directory.'
            }), 500
        
        # Use a default user_id since we're not using JWT authentication
        user_id = "anonymous_user"
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.lower().endswith('.csv'):
            return jsonify({'error': 'File must be a CSV'}), 400
        
        # Read CSV directly from memory - NO TEMP FILE
        try:
            import io
            # Read the file content as string
            file_content = file.stream.read().decode('utf-8')
            # Create StringIO object
            csv_string_io = io.StringIO(file_content)
            # Read CSV from StringIO
            df = pd.read_csv(csv_string_io)
            logging.info(f"CSV loaded with {len(df)} rows")
        except Exception as e:
            return jsonify({'error': f'Error reading CSV: {str(e)}'}), 400
        
        # Validate CSV structure
        missing_columns = [col for col in FEATURES if col not in df.columns]
        if missing_columns:
            return jsonify({
                'error': f'Missing required columns: {", ".join(missing_columns)}',
                'required_columns': FEATURES,
                'found_columns': list(df.columns)
            }), 400
        
        predictions = []
        errors = []
        successful_count = 0
        
        for index, row in df.iterrows():
            try:
                # Validate row data
                row_data = row.to_dict()
                is_valid, error_msg = validate_device_data(row_data)
                
                if not is_valid:
                    errors.append(f"Row {index + 1}: {error_msg}")
                    continue
                
                # Make prediction
                row_data = feature_engineering(row_data)
                features = prepare_features(row_data)

                prediction = model.predict(features)[0]
                successful_count += 1
                
                predictions.append({
                    'row': index + 1,
                    'predicted_price_range': int(prediction),
                    'battery_power': row_data['battery_power'],
                    'ram': row_data['ram'],
                    'int_memory': row_data['int_memory']  # Note: this should match your frontend expectation
                })
                
            except Exception as e:
                errors.append(f"Row {index + 1}: {str(e)}")
        
        # Log batch prediction
        avg_confidence = 85.0  # Default batch confidence
        if successful_count > 0:
            # Calculate average price range for summary
            avg_price_range = sum(p['predicted_price_range'] for p in predictions) / len(predictions)
            
            log_data = {
                'id': int(datetime.utcnow().timestamp() * 1000),
                'type': 'batch',
                'fileName': secure_filename(file.filename),
                'totalDevices': successful_count,
                'predicted_price_range': int(round(avg_price_range)),
                'confidence': avg_confidence,
                'summary': {
                    'total_processed': len(df),
                    'successful_predictions': successful_count,
                    'errors_count': len(errors)
                }
            }
            
            log_prediction(user_id, log_data)
        
        response = {
            'total_processed': len(df),
            'successful_predictions': len(predictions),
            'errors_count': len(errors),
            'predictions': predictions
        }
        
        if errors:
            response['errors'] = errors[:10]  # Limit to first 10 errors
            if len(errors) > 10:
                response['additional_errors'] = len(errors) - 10
        
        logging.info(f"Batch prediction completed: {len(predictions)} successful, {len(errors)} errors")
        return jsonify(response), 200
        
    except Exception as e:
        logging.error(f"Error in batch prediction: {str(e)}")
        return jsonify({'error': 'Batch prediction failed', 'details': str(e)}), 500

@predict_bp.route('/explain', methods=['POST'])
def explain_prediction():
    """Feature importance explanation for prediction"""
    try:
        if model is None:
            return jsonify({
                'error': 'ML model not available for explanations.'
            }), 500
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Validate input data
        is_valid, error_msg = validate_device_data(data)
        if not is_valid:
            return jsonify({'error': error_msg}), 400

        # Apply feature engineering first
        data = feature_engineering(data)

        # Prepare features for the model
        features = prepare_features(data)

        # Predict
        prediction = model.predict(features)[0]

        
        # Get feature importance if available
        feature_importance = {}
        if hasattr(model, 'feature_importances_'):
            # For tree-based models
            importances = model.feature_importances_
            feature_importance = dict(zip(FEATURES, importances.tolist()))
        elif hasattr(model, 'coef_'):
            # For linear models
            coefficients = model.coef_[0] if len(model.coef_.shape) > 1 else model.coef_
            feature_importance = dict(zip(FEATURES, coefficients.tolist()))
        else:
            # Create mock importance based on feature values
            for i, feature in enumerate(FEATURES):
                feature_importance[feature] = abs(data[feature]) / 1000.0  # Normalized importance
        
        # Create explanation
        explanation = {
            'predicted_price_range': int(prediction),
            'feature_importance': feature_importance,
            'top_features': sorted(
                feature_importance.items(), 
                key=lambda x: abs(x[1]), 
                reverse=True
            )[:5],
            'device_summary': {
                'battery_power': data['battery_power'],
                'ram': data['ram'],
                'internal_memory': data['int_memory'],
                'screen_size': f"{data['sc_h']}x{data['sc_w']}",
                'camera_quality': f"Primary: {data['pc']}MP, Front: {data['fc']}MP",
                'connectivity': {
                    'wifi': bool(data['wifi']),
                    '4g': bool(data['four_g']),
                    '3g': bool(data['three_g']),
                    'bluetooth': bool(data['blue'])
                }
            },
            'explanation': 'Feature importance shows how each specification affects the predicted price range. Higher values indicate more influence on the prediction.',
            'model_info': {
                'model_type': str(type(model).__name__),
                'features_count': len(FEATURES)
            }
        }
        
        return jsonify(explanation), 200
        
    except Exception as e:
        logging.error(f"Error in explanation: {str(e)}")
        return jsonify({'error': 'Explanation failed', 'details': str(e)}), 500

@predict_bp.route('/features', methods=['GET'])
def get_model_features():
    """Get the required features for the model"""
    return jsonify({
        'features': FEATURES,
        'feature_descriptions': {
            'battery_power': 'Total energy a battery can store in mAh',
            'blue': 'Has bluetooth (1/0)',
            'clock_speed': 'Speed at which microprocessor executes instructions',
            'dual_sim': 'Has dual sim support (1/0)',
            'fc': 'Front Camera mega pixels',
            'four_g': 'Has 4G support (1/0)',
            'int_memory': 'Internal Memory in GB',
            'm_dep': 'Mobile Depth in cm',
            'mobile_wt': 'Weight of mobile phone',
            'n_cores': 'Number of cores of processor',
            'pc': 'Primary Camera mega pixels',
            'px_height': 'Pixel Resolution Height',
            'px_width': 'Pixel Resolution Width',
            'ram': 'Random Access Memory in MB',
            'sc_h': 'Screen Height of mobile in cm',
            'sc_w': 'Screen Width of mobile in cm',
            'talk_time': 'Longest time that battery will last during calls',
            'three_g': 'Has 3G support (1/0)',
            'touch_screen': 'Has touch screen (1/0)',
            'wifi': 'Has wifi support (1/0)'
        },
        'model_path': MODEL_PATH,
        'model_exists': os.path.exists(MODEL_PATH),
        'prediction_log_path': PREDICTION_LOG_FILE,
        'log_exists': os.path.exists(PREDICTION_LOG_FILE)
    }), 200


@predict_bp.route('/history', methods=['GET'])
def get_prediction_history():
    """Get prediction history from log files"""
    try:
        user_id = "anonymous_user"
        logging.info(f"Fetching prediction history for user: {user_id}")
        
        predictions = read_user_predictions(user_id)
        
        response_data = {
            'predictions': predictions,
            'total_count': len(predictions),
            'log_file_path': PREDICTION_LOG_FILE,
            'log_file_exists': os.path.exists(PREDICTION_LOG_FILE)
        }
        
        logging.info(f"Retrieved {len(predictions)} predictions for user {user_id}")
        return jsonify(response_data), 200
        
    except Exception as e:
        logging.error(f"Error retrieving prediction history: {str(e)}")
        return jsonify({
            'error': 'Failed to retrieve history', 
            'details': str(e),
            'predictions': [],
            'total_count': 0
        }), 500

@predict_bp.route('/history/debug', methods=['GET'])
def debug_prediction_history():
    """Debug endpoint to check log file contents"""
    try:
        user_id = "anonymous_user"
        
        debug_info = {
            'user_id': user_id,
            'log_file_path': PREDICTION_LOG_FILE,
            'log_file_exists': os.path.exists(PREDICTION_LOG_FILE),
            'log_file_size': 0,
            'total_lines': 0,
            'sample_lines': [],
            'user_lines': []
        }
        
        if os.path.exists(PREDICTION_LOG_FILE):
            try:
                debug_info['log_file_size'] = os.path.getsize(PREDICTION_LOG_FILE)
                
                with open(PREDICTION_LOG_FILE, 'r', encoding='utf-8') as file:
                    lines = file.readlines()
                    debug_info['total_lines'] = len(lines)
                    
                    # Sample first 3 lines for debugging
                    debug_info['sample_lines'] = [line.strip() for line in lines[:3]]
                    
                    # Find lines for this user
                    for line in lines:
                        if f'"user_id": "{user_id}"' in line or f'"user_id":"{user_id}"' in line:
                            debug_info['user_lines'].append(line.strip())
                    
            except Exception as e:
                debug_info['read_error'] = str(e)
        
        return jsonify(debug_info), 200
        
    except Exception as e:
        logging.error(f"Error in debug endpoint: {str(e)}")
        return jsonify({'error': 'Debug failed', 'details': str(e)}), 500