import { Router } from 'express';
import { optionalCustomer } from '../middleware/authenticateCustomer.js';
import { createContactMessage } from '../services/contactService.js';
import { contactMessageSchema } from '../validation/contactSchemas.js';

export const contactRouter = Router();

contactRouter.post('/', optionalCustomer, async (req, res) => {
  const parsed = contactMessageSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Please check your message details' });
  }

  const message = await createContactMessage(parsed.data, req.customer?.id);
  return res.status(201).json({ message });
});
