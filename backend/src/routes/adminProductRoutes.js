import { Router } from 'express';
import { parseOrderId } from '../middleware/parseId.js';
import { uploadProductImage } from '../middleware/uploadProductImage.js';
import { createProduct, deleteProduct, listProducts, updateProduct } from '../services/productService.js';
import { productSchema } from '../validation/productSchemas.js';

export const adminProductRouter = Router();

adminProductRouter.get('/', async (_req, res) => {
  const products = await listProducts();
  res.json({ products });
});

adminProductRouter.post('/', uploadProductImage.single('image'), async (req, res) => {
  const parsed = productSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Please check product details' });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'Product image is required' });
  }

  const imageUrl = `/uploads/products/${req.file.filename}`;
  const product = await createProduct(parsed.data, imageUrl);
  return res.status(201).json({ product });
});

adminProductRouter.put('/:id', parseOrderId, uploadProductImage.single('image'), async (req, res) => {
  const parsed = productSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: 'Please check product details' });
  }

  const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;
  const product = await updateProduct(req.orderId, parsed.data, imageUrl);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  return res.json({ product });
});

adminProductRouter.delete('/:id', parseOrderId, async (req, res) => {
  const product = await deleteProduct(req.orderId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  return res.json({ product });
});
