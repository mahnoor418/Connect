from fastapi import APIRouter
from app.controllers import adminController

router = APIRouter(prefix="/api/admin")
router.include_router(adminController.router)
