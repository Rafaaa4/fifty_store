import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { env } from '../config/env.js';

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

  if (!customer || !(await bcrypt.compare(password, customer.password_hash))) {
    return null;
  }

  return { token: signCustomer(customer), user: publicCustomer(customer) };
}
