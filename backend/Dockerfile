FROM postgres:14-alpine
FROM node:21-alpine
WORKDIR /app
COPY package*.json .
RUN npm cache clean --force
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
ENV NEW_RELIC_LOG=stdout
ENV NEW_RELIC_AI_MONITORING_ENABLED=true
ENV NEW_RELIC_CUSTOM_INSIGHTS_EVENTS_MAX_SAMPLES_STORED=100k
ENV NEW_RELIC_SPAN_EVENTS_MAX_SAMPLES_STORED=10k
#RUN rm -f package-lock.json
# Use a different npm registry (optional)
RUN npm config set registry https://registry.npmjs.org/

# Install dependencies and generate a new package-lock.json
RUN npm install --verbose --no-audit --fetch-timeout=60000
COPY . .
EXPOSE 3000