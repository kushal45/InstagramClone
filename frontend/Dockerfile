# Use the official Node.js image as the base image
FROM node:21-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

RUN npm cache clean --force

# Install nodemon globally
RUN npm install -g nodemon

# Install dependencies
RUN npm install --verbose --no-audit --fetch-timeout=60000

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 3002

# Start the application with nodemon