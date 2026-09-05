from fastapi import APIRouter

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("/")
def get_profile_overview():
    return {"module": "profile", "status": "active"}
