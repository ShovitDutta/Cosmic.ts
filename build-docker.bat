@echo off
docker compose build
docker compose up -d
echo Docker services are running. Access your application at http://localhost:3000