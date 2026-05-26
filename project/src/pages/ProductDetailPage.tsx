import { useState } from 'react';
import {
  ShoppingCart, ArrowLeft, Star, Shield, Truck, MessageCircle,
  ChevronLeft, ChevronRight, Check, Package, Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductContext';

export default function ProductDetailPage() {
  const { selectedProductId, navigate } = useApp();
  const { addToCart } = useCart();
  const { products } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const product = products.find(p => p.id === selectedProductId);
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-950 pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Produit non trouvé</p>
          <button onClick={() => navigate('shop')} className="mt-4 text-blue-400 hover:text-blue-300">
            Retour à la boutique
          </button>
        </div>
      </div>
    );
  }

  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const imgs = product.images || [product.image];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour Fifty Store ! 👋\n\nJe souhaite commander :\n\n📦 *${product.name}*\n💰 Prix : ${product.price} TND\n🔢 Quantité : ${quantity}\n💵 Total : ${product.price * quantity} TND\n\nMerci !`
  );

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <button
          onClick={() => navigate('shop')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Retour à la boutique
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-square bg-gray-900 rounded-3xl overflow-hidden border border-gray-800">
              <img
                src={imgs[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                    product.badge === 'Nouveau' ? 'bg-green-500 text-white' :
                    product.badge === 'Premium' ? 'bg-yellow-500 text-black' :
                    'bg-blue-600 text-white'
                  }`}>{product.badge}</span>
                )}
                {product.discount && (
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-red-500 text-white">
                    -{product.discount}%
                  </span>
                )}
              </div>
              {/* Nav arrows */}
              {imgs.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImg(i => (i - 1 + imgs.length) % imgs.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImg(i => (i + 1) % imgs.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gray-900/80 backdrop-blur-sm rounded-xl flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {imgs.length > 1 && (
              <div className="flex gap-3">
                {imgs.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === i ? 'border-blue-500' : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-blue-400 text-sm font-medium capitalize mb-2">{product.category}</p>
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'} />
                ))}
              </div>
              <span className="text-white font-bold">{product.rating}</span>
              <span className="text-gray-500 text-sm">({product.reviews} avis)</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4 py-4 border-y border-gray-800">
              <span className="text-4xl font-black text-white">{product.price} <span className="text-xl text-blue-400 font-semibold">TND</span></span>
              {product.originalPrice && (
                <div className="flex flex-col">
                  <span className="text-gray-500 text-lg line-through">{product.originalPrice} TND</span>
                  <span className="text-red-400 text-sm font-bold">Vous économisez {product.originalPrice - product.price} TND</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed">{product.description}</p>

            {/* Features */}
            <div>
              <h3 className="text-white font-bold mb-3">Caractéristiques</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.features.map(feat => (
                  <div key={feat} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check size={14} className="text-blue-400 flex-shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity & Add to cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">Quantité :</span>
                <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 text-gray-400 hover:text-white flex items-center justify-center hover:bg-gray-700 rounded-lg transition-colors font-bold"
                  >
                    −
                  </button>
                  <span className="text-white font-bold w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 text-gray-400 hover:text-white flex items-center justify-center hover:bg-gray-700 rounded-lg transition-colors font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-500 text-sm">= <span className="text-white font-bold">{(product.price * quantity).toLocaleString()} TND</span></span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                    addedFeedback
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white hover:shadow-lg hover:shadow-blue-500/25'
                  }`}
                >
                  {addedFeedback ? <Check size={18} /> : <ShoppingCart size={18} />}
                  {addedFeedback ? 'Ajouté au panier !' : 'Ajouter au panier'}
                </button>
                <a
                  href={`https://wa.me/21699400090?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/40 text-green-400 transition-colors"
                >
                  <MessageCircle size={18} />
                  Commander via WhatsApp
                </a>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-800">
              {[
                { icon: <Truck size={18} />, text: 'Livraison rapide' },
                { icon: <Shield size={18} />, text: 'Garanti authentique' },
                { icon: <Package size={18} />, text: 'Emballage sécurisé' },
              ].map(badge => (
                <div key={badge.text} className="flex flex-col items-center gap-2 text-center p-3 bg-gray-900 rounded-xl">
                  <span className="text-blue-400">{badge.icon}</span>
                  <span className="text-gray-400 text-xs">{badge.text}</span>
                </div>
              ))}
            </div>

            {/* Delivery info */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <Truck size={18} className="text-blue-400" />
                <div>
                  <p className="text-white text-sm font-semibold">Livraison sur toute la Tunisie 🇹🇳</p>
                  <p className="text-gray-500 text-xs">24 à 72h selon votre région</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-green-400" />
                <div>
                  <p className="text-white text-sm font-semibold">Cash on Delivery disponible</p>
                  <p className="text-gray-500 text-xs">Payez à la réception de votre commande</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-black text-white mb-8">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
