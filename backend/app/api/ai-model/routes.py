from fastapi import APIRouter

router = APIRouter(prefix="/ai-model", tags=["Ai Model"])

@router.get("/")
def get_ai_model_overview():
    return {"module": "ai-model", "status": "active"}
