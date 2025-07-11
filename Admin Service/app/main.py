from fastapi import FastAPI
from app.routes.adminRoutes import router as admin_router
from fastapi.middleware.cors import CORSMiddleware
# from app.database import check_db_connection

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.on_event("startup")
# async def startup_event():
#     await check_db_connection()


app.include_router(admin_router)
