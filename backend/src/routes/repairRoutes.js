import { Router } from 'express';
import { authenticateCustomer, optionalCustomer } from '../middleware/authenticateCustomer.js';
import { createRepairRequest, listCustomerRepairRequests } from '../services/repairService.js';
import { repairRequestSchema } from '../validation/repairSchemas.js';

export const repairRouter = Router();

repairRouter.post('/', optionalCustomer, async (req, res) => {
  const parsed = repairRequestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Please check repair request details' });
  }

  const repair = await createRepairRequest(parsed.data, req.customer?.id);
  return res.status(201).json({ repair });
});

repairRouter.get('/mine', authenticateCustomer, async (req, res) => {
  const repairs = await listCustomerRepairRequests(req.customer.id);
  res.json({ repairs });
});
