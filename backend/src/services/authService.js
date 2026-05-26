import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';

export async function findAdminById(id) {
  const { rows } = await pool.query(
    'SELECT id, email, role FROM admins WHERE id = $1',
    [id],
  );

  return rows[0] || null;
}

export async function loginAdmin({ email, password }) {
  const { rows } = await pool.query(
    'SELECT id, email, password_hash, role FROM admins WHERE email = $1',
    [email],
  );
  const admin = rows[0];

  if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
    return null;
  }

  const token = jwt.sign(
    { sub: admin.id, email: admin.email, role: admin.role },
    env.jwtSecret,
    { expiresIn: '8h' },
  );

  return {
    token,
    admin: { id: admin.id, email: admin.email, role: admin.role },
  };
}

export async function seedAdmin() {
  if (!env.admin.email || !env.admin.password) {
    return;
  }

  const hash = await bcrypt.hash(env.admin.password, 12);

  await pool.query(
    `INSERT INTO admins (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO NOTHING`,
    [env.admin.email, hash],
  );
}
