const Metrics = require("../util/Metrics");

const  metrics = new Metrics();


const metricsMiddleware = (req, res, next) => {
  const start = process.hrtime();

  res.on('finish', async () => {
    const durationMs = metrics.fetchDurationMs(start);
    const options= {
        endpoint: req.originalUrl,
        method: req.method,
        status_code: res.statusCode,
        response_time_ms: durationMs
    }
    await metrics.capture(options);
  });

  next();
};

module.exports = metricsMiddleware;