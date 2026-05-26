import { useState } from 'react';
import { ShoppingCart, Eye, Star, Heart } from 'lucide-react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { navigate } = useApp();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  return (
    <div
      className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden cursor-pointer hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
      onClick={() => navigate('product', product.id)}
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-gray-800">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              product.badge === 'Nouveau' ? 'bg-green-500 text-white' :
              product.badge === 'Premium' ? 'bg-yellow-500 text-black' :
              product.badge === 'Pack' ? 'bg-cyan-500 text-white' :
              'bg-blue-600 text-white'
            }`}>
              {product.badge}
            </span>
          )}
          {product.discount && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500 text-white">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsWishlisted(!isWishlisted); }}
          className="absolute top-3 right-3 w-8 h-8 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        >
          <Heart
            size={14}
            className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-300'}
          />
        </button>

        {/* Quick view overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <button
            onClick={(e) => { e.stopPropagation(); navigate('product', product.id); }}
            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium py-2 rounded-xl flex items-center justify-center gap-1.5 hover:bg-white/20 transition-colors"
          >
            <Eye size={13} />
            Aperçu rapide
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-400 text-xs mb-1 capitalize">{product.category}</p>
        <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 mb-2 group-hover:text-blue-300 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={11}
                className={i < Math.floor(product.rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-600'}
              />
            ))}
          </div>
          <span className="text-gray-500 text-xs">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-white font-bold text-lg">{product.price} <span className="text-sm font-medium text-blue-400">TND</span></span>
          {product.originalPrice && (
            <span className="text-gray-600 text-sm line-through">{product.originalPrice} TND</span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
            addedFeedback
              ? 'bg-green-600 text-white scale-95'
              : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/25'
          }`}
        >
          <ShoppingCart size={15} />
          {addedFeedback ? 'Ajouté !' : 'Ajouter au panier'}
        </button>
      </div>
    </div>
  );
}
