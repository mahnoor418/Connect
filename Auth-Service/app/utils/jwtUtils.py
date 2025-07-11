# --- FILE: app/utils/jwt_utils.py ---
from jose import jwt
from datetime import datetime, timedelta
from app.config import JWT_SECRET

ALGORITHM = "HS256"

def create_token(data: dict, expires_delta: timedelta = timedelta(days=7)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=ALGORITHM)