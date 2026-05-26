import { Router } from 'express';
import { parseOrderId } from '../middleware/parseId.js';
import { listRepairRequests, updateRepairStatus } from '../services/repairService.js';
import { repairStatuses } from '../constants/repairStatuses.js';
import { repairStatusSchema } from '../validation/repairSchemas.js';

export const adminRepairRouter = Router();

adminRepairRouter.get('/', async (req, res) => {
  const status = typeof req.query.status === 'string' && repairStatuses.includes(req.query.status)
    ? req.query.status
    : undefined;
  const repairs = await listRepairRequests(status);
  res.json({ repairs });
});

adminRepairRouter.patch('/:id/status', parseOrderId, async (req, res) => {
  const parsed = repairStatusSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid repair status' });
  }

  const repair = await updateRepairStatus(req.orderId, parsed.data.status, parsed.data.adminNotes);

  if (!repair) {
    return res.status(404).json({ message: 'Repair request not found' });
  }

  return res.json({ repair });
});
