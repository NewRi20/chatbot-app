from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat


app = FastAPI()
app.include_router(chat.router)

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]

# Need to have CORS for
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Your React URL
    allow_credentials=True,
    allow_methods=["*"], # Allow GET, POST, etc.
    allow_headers=["*"], # Allow all headers
)

@app.get("/")
async def root():
    return {"message": "VHA Chatbot Backend is Running"}