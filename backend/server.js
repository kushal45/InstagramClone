require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middleware/ErrorHandler");
const correlationIdMiddleware = require("./middleware/CorrelationIdHandler");
const metricsMiddleware = require("./middleware/MetricsMiddleWare");
const RedisMiddleware = require("./middleware/Redis");
const { prometheusMiddleware, metricsEndpoint } = require('./middleware/PrometheusMiddleWare');
const httpContext = require('express-http-context');

const PORT = process.env.PORT || 3000;

// Use httpContext middleware
app.use(metricsMiddleware);
app.use(RedisMiddleware);
app.use(httpContext.middleware);

// Use correlation ID middleware
app.use(correlationIdMiddleware);
app.use(
    cors({ origin: [process.env.CORS_ORIGIN, process.env.CORS_ORIGIN_IP] })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    "/files",
    express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);
app.use(prometheusMiddleware);
app.use(routes);
app.use(errorHandler);
app.use(metricsEndpoint);
app.listen(PORT);
console.log(`Server running on port ${PORT}`);