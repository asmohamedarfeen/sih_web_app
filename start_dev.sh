#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "🛡️ Personnel Stress & Welfare Monitoring System (PSWMS)"
echo "=========================================================="

echo "1. Starting FastAPI Backend on http://localhost:8000 ..."
PYTHONPATH=. python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

echo "2. Starting Vite Frontend on http://localhost:3001 ..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "🚀 Both services are running!"
echo "   - Frontend Web App: http://localhost:3001"
echo "   - Backend Swagger API: http://localhost:8000/api/v1/docs"
echo "   - Backend Health: http://localhost:8000/health"
echo ""
echo "Press CTRL+C to terminate all services."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; exit" SIGINT SIGTERM EXIT
wait
