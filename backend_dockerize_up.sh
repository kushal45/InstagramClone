cd backend
if docker ps -a | grep -q 'backend'; then
    docker stop backend
    docker rm backend
    docker volume prune
fi
docker image prune -f
containers_up=$(docker-compose ps -q)

if [ -n "$containers_up" ]; then
  echo "Containers are up. Bringing them down..."
  docker-compose down
else
  echo "Containers are already down."
fi

DEBUG=1 docker-compose up -d --build
node run-migrations.js

