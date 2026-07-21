from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    username: str
    password_hash: str

SKYLARK_PASSWORD_HASH = "e14da3bc16df326023093f15417e0b9f72920e51bd4d576fa8e9a2634d1cadf2" # SHA-256 hash of 'skylark'

@router.post("/auth/login")
def login(payload: LoginRequest):
    if payload.username == "user333" and payload.password_hash == SKYLARK_PASSWORD_HASH:
        return {
            "success": True,
            "token": "skylark-session-token-abc123xyz",
            "user": {
                "username": "user333",
                "role": "Executive Administrator"
            }
        }
    raise HTTPException(status_code=401, detail="Invalid username or password credentials")
