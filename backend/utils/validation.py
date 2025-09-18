# utils/validation.py
from typing import Dict, List

MODEL_FEATURES = [
    "battery_power", "blue", "clock_speed", "dual_sim", "fc", "four_g",
    "int_memory", "m_dep", "mobile_wt", "n_cores", "pc", "px_height",
    "px_width", "ram", "sc_h", "sc_w", "talk_time", "three_g",
    "touch_screen", "wifi", "px_area", "ppi_proxy", "mem_ratio",
    "battery_per_wt", "camera_total", "log_ram", "log_px_area",
    "log_px_width", "log_px_height", "log_battery_power",
    "log_int_memory", "connectivity_score"
]



def validate_device_input(device: Dict):
    """
    Ensure all required features are present in a single device dict.
    Raises ValueError if any feature is missing.
    """
    missing_keys = [key for key in MODEL_FEATURES if key not in device]
    if missing_keys:
        raise ValueError(f"Missing required field(s): {', '.join(missing_keys)}")
