from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class ProfileRequest(BaseModel):
    name: str
    context: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    target_name: str
    context: str
    profile: Dict[str, Any]
    history: List[ChatMessage]

class ProfileResponse(BaseModel):
    profile: Dict[str, Any]
    thought_process: str
    strategy: str
    sources: List[str]
