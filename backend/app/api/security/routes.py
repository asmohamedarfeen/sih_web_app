from fastapi import APIRouter

router = APIRouter(prefix="/security", tags=["Security"])

@router.get("/")
def get_security_overview():
    return {"module": "security", "status": "active"}
