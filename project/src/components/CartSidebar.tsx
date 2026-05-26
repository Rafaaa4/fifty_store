import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';

export default function CartSidebar() {
  const { items, removeFromCart, updateQuantity, totalPrice, totalItems, isCartOpen, setIsCartOpen } = useCart();
  const { navigate } = useApp();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className={`fixed right-0 top-0 bottom-0 w-full max-w-md bg-gray-950 border-l border-gray-800 z-50 flex flex-col transition-transform duration-300 ${
        isCartOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShoppingBag size={16} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">Mon Panier</h2>
              <p className="text-gray-400 text-xs">{totalItems} article{totalItems !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag size={32} className="text-gray-600" />
              </div>
              <p className="text-gray-400 font-medium">Votre panier est vide</p>
              <p className="text-gray-600 text-sm mt-1">Ajoutez des produits pour commencer</p>
              <button
                onClick={() => { navigate('shop'); setIsCartOpen(false); }}
                className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors"
              >
                Voir la boutique
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="flex gap-4 bg-gray-900 rounded-2xl p-4 group">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold line-clamp-2 leading-snug">{item.product.name}</p>
                  <p className="text-blue-400 text-sm font-bold mt-1">{item.product.price} TND</p>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-white text-sm font-bold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="ml-auto p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Sous-total</span>
              <span className="text-white font-bold text-lg">{totalPrice.toLocaleString()} TND</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Livraison</span>
              <span className="text-green-400 font-medium">Calculée à la commande</span>
            </div>
            <button
              onClick={() => { navigate('checkout'); setIsCartOpen(false); }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              Commander maintenant
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => { navigate('cart'); setIsCartOpen(false); }}
              className="w-full border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-medium py-3 rounded-2xl transition-colors text-sm"
            >
              Voir le panier complet
            </button>
          </div>
        )}
      </div>
    </>
  );
}
