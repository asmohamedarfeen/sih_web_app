from fastapi import APIRouter

router = APIRouter(prefix="/multilingual", tags=["Multilingual"])

@router.get("/")
def get_multilingual_overview():
    return {"module": "multilingual", "status": "active"}
