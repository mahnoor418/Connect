from datetime import datetime
from app.database import db

activity_logs = db["activity_logs"]

async def log_activity(user_id: str, action: str, details: str):
    await activity_logs.insert_one({
        "userId": user_id,
        "action": action,
        "details": details,
        "timestamp": datetime.utcnow()
    })
