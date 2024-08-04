class ApiError extends Error {
  constructor(
    message = "Something went wrong",
    statusCode = 500,
    stack = "",
    errors = []
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.message = message;
    this.errors = errors;
    this.data = null;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
