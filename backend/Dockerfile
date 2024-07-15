FROM postgres:14
FROM node:20
WORKDIR /app
COPY package*.json .
#RUN npm cache clean --force
RUN npm install
COPY . .
EXPOSE 3000