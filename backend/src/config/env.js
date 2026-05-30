import 'dotenv/config';

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'change-this-secret-before-production',
  frontendOrigins: [
    ...(process.env.FRONTEND_ORIGIN?.split(',') || ['http://localhost:5173', 'http://127.0.0.1:5173']),
    ...(process.env.ADMIN_ORIGIN?.split(',') || ['http://localhost:5174', 'http://127.0.0.1:5174']),
  ].map((origin) => origin.trim()).filter(Boolean),
  database: {
    connectionString: process.env.DATABASE_URL,
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE || 'fifty_store',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
  },
  admin: {
    email: process.env.ADMIN_EMAIL?.trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID?.trim(),
  },
};

export const isProduction = env.nodeEnv === 'production';
