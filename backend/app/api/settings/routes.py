from fastapi import APIRouter

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("/")
def get_settings_overview():
    return {"module": "settings", "status": "active"}
