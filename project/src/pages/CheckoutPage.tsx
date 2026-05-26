import { useState } from 'react';
import { MessageCircle, Check, Truck, CreditCard, Package, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';
import { createOrder } from '../lib/api';

interface FormData {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { navigate } = useApp();
  const [form, setForm] = useState<FormData>({
    fullName: '', phone: '', address: '', city: '', notes: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const deliveryFee = items.length > 0 ? 8 : 0;
  const total = totalPrice + deliveryFee;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const buildWhatsAppMessage = () => {
    const productLines = items.map(item =>
      `• ${item.product.name} x${item.quantity} — ${item.product.price * item.quantity} TND`
    ).join('\n');

    return encodeURIComponent(
      `🛒 *Nouvelle commande — Fifty Store*\n\n` +
      `👤 *Client :* ${form.fullName}\n` +
      `📞 *Téléphone :* ${form.phone}\n` +
      `📍 *Adresse :* ${form.address}\n` +
      `🏙️ *Ville :* ${form.city}\n` +
      (form.notes ? `📝 *Notes :* ${form.notes}\n` : '') +
      `\n🛍️ *Produits commandés :*\n${productLines}\n\n` +
      `📦 *Livraison :* ~${deliveryFee} TND\n` +
      `💰 *Total :* ${total} TND\n\n` +
      `💵 *Paiement :* Cash on Delivery\n\n` +
      `Merci Fifty Store ! 🙏`
    );
  };

  const submitOrder = async () => {
    if (!form.fullName || !form.phone || !form.address || !form.city) {
      throw new Error('Veuillez remplir tous les champs obligatoires.');
    }

    const data = await createOrder(form, items, deliveryFee);
    setOrderId(data.order.id);
    setOrderPlaced(true);
    clearCart();
    return data.order;
  };

  const handleWhatsAppOrder = async () => {
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await submitOrder();
      const msg = buildWhatsAppMessage();
      window.open(`https://wa.me/21699400090?text=${msg}`, '_blank');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Impossible de confirmer la commande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);
    try {
      await submitOrder();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Impossible de confirmer la commande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-950 pt-20 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <Check size={40} className="text-green-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Commande confirmée !</h2>
          <p className="text-gray-400 text-lg mb-3">
            Merci <span className="text-white font-semibold">{form.fullName || 'cher client'}</span> !
          </p>
          <p className="text-gray-400 mb-8">
            Votre commande a été transmise. Notre équipe vous contactera très prochainement au{' '}
            <span className="text-white font-semibold">{form.phone || 'numéro indiqué'}</span> pour confirmer la livraison.
          </p>
          {orderId && (
            <p className="text-blue-300 font-bold mb-8">Référence commande #{orderId}</p>
          )}
          <div className="space-y-3">
            <button
              onClick={() => navigate('home')}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-colors"
            >
              Retour à l'accueil
            </button>
            <button
              onClick={() => navigate('shop')}
              className="w-full py-4 border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-medium rounded-2xl transition-colors"
            >
              Continuer mes achats
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 pt-20 flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Votre panier est vide.</p>
          <button onClick={() => navigate('shop')} className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-500 transition-colors">
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
          <button onClick={() => navigate('cart')} className="text-gray-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-white">Finaliser la commande</h1>
            <p className="text-gray-400 text-sm">Remplissez vos informations de livraison</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleFormOrder} className="space-y-6">
              {/* Delivery info */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                  <Truck size={20} className="text-blue-400" />
                  Informations de livraison
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">
                      Nom complet <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      required
                      placeholder="Ex: Mohamed Ben Ali"
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Téléphone <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      placeholder="+216 XX XXX XXX"
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">
                      Ville <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm appearance-none"
                    >
                      <option value="">Sélectionner une ville</option>
                      {['Tunis', 'Sfax', 'Sousse', 'Bizerte', 'Monastir', 'Nabeul', 'Gabès', 'Ariana', 'Ben Arous', 'Manouba', 'Gafsa', 'Kasserine', 'Kairouan', 'Béja', 'Jendouba', 'Le Kef', 'Siliana', 'Mahdia', 'Sidi Bouzid', 'Médenine', 'Tataouine', 'Tozeur', 'Kébili', 'Zaghouan'].map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">
                      Adresse complète <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      placeholder="Rue, numéro, quartier..."
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm placeholder-gray-600"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">Notes supplémentaires</label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Instructions de livraison, étage, code d'accès..."
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm placeholder-gray-600 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment method */}
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <CreditCard size={20} className="text-blue-400" />
                  Mode de paiement
                </h2>
                <div className="flex items-center gap-4 p-4 bg-green-600/10 border border-green-500/30 rounded-xl">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Cash on Delivery</p>
                    <p className="text-gray-400 text-xs">Payez en espèces à la réception de votre commande</p>
                  </div>
                </div>
              </div>

              {/* Submit buttons */}
              <div className="space-y-3">
                {submitError && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {submitError}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  disabled={isSubmitting}
                  className="w-full py-5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-3 text-lg hover:scale-[1.02] shadow-lg shadow-green-500/20"
                >
                  <MessageCircle size={22} />
                  {isSubmitting ? 'Confirmation...' : 'Commander via WhatsApp'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  <Package size={18} />
                  {isSubmitting ? 'Envoi...' : 'Confirmer la commande'}
                </button>
              </div>
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sticky top-24">
              <h2 className="text-white font-bold text-lg mb-5">Votre commande</h2>
              <div className="space-y-4 mb-6">
                {items.map(item => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-xl"
                      />
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-semibold line-clamp-2">{item.product.name}</p>
                      <p className="text-blue-400 text-sm font-bold mt-1">{(item.product.price * item.quantity).toLocaleString()} TND</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-800 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Sous-total</span>
                  <span className="text-white">{totalPrice.toLocaleString()} TND</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Livraison</span>
                  <span className="text-green-400">~{deliveryFee} TND</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-800">
                  <span className="text-gray-300">Total</span>
                  <span className="text-white">{total.toLocaleString()} TND</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
