import { pool } from '../config/db.js';

export async function createContactMessage({ name, email, phone, message }, customerId) {
  const { rows } = await pool.query(`
    INSERT INTO contact_messages (customer_id, name, email, phone, message)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [customerId || null, name, email || '', phone, message]);

  return rows[0];
}

export async function listContactMessages() {
  const { rows } = await pool.query(`
    SELECT
      cm.*,
      c.full_name AS customer_full_name,
      c.email AS customer_email
    FROM contact_messages cm
    LEFT JOIN customers c ON c.id = cm.customer_id
    ORDER BY cm.created_at DESC
    LIMIT 200
  `);

  return rows;
}

export async function markContactMessageRead(id) {
  const { rows } = await pool.query(`
    UPDATE contact_messages
    SET status = 'read', updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `, [id]);

  return rows[0] || null;
}
