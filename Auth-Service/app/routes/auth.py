# --- FILE: app/routes/auth.py ---
from fastapi import APIRouter
from app.schemas.user import RegisterSchema, LoginSchema, OTPRequest, OTPVerify, ResetPassword, DeleteAccount
from app.controllers import authController

router = APIRouter()

@router.post("/register")
async def register(data: RegisterSchema):
    return await authController.register(data)

@router.post("/login")
async def login(data: LoginSchema):
    return await authController.login(data)

@router.post("/sendotp")
async def send_otp(data: OTPRequest):
    return await authController.send_otp(data)

@router.post("/verifyotp")
async def verify_otp(data: OTPVerify):
    return await authController.verify_otp(data)

@router.post("/resetpassword")
async def reset_password(data: ResetPassword):
    return await authController.reset_password(data)

@router.delete("/deleteaccount")
async def delete_account(data: DeleteAccount):
    return await authController.delete_account(data)
