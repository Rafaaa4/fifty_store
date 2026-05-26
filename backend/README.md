# Fifty Store Backend

Express + PostgreSQL API for orders and the admin dashboard.

## Setup

1. Copy env values:

```bash
cp .env.example .env
```

2. Edit `.env` and set a strong `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
   Keep `FRONTEND_ORIGIN=http://localhost:5173` and `ADMIN_ORIGIN=http://localhost:5174` for local development.

3. Start PostgreSQL, either with Docker:

```bash
docker compose up -d
```

Or use your local PostgreSQL and update `DATABASE_URL`.

4. Start the API:

```bash
npm run dev
```

The server creates the tables automatically and seeds the first admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD` if that email does not already exist.

## API

- `POST /api/orders` creates a customer order.
- `POST /api/auth/login` logs in an admin.
- `GET /api/admin/orders` lists orders for the dashboard.
- `PATCH /api/admin/orders/:id/status` updates order status.

The standalone dashboard lives in `../admin`.

## Structure

- `src/config`: environment and PostgreSQL pool.
- `src/db`: migrations and startup database setup.
- `src/middleware`: auth, id parsing, and error handling.
- `src/routes`: API route definitions.
- `src/services`: database/business logic.
- `src/validation`: request validation schemas.
