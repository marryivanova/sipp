from pydantic import BaseModel


class ChatResponse(BaseModel):
    type: str = "message"
    text: str


class ChatRequest(BaseModel):
    message: str


class ChatRule(BaseModel):
    status: str
    message: str
    rule_count: int
