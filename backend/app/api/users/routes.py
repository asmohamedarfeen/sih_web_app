from fastapi import APIRouter

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/")
def get_users_overview():
    return {"module": "users", "status": "active"}
