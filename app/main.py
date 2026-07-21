from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.api.monday import router as monday_router
from app.api.dashboard import router as dashboard_router
from app.api.deals import router as deals_router

app = FastAPI(
    title="FounderIQ AI",
    description="Executive Intelligence Copilot",
    version="1.0.0",
)

# -----------------------------
# CORS
# -----------------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://founderiq-ai.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# API Routes
# -----------------------------
app.include_router(monday_router)
app.include_router(dashboard_router)
app.include_router(deals_router)

# -----------------------------
# React Build Location
# -----------------------------
PROJECT_ROOT = Path(__file__).resolve().parent.parent
FRONTEND_DIST = PROJECT_ROOT / "frontend" / "dist"

print("PROJECT ROOT :", PROJECT_ROOT)
print("FRONTEND DIST:", FRONTEND_DIST)
print("DIST EXISTS :", FRONTEND_DIST.exists())

# -----------------------------
# Serve React
# -----------------------------
if FRONTEND_DIST.exists():

    assets = FRONTEND_DIST / "assets"

    if assets.exists():
        app.mount(
            "/assets",
            StaticFiles(directory=assets),
            name="assets",
        )

    @app.get("/", include_in_schema=False)
    async def root():
        return FileResponse(FRONTEND_DIST / "index.html")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def react_app(full_path: str):
        file_path = FRONTEND_DIST / full_path

        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)

        return FileResponse(FRONTEND_DIST / "index.html")

else:

    @app.get("/")
    def root():
        return {
            "status": "running",
            "product": "FounderIQ AI",
            "version": "1.0.0",
            "message": "React build not found"
        }