const express = require('express');

const app = express();

app.use(express.json());

app.use((request, response, next) => {
  console.log(`${request.method} ${request.originalUrl}`);
  next();
});

app.get('/api/health', (request, response) => {
  response.status(200).json({ status: 'ok' });
});

app.use((request, response, next) => {
  const error = new Error(`Route not found: ${request.method} ${request.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

app.use((error, request, response, next) => {
  const statusCode = error.statusCode || 500;
  response.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error' : error.message,
  });
});

module.exports = app;
