import { pool } from '../config/db.js';
import { orderStatuses } from '../constants/orderStatuses.js';

const orderSelect = `
  SELECT
    o.*,
    COALESCE(
      json_agg(
        json_build_object(
          'id', oi.id,
          'productId', oi.product_id,
          'name', oi.product_name,
          'price', oi.price::float,
          'quantity', oi.quantity,
          'image', oi.image
        )
        ORDER BY oi.id
      ) FILTER (WHERE oi.id IS NOT NULL),
      '[]'
    ) AS items
  FROM orders o
  LEFT JOIN order_items oi ON oi.order_id = o.id
`;

export async function getOrderById(id) {
  const { rows } = await pool.query(`
    ${orderSelect}
    WHERE o.id = $1
    GROUP BY o.id
  `, [id]);

  return rows[0] || null;
}

export async function createOrder({ customer, items, deliveryFee, paymentMethod }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + deliveryFee;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const { rows } = await client.query(`
      INSERT INTO orders (
        customer_name, phone, address, city, notes, payment_method, subtotal, delivery_fee, total
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `, [
      customer.fullName,
      customer.phone,
      customer.address,
      customer.city,
      customer.notes || '',
      paymentMethod,
      subtotal,
      deliveryFee,
      total,
    ]);

    const orderId = rows[0].id;

    for (const item of items) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, product_name, price, quantity, image)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [orderId, item.productId, item.name, item.price, item.quantity, item.image || '']);
    }

    await client.query('COMMIT');
    return await getOrderById(orderId);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export async function listOrders(status) {
  const values = [];
  let where = '';

  if (status && orderStatuses.includes(status)) {
    values.push(status);
    where = 'WHERE o.status = $1';
  }

  const { rows } = await pool.query(`
    ${orderSelect}
    ${where}
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT 200
  `, values);

  return rows;
}

export async function updateOrderStatus(id, status) {
  const { rows } = await pool.query(`
    UPDATE orders
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id
  `, [status, id]);

  if (!rows[0]) {
    return null;
  }

  return getOrderById(id);
}
