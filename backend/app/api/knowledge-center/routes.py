from fastapi import APIRouter

router = APIRouter(prefix="/knowledge-center", tags=["Knowledge Center"])

@router.get("/")
def get_knowledge_center_overview():
    return {"module": "knowledge-center", "status": "active"}
