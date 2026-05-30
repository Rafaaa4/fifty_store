import type { CartItem } from '../context/CartContext';
import { request } from '../lib/api';

interface CreateOrderPayload {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  deliveryMethod: string;
}

export async function createBackendOrder(payload: CreateOrderPayload): Promise<boolean> {
  try {
    await request('/orders', {
      method: 'POST',
      body: JSON.stringify({
        customer: {
          fullName: payload.fullName,
          phone: payload.phone,
          address: payload.address,
          city: payload.city,
          notes: payload.notes || '',
        },
        deliveryFee: Math.max(0, payload.total - payload.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)),
        paymentMethod: payload.paymentMethod || 'cash_on_delivery',
        items: payload.items.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        })),
      }),
    });
    return true;
  } catch {
    return false;
  }
}
