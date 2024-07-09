const { NotFoundError, InternalServerError } = require('../errors');

const errorHandler = (err, req, res, next) => {
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).send({ message: err.message });
  } else if (err instanceof InternalServerError) {
    return res.status(err.statusCode).send({ message: err.message });
  } else {
    // For any other types of errors, send a generic error message
    return res.status(500).send({ message: "An unexpected error occurred" });
  }
};

module.exports = errorHandler;