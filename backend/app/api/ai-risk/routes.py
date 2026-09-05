from fastapi import APIRouter

router = APIRouter(prefix="/ai-risk", tags=["Ai Risk"])

@router.get("/")
def get_ai_risk_overview():
    return {"module": "ai-risk", "status": "active"}
