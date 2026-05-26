import { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, Zap, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { products } from '../data/products';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { navigate } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(products.slice(0, 0));
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim().length > 1) {
      const results = products.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.category.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const navLinks = [
    { label: 'Accueil', page: 'home' as const },
    { label: 'Boutique', page: 'shop' as const },
    { label: 'Contact', page: 'contact' as const },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-950/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-transparent'
    }`}>
      {/* Top bar */}
      <div className="bg-blue-600 text-white text-xs py-1.5 text-center font-medium tracking-wide">
        <span>🇹🇳 Livraison rapide sur toute la Tunisie — Cash on Delivery disponible</span>
        <a href="tel:+21699400090" className="ml-4 hover:text-blue-200 transition-colors inline-flex items-center gap-1">
          <Phone size={10} />+216 99 400 090
        </a>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Fifty<span className="text-blue-400">Store</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => navigate(link.page)}
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* Search + Cart */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative hidden sm:block">
              <div className={`flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 transition-all duration-300 ${
                isSearchOpen ? 'w-56' : 'w-36'
              }`}>
                <Search size={14} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                  onChange={e => handleSearch(e.target.value)}
                  className="bg-transparent text-white text-sm outline-none placeholder-gray-400 w-full"
                />
              </div>
              {searchResults.length > 0 && isSearchOpen && (
                <div className="absolute top-full mt-2 right-0 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
                  {searchResults.map(product => (
                    <button
                      key={product.id}
                      onMouseDown={() => {
                        navigate('product', product.id);
                        setSearchQuery('');
                        setSearchResults([]);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left"
                    >
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-lg" />
                      <div>
                        <p className="text-white text-sm font-medium line-clamp-1">{product.name}</p>
                        <p className="text-blue-400 text-xs font-semibold">{product.price} TND</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white p-1"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-950/98 backdrop-blur-md border-t border-gray-800">
          <div className="px-4 py-4 space-y-1">
            {/* Mobile search */}
            <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2 mb-4">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                className="bg-transparent text-white text-sm outline-none placeholder-gray-400 w-full"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mb-3 space-y-1">
                {searchResults.map(product => (
                  <button
                    key={product.id}
                    onClick={() => {
                      navigate('product', product.id);
                      setIsMenuOpen(false);
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-lg text-left"
                  >
                    <img src={product.image} alt={product.name} className="w-8 h-8 object-cover rounded-lg" />
                    <div>
                      <p className="text-white text-sm">{product.name}</p>
                      <p className="text-blue-400 text-xs">{product.price} TND</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => { navigate(link.page); setIsMenuOpen(false); }}
                className="block w-full text-left px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-colors font-medium"
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => { navigate('checkout'); setIsMenuOpen(false); }}
              className="block w-full text-left px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-colors font-medium"
            >
              Commander
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
