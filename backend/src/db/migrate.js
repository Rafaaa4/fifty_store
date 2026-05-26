import { pool } from '../config/db.js';
import { seedAdmin } from '../services/authService.js';

export async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'confirmed', 'delivering', 'completed', 'cancelled')),
      payment_method TEXT NOT NULL DEFAULT 'cash_on_delivery',
      subtotal NUMERIC(12, 2) NOT NULL,
      delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
      total NUMERIC(12, 2) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,
      price NUMERIC(12, 2) NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      image TEXT NOT NULL DEFAULT ''
    );

    CREATE INDEX IF NOT EXISTS orders_status_created_idx ON orders(status, created_at DESC);
    CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);
  `);

  await seedAdmin();
}
