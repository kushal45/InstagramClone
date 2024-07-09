cd backend
if docker ps -a | grep -q 'backend'; then
    docker stop backend
    docker rm backend
fi
docker image prune -f
containers_up=$(docker-compose ps -q)

if [ -n "$containers_up" ]; then
  echo "Containers are up. Bringing them down..."
  docker-compose down
else
  echo "Containers are already down."
fi

docker-compose up -d --build

