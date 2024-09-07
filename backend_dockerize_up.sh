appBaseImageRebuild=$1
echo "appBaseImageRebuild: $appBaseImageRebuild"
cd backend
if docker ps -a | grep -q 'backend'; then
    docker stop backend-*
    docker rm backend-*
    docker volume prune
fi
docker image prune -f
containers_up=$(docker-compose ps -a)

if [ -n "$containers_up" ]; then
  echo "Containers are up. Bringing them down..."
  docker-compose down
else
  echo "Containers are already down."
fi

#DEBUG=1 docker-compose up -d --remove-orphans --force-recreate
if (docker images | grep -q 'appbase *latest') & !$appBaseImageRebuild; then
   echo "appbase image exists"
else
    echo "appbase image does not exist"
    DEBUG=1 docker build -f Dockerfile -t appbase:latest .
fi
DEBUG=1 docker-compose -f docker-compose.yml -f docker-composer-db.yml -f docker-compose-inflx-grafana.yml -f docker-compose-elk.yml   up --remove-orphans  --build -d
node run-migrations.js

