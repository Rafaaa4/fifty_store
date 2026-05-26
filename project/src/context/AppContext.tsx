import { createContext, useContext, useState, ReactNode } from 'react';

type Page = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'contact' | 'repair' | 'account' | 'login' | 'signup';

interface AppContextType {
  currentPage: Page;
  navigate: (page: Page, productId?: number) => void;
  selectedProductId: number | null;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const navigate = (page: Page, productId?: number) => {
    setCurrentPage(page);
    if (productId !== undefined) setSelectedProductId(productId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider value={{ currentPage, navigate, selectedProductId }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
