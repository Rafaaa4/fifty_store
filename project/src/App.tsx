import { AppProvider, useApp } from './context/AppContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';

function PageRouter() {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'home': return <HomePage />;
    case 'shop': return <ShopPage />;
    case 'product': return <ProductDetailPage />;
    case 'cart': return <CartPage />;
    case 'checkout': return <CheckoutPage />;
    case 'contact': return <ContactPage />;
    default: return <HomePage />;
  }
}

function AppLayout() {
  const { currentPage } = useApp();

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar />
      <CartSidebar />
      <main className="flex-1">
        <PageRouter />
      </main>
      {currentPage !== 'checkout' && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <CartProvider>
        <AppLayout />
      </CartProvider>
    </AppProvider>
  );
}
