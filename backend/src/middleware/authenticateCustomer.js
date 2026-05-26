import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { findCustomerById } from '../services/customerService.js';

export async function authenticateCustomer(req, res, next) {
  const header = req.get('authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);

    if (payload.role !== 'customer') {
      return res.status(401).json({ message: 'Invalid session' });
    }

    const customer = await findCustomerById(payload.sub);

    if (!customer) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    req.customer = customer;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
}

export async function optionalCustomer(req, _res, next) {
  const header = req.get('authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);

    if (payload.role === 'customer') {
      req.customer = await findCustomerById(payload.sub);
    }
  } catch {
    req.customer = null;
  }

  return next();
}
