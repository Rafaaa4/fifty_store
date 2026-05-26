const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'fifty_admin_token';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

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

export interface ContactMessage {
  id: number;
  customer_id: number | null;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'read';
  created_at: string;
  customer_full_name: string | null;
  customer_email: string | null;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  features: string[];
  badge?: string;
  inStock: boolean;
  isNew: boolean;
  isBestSeller: boolean;
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

export async function fetchAdminContacts() {
  return request<{ messages: ContactMessage[] }>('/admin/contacts');
}

export async function markContactRead(id: number) {
  return request<{ message: ContactMessage }>(`/admin/contacts/${id}/read`, {
    method: 'PATCH',
    body: JSON.stringify({}),
  });
}

function normalizeProduct(product: Product) {
  return {
    ...product,
    image: product.image.startsWith('/uploads') ? `${API_ORIGIN}${product.image}` : product.image,
  };
}

export async function fetchAdminProducts() {
  const data = await request<{ products: Product[] }>('/admin/products');
  return { products: data.products.map(normalizeProduct) };
}

export async function createAdminProduct(formData: FormData) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = new Headers();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}/admin/products`, {
    method: 'POST',
    headers,
    body: formData,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Product upload failed');
  }

  return { product: normalizeProduct(data.product) };
}

export async function deleteAdminProduct(id: number) {
  return request<{ product: Product }>(`/admin/products/${id}`, { method: 'DELETE' });
}
