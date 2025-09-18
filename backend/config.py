import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Enable/disable debug mode
DEBUG = True  # Set False in production

# Path to the trained Pickle model
MODEL_PATH = os.path.join(BASE_DIR, "models-ai", "lgb_pipeline.pkl")

# Raw features expected from frontend
FEATURES = [
    "battery_power","blue","clock_speed","dual_sim","fc","four_g","int_memory",
    "m_dep","mobile_wt","n_cores","pc","px_height","px_width","ram",
    "sc_h","sc_w","talk_time","three_g","touch_screen","wifi"
]
