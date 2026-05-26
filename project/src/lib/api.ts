import { CartItem } from '../context/CartContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Order {
  id: number;
}

interface OrderForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export async function createOrder(form: OrderForm, items: CartItem[], deliveryFee: number) {
  return request<{ order: Order }>('/orders', {
    method: 'POST',
    body: JSON.stringify({
      customer: form,
      deliveryFee,
      paymentMethod: 'cash_on_delivery',
      items: items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
      })),
    }),
  });
}
