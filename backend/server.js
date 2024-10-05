process.on("uncaughtException", (err) => {
  console.error("There was an uncaught error", err);
  // Perform any necessary cleanup
  process.exit(1); // Exit the application
});

// Add event listener for unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Perform any necessary cleanup
  process.exit(1); // Exit the application
});

require("dotenv").config();
const newrelic = require("newrelic");
const express = require("express");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const path = require("path");
const app = express();
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middleware/ErrorHandler");
const correlationIdMiddleware = require("./middleware/CorrelationIdHandler");
const metricsMiddleware = require("./middleware/MetricsMiddleWare");
const RedisMiddleware = require("./middleware/Redis");
const helmet = require("helmet");
const {
  prometheusMiddleware,
  metricsEndpoint,
} = require("./middleware/PrometheusMiddleWare");
const httpContext = require("express-http-context");
const configureDebeziumConnector = require("./database/confDebeziumConnector");
const http = require("http");
const { webSocketMiddleware } = require("./Middleware/WebSocketMiddleWare");
newrelic.instrumentLoadedModule("express", app);

const PORT = process.env.PORT || 3000;

try {
  // Use httpContext middleware
  const server = http.createServer(app);
  webSocketMiddleware(server);
  app.use(metricsMiddleware);
  app.use(compression());
  app.use(RedisMiddleware);
  app.use(httpContext.middleware);
  app.use(helmet());

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200000, // limit each IP to 100 requests per windowMs
  });
  app.use(limiter);

  // Use correlation ID middleware
  app.use(correlationIdMiddleware);
  // app.use(
  //   cors({ origin: [process.env.CORS_ORIGIN, process.env.CORS_ORIGIN_IP] })
  // );
  const corsOptions = {
    origin: "*",
    optionSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

  app.use(cors(corsOptions));

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
  configureDebeziumConnector().catch(console.error);
  server.listen(PORT, () => {
    const address = server.address();
    console.log(`Server is running on port ${PORT}`);
    console.log("address", address);
  });
} catch (error) {
  console.error("server error:", error);
}
