const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'fifty_admin_token';

export type OrderStatus = 'pending' | 'confirmed' | 'delivering' | 'completed' | 'cancelled';

export interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
  status: OrderStatus;
  payment_method: string;
  subtotal: string;
  delivery_fee: string;
  total: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export function getAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function loginAdmin(email: string, password: string) {
  const data = await request<{ token: string; admin: { email: string } }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem(TOKEN_KEY, data.token);
  return data.admin;
}

export async function fetchAdminOrders(status?: OrderStatus | 'all') {
  const query = status && status !== 'all' ? `?status=${status}` : '';
  return request<{ orders: Order[] }>(`/admin/orders${query}`);
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  return request<{ order: Order }>(`/admin/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
