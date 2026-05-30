import { categories as localCategories, products as localProducts, type Category, type Product, type ProductCategory } from '../data/products';
import { request, resolveAssetUrl } from '../lib/api';
import { type SocialMediaItem } from '../data/social';

export type CatalogSource = 'backend' | 'local';

interface BackendProduct {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  image?: string;
  description?: string;
  features?: string[];
  badge?: string;
  inStock?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  createdAt?: string;
}

const validCategories: ProductCategory[] = [
  'iphones',
  'cases',
  'chargers',
  'headphones',
  'smartwatches',
  'powerbanks',
  'speakers',
  'accessories',
];

function normalizeCategory(raw: string | null | undefined): ProductCategory {
  const normalized = (raw || '').toLowerCase().trim();
  if (normalized === 'phones' || normalized === 'smartphones' || normalized === 'iphone' || normalized === 'iphones') return 'iphones';
  if (normalized === 'powerbank') return 'powerbanks';
  if (normalized === 'baffle' || normalized === 'baffles' || normalized === 'speaker') return 'speakers';
  if (validCategories.includes(normalized as ProductCategory)) return normalized as ProductCategory;
  return 'accessories';
}

function mapBackendProduct(row: BackendProduct): Product {
  const image =
    resolveAssetUrl(row.image) ||
    'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1000';
  const specs = Array.isArray(row.features) && row.features.length > 0 ? row.features : [row.badge || 'Produit Fifty Store'];

  return {
    id: Number(row.id),
    name: row.name,
    brand: row.badge || 'Fifty Store',
    category: normalizeCategory(row.category),
    price: Number(row.price) || 0,
    oldPrice: row.originalPrice ? Number(row.originalPrice) : undefined,
    discount: row.discount ? Number(row.discount) : undefined,
    rating: Number(row.rating ?? 4.5),
    reviews: Number(row.reviews ?? 0),
    stock: row.inStock === false ? 0 : 10,
    image,
    images: [image],
    description: row.description || 'Produit premium Fifty Store.',
    specs,
    isNew: Boolean(row.isNew),
    isBestSeller: Boolean(row.isBestSeller),
    createdAt: row.createdAt ? String(row.createdAt).slice(0, 10) : new Date().toISOString().slice(0, 10),
  };
}

function safeLocalProducts(): Product[] {
  return [...localProducts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function fetchCatalogProducts(): Promise<{ products: Product[]; source: CatalogSource }> {
  try {
    const data = await request<{ products: BackendProduct[] }>('/products', {}, 'none');
    const products = data.products.map(mapBackendProduct).filter((product) => Number.isFinite(product.id));
    return products.length > 0 ? { products, source: 'backend' } : { products: safeLocalProducts(), source: 'local' };
  } catch {
    return { products: safeLocalProducts(), source: 'local' };
  }
}

export async function fetchCatalogCategories(): Promise<Category[]> {
  return localCategories;
}

export async function fetchSocialMedia(): Promise<SocialMediaItem[]> {
  return [];
}

export function subscribeToCatalogChanges(_onChange: () => void): () => void {
  return () => undefined;
}
