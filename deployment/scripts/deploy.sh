#!/usr/bin/env bash
set -e

echo "=== Deploying Personnel Stress & Welfare Monitoring System ==="
docker compose -f deployment/docker/docker-compose.yml up -d --build
echo "=== Deployment Succeeded ==="
