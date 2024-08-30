const BadRequestError = require("./BadRequestError");
const NotFoundError = require("./NotFoundError");


class ErrorContext {
    constructor(
       location,
        attributes,
    ) {
        Object.freeze({
            location,
            attributes,
        });
    }
}
class ErrorWithContext extends Error {
  constructor(error, context,filePath) {
    this.contextStack = [];
    this.error = error;
    this.context = context;
    this.addContext(this.context);
    this.filePath = filePath;
  }

  wrap() {
    if (error instanceof ErrorWithContext) {
        error.addContext(this.context);
        return error;
    }
    if (
      (this.error instanceof BadRequestError) |
      (this.error instanceof NotFoundError)
    ) {
        return new ErrorWithContext(
            this.error,
            this.context,
            this.filePath,
        );
    }
    if (this.error instanceof Error) {
      return new ErrorWithContext(
        this.error.name,
        this.error.message,
        context,
        error,
      );
    }
  }

  addContext(context) {
    this.contextStack.push(context);
  }
}

module.exports = {
    ErrorContext,
    ErrorWithContext,
};
