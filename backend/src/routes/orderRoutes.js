import { Router } from 'express';
import { createOrder } from '../services/orderService.js';
import { orderSchema } from '../validation/orderSchemas.js';

export const orderRouter = Router();

orderRouter.post('/', async (req, res) => {
  const parsed = orderSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Please check the order details',
      errors: parsed.error.flatten(),
    });
  }

  const order = await createOrder(parsed.data);
  return res.status(201).json({ order });
});
