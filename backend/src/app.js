import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import { env } from './config/env.js';
import { pool } from './config/db.js';
import { authenticateAdmin } from './middleware/authenticateAdmin.js';
import { optionalCustomer } from './middleware/authenticateCustomer.js';
import { errorHandler } from './middleware/errorHandler.js';
import { adminContactRouter } from './routes/adminContactRoutes.js';
import { adminProductRouter } from './routes/adminProductRoutes.js';
import { adminRepairRouter } from './routes/adminRepairRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { contactRouter } from './routes/contactRoutes.js';
import { customerRouter } from './routes/customerRoutes.js';
import { orderRouter } from './routes/orderRoutes.js';
import { adminOrderRouter } from './routes/adminOrderRoutes.js';
import { productRouter } from './routes/productRoutes.js';
import { repairRouter } from './routes/repairRoutes.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));
  app.use(cors({ origin: env.frontendOrigins, credentials: true }));
  app.use(express.json({ limit: '80kb' }));
  fs.mkdirSync('uploads/products', { recursive: true });
  app.use('/uploads', cors({ origin: env.frontendOrigins }), express.static('uploads'));

  app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 }));
  app.use('/api/customer', rateLimit({ windowMs: 15 * 60 * 1000, limit: 40 }));
  app.use('/api/orders', rateLimit({ windowMs: 15 * 60 * 1000, limit: 60 }));
  app.use('/api/contact', rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 }));
  app.use('/api/repairs', rateLimit({ windowMs: 15 * 60 * 1000, limit: 30 }));

  app.get('/api/health', async (_req, res) => {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/customer', customerRouter);
  app.use('/api/products', productRouter);
  app.use('/api/orders', optionalCustomer, orderRouter);
  app.use('/api/contact', contactRouter);
  app.use('/api/repairs', repairRouter);
  app.use('/api/admin/orders', authenticateAdmin, adminOrderRouter);
  app.use('/api/admin/contacts', authenticateAdmin, adminContactRouter);
  app.use('/api/admin/products', authenticateAdmin, adminProductRouter);
  app.use('/api/admin/repairs', authenticateAdmin, adminRepairRouter);
  app.use(errorHandler);

  return app;
}
