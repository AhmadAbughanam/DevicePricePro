from db import db
import json
from datetime import datetime

class Device(db.Model):
    __tablename__ = "devices"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    input_data = db.Column(db.Text, nullable=False)  # store JSON as string
    predicted_price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def set_input_data(self, data: dict):
        self.input_data = json.dumps(data)

    def get_input_data(self):
        return json.loads(self.input_data)
