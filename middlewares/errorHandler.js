/* eslint-disable no-unused-vars */
const errorHandler = (err, req, res, next) => {
  const isProd = process.env.NODE_ENV === 'production';

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate key error';
  }

  const response = {
    status: `${statusCode}`.startsWith('4') ? 'fail' : 'error',
    message
  };

  if (!isProd) {
    response.stack = err.stack;
    if (err.errors) response.details = err.errors;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;


