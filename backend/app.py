from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI()

class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat(request: ChatRequest):
    model = genai.GenerativeModel("gemini-1.5-flash")
    # You would put your SYSTEM_INSTRUCTION here in the backend
    response = model.generate_content(request.message)
    return {"reply": response.text}