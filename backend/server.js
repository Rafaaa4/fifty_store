import { createApp } from './src/app.js';
import { env, isProduction } from './src/config/env.js';
import { migrate } from './src/db/migrate.js';

migrate()
  .then(() => {
    const app = createApp();

    app.listen(env.port, () => {
      console.log(`Backend listening on http://localhost:${env.port}`);

      if (!isProduction && env.jwtSecret === 'change-this-secret-before-production') {
        console.warn('JWT_SECRET is using the development fallback. Set it in .env for production.');
      }
    });
  })
  .catch((error) => {
    if (error.code === '28P01') {
      console.error('PostgreSQL authentication failed. Check DATABASE_URL in backend/.env or reset the postgres password.');
    }

    if (error.code === '3D000') {
      console.error('PostgreSQL database does not exist. Create the database named in DATABASE_URL first.');
    }

    if (error.code === 'ECONNREFUSED') {
      console.error('PostgreSQL is not running or is not reachable at the host/port from DATABASE_URL.');
    }

    console.error('Failed to start backend:', error);
    process.exit(1);
  });
