import type { CartItem } from '../context/CartContext';
import type { Product } from '../data/products';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const CUSTOMER_TOKEN_KEY = 'fifty_customer_token';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

export interface Customer {
  id: number;
  fullName: string;
  email: string;
  phone: string;
}

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
  subtotal: string;
  delivery_fee: string;
  total: string;
  created_at: string;
  items: OrderItem[];
}

interface OrderForm {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

export async function request<T>(path: string, options: RequestInit = {}, tokenType: 'customer' | 'none' = 'customer'): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const token = tokenType === 'customer' ? localStorage.getItem(CUSTOMER_TOKEN_KEY) : null;

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

export function getCustomerToken() {
  return localStorage.getItem(CUSTOMER_TOKEN_KEY);
}

export function clearCustomerToken() {
  localStorage.removeItem(CUSTOMER_TOKEN_KEY);
}

function storeCustomerSession(data: { token: string; user: Customer }) {
  localStorage.setItem(CUSTOMER_TOKEN_KEY, data.token);
  return data.user;
}

export async function signupCustomer(form: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) {
  const data = await request<{ token: string; user: Customer }>('/customer/signup', {
    method: 'POST',
    body: JSON.stringify(form),
  });

  return storeCustomerSession(data);
}

export async function loginCustomer(email: string, password: string) {
  const data = await request<{ token: string; user: Customer }>('/customer/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  return storeCustomerSession(data);
}

export async function loginCustomerWithGoogle(credential: string) {
  const data = await request<{ token: string; user: Customer }>('/customer/google', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  }, 'none');

  return storeCustomerSession(data);
}

export async function fetchCurrentCustomer() {
  return request<{ user: Customer }>('/customer/me');
}

export async function fetchMyOrders() {
  return request<{ orders: Order[] }>('/customer/orders');
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

export async function sendContactMessage(form: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  return request<{ message: { id: number } }>('/contact', {
    method: 'POST',
    body: JSON.stringify(form),
  });
}

export async function createRepairRequest(form: {
  serviceType: string;
  deviceBrand: string;
  deviceModel: string;
  issueDescription: string;
  deliveryMode: string;
  preferredDate: string;
  preferredTime: string;
  customer: {
    fullName: string;
    phone: string;
    city: string;
    address: string;
    notes: string;
  };
}) {
  return request<{ repair: { id: number } }>('/repairs', {
    method: 'POST',
    body: JSON.stringify(form),
  });
}

export function resolveAssetUrl(url: string | null | undefined) {
  if (!url) return '';
  return url.startsWith('/uploads') ? `${API_ORIGIN}${url}` : url;
}

export async function fetchProducts() {
  const data = await request<{ products: Product[] }>('/products', {}, 'none');
  return {
    products: data.products.map((product) => {
      const image = resolveAssetUrl(product.image);
      return {
        ...product,
        image,
        images: product.images?.map(resolveAssetUrl) || [image],
      };
    }),
  };
}
