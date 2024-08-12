cd backend
if docker ps -a | grep -q 'backend'; then
    docker stop backend-*
    docker rm backend-*
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

#DEBUG=1 docker-compose up -d --remove-orphans --force-recreate
docker-compose -f docker-compose.yml -f docker-composer-db.yml -f docker-compose-inflx-grafana.yml -f docker-compose-elk.yml   up --remove-orphans  -d --build
node run-migrations.js

