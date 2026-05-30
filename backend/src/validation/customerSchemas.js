import { z } from 'zod';

export const customerSignupSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160).transform((email) => email.toLowerCase()),
  phone: z.string().trim().min(8).max(30).regex(/^[+0-9 ()-]+$/),
  password: z.string().min(8).max(200),
});

export const customerLoginSchema = z.object({
  email: z.string().trim().email().max(160).transform((email) => email.toLowerCase()),
  password: z.string().min(8).max(200),
});

export const customerGoogleSchema = z.object({
  credential: z.string().trim().min(20),
});
