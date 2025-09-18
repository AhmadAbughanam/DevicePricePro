from flask import Blueprint, request, jsonify
import pandas as pd
import pickle
import config

predict_bp = Blueprint("predict_bp", __name__)

# Load the model once at module level
with open(config.MODEL_PATH, "rb") as f:
    model = pickle.load(f)

# List of required features (raw input)
FEATURES = [
    "battery_power","blue","clock_speed","dual_sim","fc","four_g","int_memory",
    "m_dep","mobile_wt","n_cores","pc","px_height","px_width","ram",
    "sc_h","sc_w","talk_time","three_g","touch_screen","wifi"
]

@predict_bp.route("/", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data provided"}), 400

        # Ensure input is a single row dict or list of dicts
        if isinstance(data, dict):
            data = [data]

        df = pd.DataFrame(data)

        # Check for missing features
        missing = [f for f in FEATURES if f not in df.columns]
        if missing:
            return jsonify({"error": f"Missing required features: {missing}"}), 400

        # Predict
        preds = model.predict(df[FEATURES])
        return jsonify({"predictions": preds.tolist()})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
