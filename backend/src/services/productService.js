import { pool } from '../config/db.js';

function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    originalPrice: row.original_price === null ? undefined : Number(row.original_price),
    discount: row.discount ?? undefined,
    rating: Number(row.rating),
    reviews: row.reviews,
    image: row.image,
    description: row.description,
    features: row.features || [],
    badge: row.badge || undefined,
    inStock: row.in_stock,
    isNew: row.is_new,
    isBestSeller: row.is_best_seller,
    createdAt: row.created_at,
  };
}

function featureList(features) {
  return features
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function listProducts() {
  const { rows } = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
  return rows.map(mapProduct);
}

export async function createProduct(data, imageUrl) {
  const { rows } = await pool.query(`
    INSERT INTO products (
      name, category, price, original_price, discount, rating, reviews, image,
      description, features, badge, in_stock, is_new, is_best_seller
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11, $12, $13, $14)
    RETURNING *
  `, [
    data.name,
    data.category,
    data.price,
    data.originalPrice ?? null,
    data.discount ?? null,
    data.rating,
    data.reviews,
    imageUrl,
    data.description,
    JSON.stringify(featureList(data.features)),
    data.badge || null,
    data.inStock,
    data.isNew,
    data.isBestSeller,
  ]);

  return mapProduct(rows[0]);
}

export async function deleteProduct(id) {
  const { rows } = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
  return rows[0] ? mapProduct(rows[0]) : null;
}
