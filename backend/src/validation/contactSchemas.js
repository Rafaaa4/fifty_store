import { z } from 'zod';

export const contactMessageSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160).optional().or(z.literal('')),
  phone: z.string().trim().min(8).max(30).regex(/^[+0-9 ()-]+$/),
  message: z.string().trim().min(5).max(1000),
});
