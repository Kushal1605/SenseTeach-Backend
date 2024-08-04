// This function is a higher-order function that takes a request handler function as an argument.
const asyncWrapper = (requestHandler) => {
  // It returns an asynchronous function that takes the request, response, and next middleware function as arguments.
  return async (req, res, next) => {
    try {
      // It calls the request handler function with the request, response, and next middleware function.
      await requestHandler(req, res, next);
    } catch (error) {
      // If the request handler function throws an error, it calls the next middleware function with the error.
      next(error);
    }
  };
};

export default asyncWrapper;
