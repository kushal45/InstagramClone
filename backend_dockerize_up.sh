# Initialize the appBaseImageRebuild flag
appBaseImageRebuild=false

# Parse command line options
while getopts "r" opt; do
  case $opt in
    r) appBaseImageRebuild=true ;;
    \?) echo "Invalid option -$OPTARG" >&2 ;;
  esac
done

cd docker
if docker ps -a | grep -q 'backend' ||  docker ps -a | grep -q 'docker'; then
    docker stop backend-*
    docker rm backend-*
    docker volume prune
    docker stop docker-*
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
if docker images | grep -q 'appbase *latest'; then
  if [ "$appBaseImageRebuild" = true ]; then
    echo "Rebuilding appbase image as per the flag."
    DEBUG=1 docker build -f Dockerfile -t appbase:latest .
  else
    echo "appbase image exists and rebuild flag is not set."
  fi
else
  echo "appbase image does not exist. Building appbase image."
  DEBUG=1 docker build -f Dockerfile -t appbase:latest .
fi
DEBUG=1 docker-compose -f docker-compose.yml -f docker-composer-db.yml -f docker-compose-inflx-grafana.yml -f docker-compose-elk.yml   up --remove-orphans  --build -d
cd ..
cd backend
node run-migrations.js

