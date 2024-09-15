FROM postgres:14
FROM node:18
WORKDIR /app
COPY package*.json .
RUN npm cache clean --force
#RUN rm -f package-lock.json
# Use a different npm registry (optional)
RUN npm config set registry https://registry.npmjs.org/

# Install dependencies and generate a new package-lock.json
RUN npm install --verbose --no-audit --fetch-timeout=60000
COPY . .
EXPOSE 3000