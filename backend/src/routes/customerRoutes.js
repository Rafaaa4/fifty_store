import { Router } from 'express';
import { authenticateCustomer } from '../middleware/authenticateCustomer.js';
import { loginCustomer, signupCustomer } from '../services/customerService.js';
import { listCustomerOrders } from '../services/orderService.js';
import { customerLoginSchema, customerSignupSchema } from '../validation/customerSchemas.js';

export const customerRouter = Router();

customerRouter.post('/signup', async (req, res) => {
  const parsed = customerSignupSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Please check your signup details' });
  }

  const session = await signupCustomer(parsed.data);

  if (!session) {
    return res.status(409).json({ message: 'An account already exists with this email' });
  }

  return res.status(201).json(session);
});

customerRouter.post('/login', async (req, res) => {
  const parsed = customerLoginSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const session = await loginCustomer(parsed.data);

  if (!session) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  return res.json(session);
});

customerRouter.get('/me', authenticateCustomer, (req, res) => {
  res.json({ user: req.customer });
});

customerRouter.get('/orders', authenticateCustomer, async (req, res) => {
  const orders = await listCustomerOrders(req.customer.id);
  res.json({ orders });
});
