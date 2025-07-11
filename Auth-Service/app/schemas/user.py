# --- FILE: app/schemas/user.py ---
from pydantic import BaseModel, EmailStr

class RegisterSchema(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: str

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class OTPRequest(BaseModel):
    email: EmailStr

class OTPVerify(BaseModel):
    email: EmailStr
    otp: str

class ResetPassword(BaseModel):
    email: EmailStr
    newPassword: str

class DeleteAccount(BaseModel):
    userId: str
