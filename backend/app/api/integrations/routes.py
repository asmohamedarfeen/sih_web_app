from fastapi import APIRouter

router = APIRouter(prefix="/integrations", tags=["Integrations"])

@router.get("/")
def get_integrations_overview():
    return {"module": "integrations", "status": "active"}
