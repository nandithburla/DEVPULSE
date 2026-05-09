function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`
    }
  });
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: {
      message: statusCode === 500 ? 'Internal server error' : err.message,
      details: process.env.NODE_ENV === 'production' ? undefined : err.message
    }
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
