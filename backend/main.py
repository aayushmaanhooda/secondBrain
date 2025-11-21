from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bot import run_conversation
from config import mem0
from utils import check_user_exist

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserRequest(BaseModel):
    user_id: str

class ChatRequest(BaseModel):
    user_id: str
    message: str

@app.post("/user")
async def check_user(request: UserRequest):
    try:
        is_new_user = True
        user_id = check_user_exist(request.user_id)
        if user_id:
            is_new_user = False 
             
        return {
            "status": "success",
            "is_new_user": is_new_user,
            "user_id": request.user_id
        }
    except Exception as e:
        # If error occurs (e.g. user not found might raise error or return empty), treat as new user or handle error
        print(f"Error checking user: {e}")
        return {
            "status": "success",
            "is_new_user": True,
            "user_id": request.user_id
        }

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = run_conversation(request.message, request.user_id)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
