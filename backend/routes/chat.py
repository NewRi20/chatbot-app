from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google.genai import types
from config import client
from chatbotConfig import SYSTEM_INSTRUCTION 


router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    try:
        modelId = "gemini-2.5-flash"
        response = client.models.generate_content(
            model=modelId,
            contents=request.message,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_INSTRUCTION
            )
        )

        return {"reply": response.text}
    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
