import json
import uuid
from typing import Dict, List, Union

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from loguru import logger

from src.api.endpoints.helper.chat_manager import (
    ChatRequest,
    ChatResponse,
    ChatRule,
    chat_handler,
    manager,
)

router = APIRouter(prefix="/api", tags=["Chat"])


class ChatWebSocketManager:
    """Менеджер WebSocket соединений"""

    def __init__(self):
        self.connections: Dict[str, WebSocket] = {}

    async def connect(self, client_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.connections[client_id] = websocket
        logger.info(f"🔗 Новое подключение: {client_id}")

    def disconnect(self, client_id: str) -> None:
        if client_id in self.connections:
            del self.connections[client_id]
            logger.info(f"❌ Клиент {client_id} отключен")

    async def send_message(self, client_id: str, message: Union[str, dict]) -> None:
        if client_id not in self.connections:
            logger.warning(f"⚠️ Попытка отправить сообщение несуществующему клиенту: {client_id}")
            return

        websocket = self.connections[client_id]

        if isinstance(message, dict):
            message = json.dumps(message)

        await websocket.send_text(message)

    def get_client_count(self) -> int:
        return len(self.connections)


@router.websocket("/ws/chat")
async def websocket_endpoint(websocket: WebSocket) -> None:
    """
    WebSocket эндпоинт для чата

    Обрабатывает подключение, получение и отправку сообщений в реальном времени
    """
    client_id = str(uuid.uuid4())[:8]

    try:
        await manager.connect(client_id, websocket)

        await websocket.send_text(json.dumps(ChatResponse(text=chat_handler.get_greeting()).dict()))

        while True:
            raw_data = await websocket.receive_text()
            logger.info(f"📩 {client_id}: {raw_data}")

            try:
                msg_data = json.loads(raw_data)
                message = msg_data.get("text", "")
            except (json.JSONDecodeError, AttributeError):
                message = raw_data

            response = chat_handler.process_message(message, client_id)

            await websocket.send_text(json.dumps(ChatResponse(text=response).dict()))

    except WebSocketDisconnect:
        manager.disconnect(client_id)
    except Exception as e:
        logger.error(f"❌ Ошибка в WebSocket для клиента {client_id}: {e}")
        manager.disconnect(client_id)


@router.post("/chat")
async def chat_fallback(request: ChatRequest) -> dict:
    """
    HTTP эндпоинт для чата (синхронный режим)

    Используется как fallback для клиентов без поддержки WebSocket
    """
    response = chat_handler.process_message(request.message, "http_user")
    return dict(reply=response)


@router.post("/chat/rules")
async def add_chat_rule(keywords: List[str], response: str, priority: int = 0) -> ChatRule:
    """
    Добавляет новое правило для чат-бота (административный эндпоинт)
    """
    chat_handler.add_rule(keywords, response, priority)
    return ChatRule(
        status="success",
        message=f"Rule added with {len(keywords)} keywords",
        rule_count=len(chat_handler.rules),
    )
