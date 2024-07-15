const { NotFoundError, InternalServerError, BadRequestError} = require('../errors');

const errorResponseMap = new Map([
  [NotFoundError, { statusCode: 404, message: "Not found" }],
  [BadRequestError, { statusCode: 400, message: "Bad request" }],
  [InternalServerError, { statusCode: 500, message: "Internal server error" }],
]);

const errorHandler = (err, req, res, next) => {
  const errorResponse = errorResponseMap.get(err.constructor);
  if (errorResponse) {
    return res.status(errorResponse.statusCode).send({ message: err.message || errorResponse.message });
  } else {
    return res.status(500).send({ message: "An unexpected error occurred" });
  }
};

module.exports = errorHandler;