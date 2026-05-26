import { pool } from '../config/db.js';

export async function createRepairRequest(data, customerId) {
  const { rows } = await pool.query(`
    INSERT INTO repair_requests (
      customer_id, service_type, device_brand, device_model, issue_description,
      delivery_mode, preferred_date, preferred_time, customer_name, phone, city,
      address, notes
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING *
  `, [
    customerId || null,
    data.serviceType,
    data.deviceBrand,
    data.deviceModel,
    data.issueDescription,
    data.deliveryMode,
    data.preferredDate || null,
    data.preferredTime || null,
    data.customer.fullName,
    data.customer.phone,
    data.customer.city,
    data.customer.address,
    data.customer.notes || '',
  ]);

  return rows[0];
}

export async function listRepairRequests(status) {
  const values = [];
  let where = '';

  if (status) {
    values.push(status);
    where = 'WHERE rr.status = $1';
  }

  const { rows } = await pool.query(`
    SELECT
      rr.*,
      c.full_name AS account_name,
      c.email AS account_email
    FROM repair_requests rr
    LEFT JOIN customers c ON c.id = rr.customer_id
    ${where}
    ORDER BY rr.created_at DESC
    LIMIT 300
  `, values);

  return rows;
}

export async function listCustomerRepairRequests(customerId) {
  const { rows } = await pool.query(`
    SELECT *
    FROM repair_requests
    WHERE customer_id = $1
    ORDER BY created_at DESC
    LIMIT 100
  `, [customerId]);

  return rows;
}

export async function updateRepairStatus(id, status, adminNotes) {
  const { rows } = await pool.query(`
    UPDATE repair_requests
    SET status = $1, admin_notes = $2, updated_at = NOW()
    WHERE id = $3
    RETURNING *
  `, [status, adminNotes || '', id]);

  return rows[0] || null;
}
