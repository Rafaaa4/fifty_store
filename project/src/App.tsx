import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import AccountPage from './pages/AccountPage';
import Login from './pages/Login';
import Signup from './pages/Signup';

function PageRouter() {
  const { currentPage } = useApp();

  switch (currentPage) {
    case 'home': return <HomePage />;
    case 'shop': return <ShopPage />;
    case 'product': return <ProductDetailPage />;
    case 'cart': return <CartPage />;
    case 'checkout': return <CheckoutPage />;
    case 'contact': return <ContactPage />;
    case 'account': return <AccountPage />;
    case 'login': return <Login />;
    case 'signup': return <Signup />;
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
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <AppLayout />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </AppProvider>
  );
}
