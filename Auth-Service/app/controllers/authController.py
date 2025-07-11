# --- FILE: app/controllers/auth_controller.py ---
from fastapi import HTTPException
from datetime import datetime, timedelta
from bson import ObjectId
import bcrypt
import random
from app.database import db
from app.utils.emailUtils import send_otp_email, send_registration_email, send_account_deletion_email
from app.utils.jwtUtils import create_token
from app.utils.activityUtils import log_activity

users = db["users"]
activity_logs = db["activity_logs"]

async def register(data):
    existing = await users.find_one({"$or": [{"email": data.email}, {"username": data.username}]})
    if existing:
        raise HTTPException(status_code=400, detail="Email or username already exists")

    hashed = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    user = data.dict()
    user["password"] = hashed
    await users.insert_one(user)
    await send_registration_email(user["email"], user["name"])
    user_id = str(user["_id"])
    await log_activity(user_id, "REGISTER", f"User {user['email']} registered.")
    return {"message": "User registered successfully"}

async def login(data):
    user = await users.find_one({"email": data.email})
    if not user or not bcrypt.checkpw(data.password.encode(), user["password"].encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token({"id": str(user["_id"])})
    await log_activity(str(user["_id"]), "LOGIN", f"User {user['email']} logged in.")
    return {"message": "Login successful", "token": token, "user": {"id": str(user["_id"]), "email": user["email"], "username": user["username"], "name": user["name"]}}

async def send_otp(data):
    user = await users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    otp = str(random.randint(100000, 999999))
    expiry = datetime.utcnow() + timedelta(minutes=10)
    await users.update_one({"_id": user["_id"]}, {"$set": {"otp": otp, "otpExpiry": expiry}})
    await log_activity(str(user["_id"]), "OTP_VERIFIED", "OTP successfully verified.")
    await send_otp_email(data.email, otp)
    return {"message": "OTP sent"}

async def verify_otp(data):
    user = await users.find_one({"email": data.email})
    if not user or user.get("otp") != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    if datetime.utcnow() > user.get("otpExpiry"):
        raise HTTPException(status_code=400, detail="OTP expired")
    await users.update_one({"_id": user["_id"]}, {"$set": {"otp": None, "otpExpiry": None}})
    await log_activity(str(user["_id"]), "OTP_VERIFIED", "OTP successfully verified.")
    return {"message": "OTP verified"}

async def reset_password(data):
    user = await users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    hashed = bcrypt.hashpw(data.newPassword.encode(), bcrypt.gensalt()).decode()
    await users.update_one({"_id": user["_id"]}, {"$set": {"password": hashed, "otp": None, "otpExpiry": None}})
    await log_activity(str(user["_id"]), "PASSWORD_RESET", "Password reset using OTP.")
    return {"message": "Password reset"}

async def delete_account(data):
    user = await users.find_one({"_id": ObjectId(data.userId)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await users.delete_one({"_id": ObjectId(data.userId)})
    await send_account_deletion_email(user["email"], user["name"])
    await log_activity(str(user["_id"]), "ACCOUNT_DELETION", "User account deleted.")
    return {"message": "Account deleted"}
