require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { requestLogger, logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const { metricsMiddleware } = require('./metrics');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Observability Middlewares
app.use(requestLogger);
app.use(metricsMiddleware);

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);
app.use('/', healthRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'AppForge Platform API', version: '1.0.0' });
});

// Global Error Handler
app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app; // For testing
