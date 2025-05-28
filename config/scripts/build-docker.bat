@echo off
docker compose build
docker compose up -d
echo Docker services are running. Access your application at http://localhost:3000
echo "Docker services are running. Access your application at http://localhost:3000"
echo "Run After Some Time To Check Health Manually > docker compose exec monorepo-js curl http://localhost:8000"
echo "Run To Close Container > docker compose down"