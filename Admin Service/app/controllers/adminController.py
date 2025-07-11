from fastapi import APIRouter, Response, HTTPException
from app.database import db
from app.utils.pdfGenerator import generate_activity_pdf
import jwt
from app.config import JWT_SECRET
from fastapi.responses import StreamingResponse
from bson import ObjectId
from io import BytesIO
from bson import ObjectId

router = APIRouter()

@router.post("/login")
async def admin_login(data: dict):
    email = data.get("email")
    password = data.get("password")

    if email == "admin@gmail.com" and password == "admin":
        token = jwt.encode({"id": "admin", "role": "admin"}, JWT_SECRET, algorithm="HS256")
        return {"message": "Admin login successful", "token": token}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.get("/users")
async def get_all_users():
    users = db["users"].find({}, {"password": 0, "otp": 0, "otpExpiry": 0})
    return [{**u, "_id": str(u["_id"])} for u in users]


@router.get("/activity-summary")
def get_activity_summary():
    logs_cursor = db["activity_logs"].aggregate([
        {
            "$match": { "action": "LOGIN" }  # Only include login actions
        },
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$timestamp"
                    }
                },
                "logins": { "$sum": 1 }
            }
        },
        {
            "$sort": { "_id": 1 }
        }
    ])
    return list(logs_cursor)


@router.get("/activity-log/download")
async def download_log():
    logs = list(db["activity_logs"].find())
    for log in logs:
        user = db["users"].find_one({"_id": ObjectId(log["userId"])})
        log["email"] = user["email"] if user else "N/A"

    pdf_data = generate_activity_pdf(logs)  # This is a bytearray or bytes
    buffer = BytesIO(pdf_data)  # Wrap it in a stream buffer
    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=activity_log.pdf"
        }
    )