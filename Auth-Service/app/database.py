from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ServerSelectionTimeoutError
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "ConnectApp")

client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client[DB_NAME]

async def check_db_connection():
    try:
        await client.admin.command('ping')
        print("MongoDB connected successfully!")
    except ServerSelectionTimeoutError:
        print("Failed to connect to MongoDB.")


