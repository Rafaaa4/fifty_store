import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { pool } from './config/db.js';
import { authenticateAdmin } from './middleware/authenticateAdmin.js';
import { optionalCustomer } from './middleware/authenticateCustomer.js';
import { errorHandler } from './middleware/errorHandler.js';
import { adminContactRouter } from './routes/adminContactRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { contactRouter } from './routes/contactRoutes.js';
import { customerRouter } from './routes/customerRoutes.js';
import { orderRouter } from './routes/orderRoutes.js';
import { adminOrderRouter } from './routes/adminOrderRoutes.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.frontendOrigins, credentials: true }));
  app.use(express.json({ limit: '80kb' }));

  app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 }));
  app.use('/api/customer', rateLimit({ windowMs: 15 * 60 * 1000, limit: 40 }));
  app.use('/api/orders', rateLimit({ windowMs: 15 * 60 * 1000, limit: 60 }));
  app.use('/api/contact', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 }));

  app.get('/api/health', async (_req, res) => {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/customer', customerRouter);
  app.use('/api/orders', optionalCustomer, orderRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/admin/orders', authenticateAdmin, adminOrderRouter);
  app.use('/api/admin/contacts', authenticateAdmin, adminContactRouter);
  app.use(errorHandler);

  return app;
}
