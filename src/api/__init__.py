from fastapi import APIRouter

from src.api.endpoints import auth, sender_kp

api_router = APIRouter(prefix="/v1")
