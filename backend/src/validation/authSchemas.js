import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email().max(160).transform((email) => email.toLowerCase()),
  password: z.string().min(8).max(200),
});
