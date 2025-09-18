import jwt
from datetime import datetime, timedelta
from typing import Tuple, Optional

SECRET_KEY = "your_super_secret_key_here"

def create_jwt(payload: dict, expires_minutes: int = 60) -> str:
    """
    Create a JWT token with expiration.
    Returns a string token.
    """
    payload_copy = payload.copy()
    payload_copy["exp"] = datetime.utcnow() + timedelta(minutes=expires_minutes)
    token = jwt.encode(payload_copy, SECRET_KEY, algorithm="HS256")
    
    # PyJWT >= 2 returns a string, so just return it
    return token

def decode_jwt(token: str) -> Tuple[Optional[dict], Optional[str]]:
    """
    Decode a JWT token.
    Returns a tuple: (payload dict or None, error message or None)
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload, None
    except jwt.ExpiredSignatureError:
        return None, "Token expired"
    except jwt.InvalidTokenError:
        return None, "Invalid token"
