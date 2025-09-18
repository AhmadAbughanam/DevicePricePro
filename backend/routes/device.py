from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import json
import os
import logging

device_bp = Blueprint('device', __name__)

# Reference the same log file used by predictions
PREDICTION_LOG_FILE = 'logs/predict.log'

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

@device_bp.route('/history', methods=['GET'])
def get_prediction_history():
    """Get prediction history for all users from log files"""
    try:
        # Use anonymous user since we're not using JWT authentication
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

@device_bp.route('/history/debug', methods=['GET'])
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
                    debug_info['sample_lines'] = lines[:3]
                    
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