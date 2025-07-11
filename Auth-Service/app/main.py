# --- FILE: app/main.py ---
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth
from app.database import check_db_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await check_db_connection()


app.include_router(auth.router, prefix="/api/auth")

@app.get("/")
async def root():
    return {"message": "Server running"}