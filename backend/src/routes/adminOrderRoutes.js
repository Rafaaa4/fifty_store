import { Router } from 'express';
import { parseOrderId } from '../middleware/parseId.js';
import { listOrders, updateOrderStatus } from '../services/orderService.js';
import { statusSchema } from '../validation/orderSchemas.js';

export const adminOrderRouter = Router();

adminOrderRouter.get('/', async (req, res) => {
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const orders = await listOrders(status);

  return res.json({ orders });
});

adminOrderRouter.patch('/:id/status', parseOrderId, async (req, res) => {
  const parsed = statusSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const order = await updateOrderStatus(req.orderId, parsed.data.status);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  return res.json({ order });
});
