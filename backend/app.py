from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat


app = FastAPI()
app.include_router(chat.router)

origins = [
    "http://localhost:5173",
    "http://localhost",
    "https://vha-aichatbot.vercel.app"
]

# Need to have CORS for
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

@app.get("/")
async def root():
    return {"message": "VHA Chatbot Backend is Running"}