import { Plus, Minus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { navigate } = useApp();

  const deliveryFee = items.length > 0 ? 8 : 0;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 pt-20 flex items-center justify-center">
        <div className="text-center max-w-sm mx-auto px-4">
          <div className="w-24 h-24 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={36} className="text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Votre panier est vide</h2>
          <p className="text-gray-400 mb-8">Explorez notre boutique et ajoutez des produits à votre panier.</p>
          <button
            onClick={() => navigate('shop')}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-colors flex items-center gap-2 mx-auto"
          >
            <ShoppingBag size={18} />
            Voir la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('shop')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white">Mon Panier</h1>
            <p className="text-gray-400 text-sm">{items.length} article{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.product.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex gap-5">
                <button onClick={() => navigate('product', item.product.id)} className="flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl hover:opacity-90 transition-opacity"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <button
                      onClick={() => navigate('product', item.product.id)}
                      className="text-white font-semibold text-sm sm:text-base leading-snug hover:text-blue-300 transition-colors text-left line-clamp-2"
                    >
                      {item.product.name}
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-blue-400 font-bold mt-2">{item.product.price} TND</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 text-gray-400 hover:text-white flex items-center justify-center hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-white font-bold w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 text-gray-400 hover:text-white flex items-center justify-center hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-white font-bold">{(item.product.price * item.quantity).toLocaleString()} TND</span>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-gray-500 hover:text-red-400 text-sm flex items-center gap-2 transition-colors"
            >
              <Trash2 size={14} />
              Vider le panier
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sticky top-24">
              <h2 className="text-white font-bold text-lg mb-6">Récapitulatif</h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Sous-total ({items.reduce((s, i) => s + i.quantity, 0)} articles)</span>
                  <span className="text-white">{totalPrice.toLocaleString()} TND</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Livraison</span>
                  <span className="text-green-400">~{deliveryFee} TND</span>
                </div>
                <div className="h-px bg-gray-800 my-2" />
                <div className="flex justify-between font-bold text-base">
                  <span className="text-gray-300">Total estimé</span>
                  <span className="text-white">{(totalPrice + deliveryFee).toLocaleString()} TND</span>
                </div>
              </div>
              <button
                onClick={() => navigate('checkout')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 group mb-3"
              >
                Commander maintenant
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-gray-500 text-xs text-center">Cash on Delivery disponible 🇹🇳</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
