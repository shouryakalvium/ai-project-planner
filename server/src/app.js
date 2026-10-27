const express = require('express');
const healthRoutes = require('./routes/healthRoutes');
const projectRoutes = require('./routes/projectRoutes');
const requestLogger = require('./middleware/requestLogger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use('/api', healthRoutes);
app.use('/api/projects', projectRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
