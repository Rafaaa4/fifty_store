export function parseOrderId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ message: 'Invalid order id' });
  }

  req.orderId = id;
  return next();
}
