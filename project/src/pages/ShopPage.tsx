import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const result = products.filter(p => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchCat && matchSearch && matchPrice;
    });

    switch (sortBy) {
      case 'price-asc': return result.sort((a, b) => a.price - b.price);
      case 'price-desc': return result.sort((a, b) => b.price - a.price);
      case 'rating': return result.sort((a, b) => b.rating - a.rating);
      case 'discount': return result.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      default: return result;
    }
  }, [selectedCategory, searchQuery, sortBy, priceRange]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('default');
    setPriceRange([0, 5000]);
  };

  const hasActiveFilters = selectedCategory !== 'all' || searchQuery || sortBy !== 'default' || priceRange[0] > 0 || priceRange[1] < 5000;

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <h1 className="text-4xl font-black text-white">Notre Boutique</h1>
          <p className="text-gray-400 mt-2">Découvrez notre sélection de produits tech premium</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters — Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">Catégories</h3>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <span className="mr-2">{cat.icon}</span>{cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-white font-bold mb-4">Prix (TND)</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={e => setPriceRange([+e.target.value, priceRange[1]])}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-xl text-sm outline-none focus:border-blue-500"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">—</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-xl text-sm outline-none focus:border-blue-500"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="w-full py-3 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <X size={14} />
                  Effacer les filtres
                </button>
              )}
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Top bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Search */}
              <div className="flex-1 min-w-48 flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 focus-within:border-blue-500 transition-colors">
                <Search size={16} className="text-gray-500 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent text-white text-sm outline-none placeholder-gray-500 w-full"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="text-gray-500 hover:text-white">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-900 border border-gray-800 text-gray-300 text-sm px-4 py-2.5 pr-8 rounded-xl outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="default">Trier par défaut</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="rating">Mieux notés</option>
                  <option value="discount">Plus de remise</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 bg-gray-900 border border-gray-800 text-gray-300 text-sm px-4 py-2.5 rounded-xl hover:border-gray-700 transition-colors"
              >
                <SlidersHorizontal size={16} />
                Filtres
              </button>
            </div>

            {/* Mobile filters panel */}
            {showFilters && (
              <div className="lg:hidden bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6">
                <h3 className="text-white font-bold mb-3 text-sm">Catégories</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                    <X size={12} />Effacer les filtres
                  </button>
                )}
              </div>
            )}

            {/* Category pills — Desktop top */}
            <div className="hidden lg:flex flex-wrap gap-2 mb-6">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                  }`}
                >
                  <span className="mr-1.5">{cat.icon}</span>{cat.name}
                </button>
              ))}
            </div>

            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-400 text-sm">
                <span className="text-white font-semibold">{filtered.length}</span> produit{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  <X size={12} /> Effacer
                </button>
              )}
            </div>

            {/* Products grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={24} className="text-gray-600" />
                </div>
                <p className="text-gray-400 font-medium">Aucun produit trouvé</p>
                <p className="text-gray-600 text-sm mt-1">Essayez d'autres termes ou filtres</p>
                <button onClick={clearFilters} className="mt-4 text-blue-400 text-sm hover:text-blue-300">
                  Effacer tous les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
