const uuid = require('uuid');
const httpContext = require('express-http-context');

try {
  const correlationIdMiddleware = (req, res, next) => {
    const correlationId = req.headers['x-correlation-id'] || uuid.v4();
    httpContext.set('correlationId', correlationId);
    res.setHeader('x-correlation-id', correlationId);
    next();
  };
  
  module.exports = correlationIdMiddleware;
} catch (error) {
  console.error('Correlation ID error:', error);
}
