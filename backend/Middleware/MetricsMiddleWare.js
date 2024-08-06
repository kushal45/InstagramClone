const Metrics = require("../util/Metrics");

const  metrics = new Metrics();


const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const durationMs = metrics.fetchDurationMs(start);
    const options= {
        endpoint: req.originalUrl,
        method: req.method,
        status_code: res.statusCode,
        response_time_ms: durationMs
    }
    metrics.capture(options);
  });

  next();
};

module.exports = metricsMiddleware;