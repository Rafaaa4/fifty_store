import { z } from 'zod';
import { orderStatuses } from '../constants/orderStatuses.js';

export const orderSchema = z.object({
  customer: z.object({
    fullName: z.string().trim().min(2).max(120),
    phone: z.string().trim().min(8).max(30).regex(/^[+0-9 ()-]+$/),
    address: z.string().trim().min(5).max(240),
    city: z.string().trim().min(2).max(80),
    notes: z.string().trim().max(500).optional().default(''),
  }),
  items: z.array(z.object({
    productId: z.coerce.number().int().positive(),
    name: z.string().trim().min(1).max(180),
    price: z.coerce.number().nonnegative().max(100000),
    quantity: z.coerce.number().int().min(1).max(99),
    image: z.string().trim().url().max(1000).optional().or(z.literal('')),
  })).min(1).max(100),
  deliveryFee: z.coerce.number().nonnegative().max(1000).default(0),
  paymentMethod: z.enum(['cash_on_delivery']).default('cash_on_delivery'),
});

export const statusSchema = z.object({
  status: z.enum(orderStatuses),
});
