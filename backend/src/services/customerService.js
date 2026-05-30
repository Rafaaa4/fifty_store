import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';

const googleClient = new OAuth2Client();

function publicCustomer(customer) {
  return {
    id: customer.id,
    fullName: customer.full_name,
    email: customer.email,
    phone: customer.phone,
  };
}

function signCustomer(customer) {
  return jwt.sign(
    { sub: customer.id, email: customer.email, role: 'customer' },
    env.jwtSecret,
    { expiresIn: '14d' },
  );
}

export async function findCustomerById(id) {
  const { rows } = await pool.query(
    'SELECT id, full_name, email, phone FROM customers WHERE id = $1',
    [id],
  );

  return rows[0] ? publicCustomer(rows[0]) : null;
}

export async function signupCustomer({ fullName, email, phone, password }) {
  const hash = await bcrypt.hash(password, 12);

  try {
    const { rows } = await pool.query(`
      INSERT INTO customers (full_name, email, phone, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, phone
    `, [fullName, email, phone, hash]);

    const customer = rows[0];
    return { token: signCustomer(customer), user: publicCustomer(customer) };
  } catch (error) {
    if (error.code === '23505') {
      return null;
    }

    throw error;
  }
}

export async function loginCustomer({ email, password }) {
  const { rows } = await pool.query(
    'SELECT id, full_name, email, phone, password_hash FROM customers WHERE email = $1',
    [email],
  );
  const customer = rows[0];

  if (!customer?.password_hash || !(await bcrypt.compare(password, customer.password_hash))) {
    return null;
  }

  return { token: signCustomer(customer), user: publicCustomer(customer) };
}

export async function loginCustomerWithGoogle(credential) {
  if (!env.google.clientId) {
    throw new Error('Google Sign-In is not configured');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.google.clientId,
  });

  const payload = ticket.getPayload();
  const googleSub = payload?.sub;
  const email = payload?.email?.trim().toLowerCase();
  const emailVerified = payload?.email_verified;
  const fullName = payload?.name?.trim() || email?.split('@')[0] || 'Client Fifty Store';
  const avatarUrl = payload?.picture || null;

  if (!googleSub || !email || !emailVerified) {
    return null;
  }

  const existing = await pool.query(
    'SELECT id, full_name, email, phone FROM customers WHERE google_sub = $1 OR email = $2 LIMIT 1',
    [googleSub, email],
  );

  if (existing.rows[0]) {
    const { rows } = await pool.query(`
      UPDATE customers
      SET
        full_name = COALESCE(NULLIF(full_name, ''), $2),
        google_sub = $3,
        auth_provider = CASE WHEN password_hash IS NULL THEN 'google' ELSE auth_provider END,
        avatar_url = COALESCE($4, avatar_url),
        updated_at = NOW()
      WHERE id = $1
      RETURNING id, full_name, email, phone
    `, [existing.rows[0].id, fullName, googleSub, avatarUrl]);

    const customer = rows[0];
    return { token: signCustomer(customer), user: publicCustomer(customer) };
  }

  const { rows } = await pool.query(`
    INSERT INTO customers (full_name, email, phone, password_hash, google_sub, auth_provider, avatar_url)
    VALUES ($1, $2, '', NULL, $3, 'google', $4)
    RETURNING id, full_name, email, phone
  `, [fullName, email, googleSub, avatarUrl]);

  const customer = rows[0];
  return { token: signCustomer(customer), user: publicCustomer(customer) };
}
