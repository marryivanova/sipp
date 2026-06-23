from fastapi import APIRouter

from src.api.endpoints import auth, chat_socket, sender_kp

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(sender_kp.router)
api_router.include_router(chat_socket.router)
