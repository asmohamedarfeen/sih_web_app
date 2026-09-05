from fastapi import APIRouter

router = APIRouter(prefix="/monitoring", tags=["Monitoring"])

@router.get("/")
def get_monitoring_overview():
    return {"module": "monitoring", "status": "active"}
