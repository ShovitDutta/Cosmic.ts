#!/bin/sh
printf "Do you need to rebuild Docker images? (y/n) "
read -r rebuild_choice
rebuild_choice=$(echo "$rebuild_choice" | tr '[:upper:]' '[:lower:]')
if [ "$rebuild_choice" = "y" ]; then
    echo "Stopping and removing existing containers and images..."
    docker compose down --rmi all
    echo "Building new images..."
    docker compose build
fi
docker compose up -d
echo "Docker services are running. Access your application at http://localhost:3000"
echo ""
echo "Run After Some Time To Check Health Manually: docker compose exec monorepo-js curl http://localhost:8000"
echo ""
echo "Run To Close Container: docker compose down"