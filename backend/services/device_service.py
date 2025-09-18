from models.device import Device
from db import db
import json

def save_prediction(user_id: int, input_data: dict, predicted_price: float):
    device = Device(user_id=user_id, predicted_price=predicted_price)
    device.set_input_data(input_data)  # convert dict → JSON string
    db.session.add(device)
    db.session.commit()
    return device

def get_user_predictions(user_id: int):
    devices = Device.query.filter_by(user_id=user_id).all()
    result = []
    for device in devices:
        result.append({
            "id": device.id,
            "input_data": device.get_input_data(),
            "predicted_price": device.predicted_price,
            "created_at": device.created_at.isoformat()
        })
    return result
