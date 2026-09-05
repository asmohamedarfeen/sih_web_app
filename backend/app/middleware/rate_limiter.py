import time
from collections import defaultdict
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse


class RateLimiterMiddleware(BaseHTTPMiddleware):
    """
    Sliding-window in-memory rate limiter to protect HRMS data fetching pipelines
    against credential stuffing, scraping, and DoS attempts.
    """

    def __init__(self, app, max_requests: int = 120, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)

    async def dispatch(self, request: Request, call_next):
        # Health check endpoints are exempt from strict rate limits
        if request.url.path in ["/health", "/docs", "/openapi.json"]:
            return await call_next(request)

        client_ip = request.client.host if request.client else "unknown_ip"
        current_time = time.time()

        # Clean timestamps older than window
        timestamps = self.requests[client_ip]
        self.requests[client_ip] = [t for t in timestamps if current_time - t < self.window_seconds]

        # Check limit
        if len(self.requests[client_ip]) >= self.max_requests:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "Too Many Requests",
                    "detail": "Data pipeline rate limit exceeded. Please throttle your requests.",
                    "retry_after_seconds": int(self.window_seconds - (current_time - self.requests[client_ip][0]))
                },
                headers={"Retry-After": str(self.window_seconds)}
            )

        self.requests[client_ip].append(current_time)
        return await call_next(request)
