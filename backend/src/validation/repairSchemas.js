import { z } from 'zod';
import { repairDeliveryModes, repairServiceTypes, repairStatuses } from '../constants/repairStatuses.js';

export const repairRequestSchema = z.object({
  serviceType: z.enum(repairServiceTypes),
  deviceBrand: z.string().trim().min(2).max(80),
  deviceModel: z.string().trim().min(1).max(120),
  issueDescription: z.string().trim().min(5).max(1000),
  deliveryMode: z.enum(repairDeliveryModes),
  preferredDate: z.string().trim().max(40).optional().or(z.literal('')),
  preferredTime: z.string().trim().max(40).optional().or(z.literal('')),
  customer: z.object({
    fullName: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(8).max(30).regex(/^[+0-9 ()-]+$/),
    city: z.string().trim().min(2).max(80),
    address: z.string().trim().min(3).max(240),
    notes: z.string().trim().max(500).optional().default(''),
  }),
});

export const repairStatusSchema = z.object({
  status: z.enum(repairStatuses),
  adminNotes: z.string().trim().max(1000).optional().default(''),
});
