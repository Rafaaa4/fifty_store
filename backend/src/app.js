import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { pool } from './config/db.js';
import { authenticateAdmin } from './middleware/authenticateAdmin.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/authRoutes.js';
import { orderRouter } from './routes/orderRoutes.js';
import { adminOrderRouter } from './routes/adminOrderRoutes.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.frontendOrigins, credentials: true }));
  app.use(express.json({ limit: '80kb' }));

  app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 }));
  app.use('/api/orders', rateLimit({ windowMs: 15 * 60 * 1000, limit: 60 }));

  app.get('/api/health', async (_req, res) => {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/orders', orderRouter);
  app.use('/api/admin/orders', authenticateAdmin, adminOrderRouter);
  app.use(errorHandler);

  return app;
}
