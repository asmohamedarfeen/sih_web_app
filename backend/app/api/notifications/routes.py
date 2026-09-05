from fastapi import APIRouter

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("/")
def get_notifications_overview():
    return {"module": "notifications", "status": "active"}
