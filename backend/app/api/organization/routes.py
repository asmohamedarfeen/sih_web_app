from fastapi import APIRouter

router = APIRouter(prefix="/organization", tags=["Organization"])

@router.get("/")
def get_organization_overview():
    return {"module": "organization", "status": "active"}
