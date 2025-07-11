from datetime import datetime
from app.database import get_db

def log_activity(user_id: str, action: str, details: str):
    db = get_db()
    activity_logs = db["activity_logs"]
    activity_logs.insert_one({
        "userId": user_id,
        "action": action,
        "details": details,
        "timestamp": datetime.utcnow()
    })
