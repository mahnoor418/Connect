# --- FILE: app/models/user.py ---
from typing import List, Optional
from pydantic import BaseModel, EmailStr

class UserModel(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str
    profilePicture: Optional[str] = ""
    bio: Optional[str] = ""
    followers: List[str] = []
    following: List[str] = []
    posts: List[str] = []
    otp: Optional[str] = None
    otpExpiry: Optional[str] = None