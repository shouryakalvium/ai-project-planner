function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    next(error);
    return;
  }

  const isMalformedJson = error instanceof SyntaxError && error.type === 'entity.parse.failed';
  const statusCode = isMalformedJson ? 400 : error.statusCode || 500;
  const isClientError = statusCode >= 400 && statusCode < 500;

  response.status(statusCode).json({
    error: isMalformedJson
      ? 'Malformed JSON request body'
      : isClientError
        ? error.message
        : 'Internal server error',
  });
}

module.exports = errorHandler;
