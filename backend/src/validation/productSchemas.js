import { z } from 'zod';

const boolFromForm = z.preprocess((value) => value === true || value === 'true' || value === 'on', z.boolean());

export const productSchema = z.object({
  name: z.string().trim().min(2).max(180),
  category: z.string().trim().min(2).max(80),
  price: z.coerce.number().nonnegative().max(100000),
  originalPrice: z.coerce.number().nonnegative().max(100000).optional().or(z.literal('').transform(() => undefined)),
  discount: z.coerce.number().int().min(0).max(95).optional().or(z.literal('').transform(() => undefined)),
  rating: z.coerce.number().min(0).max(5).default(5),
  reviews: z.coerce.number().int().min(0).default(0),
  description: z.string().trim().min(5).max(2000),
  features: z.string().trim().optional().default(''),
  badge: z.string().trim().max(40).optional().or(z.literal('')),
  inStock: boolFromForm.default(true),
  isNew: boolFromForm.default(false),
  isBestSeller: boolFromForm.default(false),
});
