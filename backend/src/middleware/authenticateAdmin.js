import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { findAdminById } from '../services/authService.js';

export async function authenticateAdmin(req, res, next) {
  const header = req.get('authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const admin = await findAdminById(payload.sub);

    if (!admin) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    req.admin = admin;
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired session' });
  }
}
