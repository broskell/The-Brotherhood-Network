export const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] Stack: ${err.stack}`);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose CastError (Bad ID format)
  if (err.name === 'CastError') {
    message = `Resource not found with id of ${err.value}`;
    statusCode = 404;
  }

  // Handle Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate field value entered: '${field}'. Please use another value.`;
    statusCode = 400;
  }

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    message = Object.values(err.errors).map(val => val.message).join(', ');
    statusCode = 400;
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};
