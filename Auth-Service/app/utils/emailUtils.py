# --- FILE: app/utils/email_utils.py ---
import smtplib
from email.mime.text import MIMEText
from app.config import EMAIL_USER, EMAIL_PASS

async def send_email(recipient, subject, body):
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL_USER
    msg["To"] = recipient

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_USER, EMAIL_PASS)
            server.send_message(msg)
    except Exception as e:
        print("Email error:", e)

async def send_otp_email(email, otp):
    await send_email(email, "Your OTP Code", f"Your OTP is {otp}")

async def send_registration_email(email, name):
    await send_email(email, "Welcome", f"Hello {name}, your account was created.")

async def send_account_deletion_email(email, name):
    await send_email(email, "Account Deleted", f"Goodbye {name}, your account has been deleted.")
