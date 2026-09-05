from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config.settings import settings
from backend.app.database.init_db import init_database_and_seed
from backend.app.api.authentication.routes import router as auth_router
from backend.app.api.dashboard.routes import router as dashboard_router
from backend.app.api.personnel.routes import router as personnel_router
from backend.app.api.wellness.routes import router as wellness_router
from backend.app.api.ai_risk.routes import router as ai_risk_router
from backend.app.api.interventions.routes import router as interventions_router
from backend.app.api.alerts.routes import router as alerts_router
from backend.app.api.analytics.routes import router as analytics_router
from backend.app.api.reports.routes import router as reports_router
from backend.app.middleware.security_headers import SecurityHeadersMiddleware
from backend.app.middleware.rate_limiter import RateLimiterMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database & Seed Default Role Users
    init_database_and_seed()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan
)

# Enterprise Security Middlewares
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimiterMiddleware, max_requests=120, window_seconds=60)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)
app.include_router(personnel_router, prefix=settings.API_V1_STR)
app.include_router(wellness_router, prefix=settings.API_V1_STR)
app.include_router(ai_risk_router, prefix=settings.API_V1_STR)
app.include_router(interventions_router, prefix=settings.API_V1_STR)
app.include_router(alerts_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)





@app.get("/health", tags=["Monitoring"])
def health_check():
    """Health check endpoint for container orchestrators and load balancers."""
    return {"status": "healthy", "service": "pswms-backend", "version": settings.VERSION}


@app.get(f"{settings.API_V1_STR}/", tags=["Root"])
def root():
    """Root API endpoint."""
    return {"message": "Personnel Stress & Welfare Monitoring System REST API Gateway"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
