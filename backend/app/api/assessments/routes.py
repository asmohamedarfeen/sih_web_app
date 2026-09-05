from fastapi import APIRouter

router = APIRouter(prefix="/assessments", tags=["Assessments"])

@router.get("/")
def get_assessments_overview():
    return {"module": "assessments", "status": "active"}
