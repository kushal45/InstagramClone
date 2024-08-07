const express = require('express');
const promClient = require('prom-client');

// Create a Registry to register the metrics
const requestCount = new promClient.Counter({
    name: 'request_count',
    help: 'Total number of requests',
});

const requestLatency = new promClient.Histogram({
    name: 'request_latency_seconds',
    help: 'Request latency in seconds',
    buckets: [0.1, 0.5, 1, 2, 5] // Define latency buckets
});

const inProgressRequests = new promClient.Gauge({
    name: 'in_progress_requests',
    help: 'Number of requests in progress',
});

// Middleware to measure request duration
const prometheusMiddleware = (req, res, next) => {
    const end = requestLatency.startTimer();
    inProgressRequests.inc();

    res.on('finish', () => {
        requestCount.inc();
        inProgressRequests.dec();
        end();
    });
  next();
};

// Endpoint to expose metrics
const metricsEndpoint = async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    const metrics = await promClient.register.metrics();
    res.end(metrics);
};

module.exports = {
  prometheusMiddleware,
  metricsEndpoint
};