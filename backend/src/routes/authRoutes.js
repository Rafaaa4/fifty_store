import { Router } from 'express';
import { loginAdmin } from '../services/authService.js';
import { loginSchema } from '../validation/authSchemas.js';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const session = await loginAdmin(parsed.data);

  if (!session) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.json(session);
});
