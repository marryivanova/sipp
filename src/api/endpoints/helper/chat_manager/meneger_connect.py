from typing import Dict

from fastapi import WebSocket
from loguru import logger


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, client_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        logger.debug(f"✅ Клиент {client_id} подключен. Всего: {len(self.active_connections)}")

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            logger.debug(f"❌ Клиент {client_id} отключен. Всего: {len(self.active_connections)}")

    async def send_message(self, client_id: str, message: str):
        if client_id in self.active_connections:
            try:
                await self.active_connections[client_id].send_text(message)
                return True
            except:
                self.disconnect(client_id)
                return False
        return False


manager = ConnectionManager()
