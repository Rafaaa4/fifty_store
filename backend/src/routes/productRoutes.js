import { Router } from 'express';
import { listProducts } from '../services/productService.js';

export const productRouter = Router();

productRouter.get('/', async (_req, res) => {
  const products = await listProducts();
  res.json({ products });
});
