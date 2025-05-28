@echo off
echo Do you need to rebuild Docker images? (y/n)
set /p rebuild_choice=
if /i "%rebuild_choice%"=="y" (
    echo Stopping and removing existing containers and images...
    docker compose down --rmi all
    echo Building new images...
    docker compose build
)
docker compose up -d
echo Docker services are running. Access your application at http://localhost:3000
echo.
echo Run After Some Time To Check Health Manually:
echo     docker compose exec monorepo-js curl http://localhost:8000
echo.
echo Run To Close Container:
echo     docker compose down