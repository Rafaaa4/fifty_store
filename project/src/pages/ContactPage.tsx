import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Instagram, Facebook, Youtube } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { sendContactMessage } from '../lib/api';

export default function ContactPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: '',
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await sendContactMessage(form);
      setSent(true);
      setForm({ name: user?.fullName || '', email: user?.email || '', phone: user?.phone || '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible d’envoyer le message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Support</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">Contactez-nous</h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Notre équipe est disponible pour répondre à toutes vos questions et vous aider dans vos achats.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-8">Nos coordonnées</h2>

            {/* WhatsApp CTA — Primary */}
            <a
              href="https://wa.me/21699400090?text=Bonjour%20Fifty%20Store%20!"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-5 p-6 bg-green-600/10 border border-green-500/30 hover:border-green-500/60 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="w-14 h-14 bg-green-600/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-600/30 transition-colors">
                <MessageCircle size={26} className="text-green-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">WhatsApp</p>
                <p className="text-green-400 font-semibold">+216 99 400 090</p>
                <p className="text-gray-500 text-sm mt-0.5">Réponse en quelques minutes</p>
              </div>
            </a>

            {/* Phone */}
            <a
              href="tel:+21699400090"
              className="group flex items-center gap-5 p-6 bg-gray-900 border border-gray-800 hover:border-blue-500/40 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Phone size={24} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Téléphone</p>
                <p className="text-blue-400 font-semibold">+216 99 400 090</p>
                <p className="text-gray-500 text-sm mt-0.5">Appel direct</p>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:contact@fiftystore.tn"
              className="group flex items-center gap-5 p-6 bg-gray-900 border border-gray-800 hover:border-blue-500/40 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Mail size={24} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Email</p>
                <p className="text-cyan-400 font-semibold">contact@fiftystore.tn</p>
                <p className="text-gray-500 text-sm mt-0.5">Réponse sous 24h</p>
              </div>
            </a>

            {/* Location */}
            <div className="flex items-center gap-5 p-6 bg-gray-900 border border-gray-800 rounded-2xl">
              <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <MapPin size={24} className="text-orange-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Localisation</p>
                <p className="text-orange-400 font-semibold">🇹🇳 Tunisie</p>
                <p className="text-gray-500 text-sm mt-0.5">Livraison sur toute la Tunisie</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-center gap-5 p-6 bg-gray-900 border border-gray-800 rounded-2xl">
              <div className="w-14 h-14 bg-yellow-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Clock size={24} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Horaires</p>
                <p className="text-yellow-400 font-semibold">8h00 — 22h00</p>
                <p className="text-gray-500 text-sm mt-0.5">7 jours sur 7</p>
              </div>
            </div>

            {/* Social media */}
            <div className="pt-4">
              <p className="text-gray-400 text-sm mb-4">Suivez-nous sur les réseaux sociaux</p>
              <div className="flex gap-3">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-900 border border-gray-800 hover:bg-blue-600 hover:border-blue-600 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <Facebook size={20} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-900 border border-gray-800 hover:bg-pink-600 hover:border-pink-600 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <Instagram size={20} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-900 border border-gray-800 hover:bg-red-600 hover:border-red-600 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <Youtube size={20} />
                </a>
                <a href="https://wa.me/21699400090" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-gray-900 border border-gray-800 hover:bg-green-600 hover:border-green-600 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-8">Envoyez un message</h2>
            {sent ? (
              <div className="bg-green-600/10 border border-green-500/30 rounded-2xl p-10 text-center">
                <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={28} className="text-green-400" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">Message envoyé !</h3>
                <p className="text-gray-400">Votre message a été transmis à notre équipe. Nous vous répondrons très rapidement.</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors text-sm"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-8 space-y-5">
                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Nom complet <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Votre nom"
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm placeholder-gray-600"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="votre@email.com"
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm placeholder-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Téléphone <span className="text-red-400">*</span></label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+216 XX XXX XXX"
                      className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm placeholder-gray-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Message <span className="text-red-400">*</span></label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm placeholder-gray-600 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {isSubmitting ? 'Envoi...' : 'Envoyer le message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
