import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Product } from '../data/products';
import { fetchProducts } from '../lib/api';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  error: string;
  reloadProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const reloadProducts = async () => {
    setError('');
    setIsLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger les produits.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reloadProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, isLoading, error, reloadProducts }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within ProductProvider');
  return ctx;
}
