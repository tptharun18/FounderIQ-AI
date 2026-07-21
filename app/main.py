from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.monday import router as monday_router
from app.api.dashboard import router as dashboard_router
from app.api.deals import router as deals_router

app = FastAPI(
    title="FounderIQ AI",
    description="Executive Intelligence Copilot",
    version="1.0.0",
)

# ---------------------------------
# CORS Configuration
# ---------------------------------
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------
# Register API Routers
# ---------------------------------
app.include_router(monday_router, tags=["Monday"])
app.include_router(dashboard_router, tags=["Dashboard"])
app.include_router(deals_router, tags=["Deals"])

# ---------------------------------
# Root Endpoint
# ---------------------------------
@app.get("/")
def root():
    return {
        "status": "running",
        "product": "FounderIQ AI",
        "version": "1.0.0"
    }