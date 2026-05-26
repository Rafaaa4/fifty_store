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
    console.error('Failed to start backend:', error);
    process.exit(1);
  });
