from flask import jsonify
from models.user import User
from db import db
from utils.security import create_jwt

def register_user(data: dict):
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"success": False, "error": "name, email, and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"success": False, "error": "email already exists"}), 400

    user = User(username=name, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"success": True, "message": "user registered successfully"}), 201


def login_user(data: dict):
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"success": False, "error": "email and password required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not user.verify_password(password):
        return jsonify({"success": False, "error": "invalid credentials"}), 401

    token = create_jwt({"user_id": user.id})
    return jsonify({"success": True, "token": token}), 200

