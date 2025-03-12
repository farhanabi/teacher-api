import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import apiRoutes from './api/routes/index.js';
import { errorHandler } from './api/middlewares/error';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// API health check
app.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api', apiRoutes);

// 404 handler
app.use((_, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Error handler
app.use(errorHandler);

export default app;