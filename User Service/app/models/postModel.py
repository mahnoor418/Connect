# --- FILE: app/models/postModel.py ---
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class CommentModel(BaseModel):
    user: str
    text: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class LocationModel(BaseModel):
    lat: Optional[float] = None
    lng: Optional[float] = None

class PostModel(BaseModel):
    user: str
    description: Optional[str] = ""
    media: Optional[str] = ""
    comments: List[CommentModel] = []
    likes: List[str] = []
    mentions: List[str] = []
    location: Optional[LocationModel] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
