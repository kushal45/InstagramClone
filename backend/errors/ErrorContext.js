const BadRequestError = require("./BadRequestError");
const NotFoundError = require("./NotFoundError");


class ErrorContext {
    constructor(
       location,
        attributes,
    ) {
        this.location = location;
        this.attributes = attributes;
    }
}
class ErrorWithContext extends Error {
  constructor(error, context,filePath) {
    //console.log("error",error);
    super(error.message);
    this.contextStack = [];
    this.error = error;
    this.context = context;
    this.addContext(this.context);
    this.filePath = filePath;
  }

  wrap() {
    if (this.error instanceof ErrorWithContext) {
        this.error.addContext(this.context);
        return this.error;
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
       this.error,
        this.context,
        this.filePath,
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
