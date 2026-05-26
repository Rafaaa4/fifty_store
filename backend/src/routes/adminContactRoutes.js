import { Router } from 'express';
import { parseOrderId } from '../middleware/parseId.js';
import { listContactMessages, markContactMessageRead } from '../services/contactService.js';

export const adminContactRouter = Router();

adminContactRouter.get('/', async (_req, res) => {
  const messages = await listContactMessages();
  res.json({ messages });
});

adminContactRouter.patch('/:id/read', parseOrderId, async (req, res) => {
  const message = await markContactMessageRead(req.orderId);

  if (!message) {
    return res.status(404).json({ message: 'Contact message not found' });
  }

  return res.json({ message });
});
