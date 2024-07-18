cd backend
if docker ps -a | grep -q 'backend'; then
    docker stop backend
    docker rm backend
    docker-compose down
fi