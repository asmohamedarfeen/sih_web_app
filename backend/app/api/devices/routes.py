from fastapi import APIRouter

router = APIRouter(prefix="/devices", tags=["Devices"])

@router.get("/")
def get_devices_overview():
    return {"module": "devices", "status": "active"}
