FROM postgres:14
FROM node:20
WORKDIR /app
ARG CACHEBUST=1
COPY package*.json .
#RUN npm cache clean --force
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]