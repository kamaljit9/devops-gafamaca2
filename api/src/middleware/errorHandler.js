const { logger } = require('./logger');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';

  logger.error('Error occurred', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    request_id: req.id,
    status_code: statusCode,
    error_code: errorCode,
  });

  res.status(statusCode).json({
    error: {
      message: err.message,
      code: errorCode,
      request_id: req.id,
    },
  });
};

module.exports = errorHandler;
