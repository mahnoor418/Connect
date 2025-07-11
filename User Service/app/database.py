from pymongo import MongoClient
import os

db = None

def connect_to_mongo():
    global db
    uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(uri)
    db = client["ConnectApp"]

def get_db():
    print("Getting database connection...", db)
    if db is None:
        raise Exception("Database not connected. Call connect_to_mongo() first.")
    return db
