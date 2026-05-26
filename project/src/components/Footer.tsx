import { Zap, Phone, Mail, MapPin, Instagram, Facebook, Youtube, MessageCircle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { navigate } = useApp();

  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      {/* Newsletter */}
      <div className="bg-blue-600/10 border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-bold text-2xl">Restez informé</h3>
              <p className="text-gray-400 mt-1">Recevez nos meilleures offres et nouveautés directement par email.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 md:w-72 px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors text-sm"
              />
              <button className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
                S'abonner <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                <Zap size={20} className="text-white" />
              </div>
              <span className="text-white font-bold text-xl">Fifty<span className="text-blue-400">Store</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Votre boutique tech de confiance en Tunisie. Smartphones, accessoires et gadgets au meilleur prix avec livraison rapide.
            </p>
            <p className="text-gray-500 text-xs">Fondé par <span className="text-blue-400 font-medium">Wissem Loueti</span></p>
            <div className="flex items-center gap-3 mt-5">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <Facebook size={16} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-pink-600 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <Instagram size={16} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-red-600 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <Youtube size={16} />
              </a>
              <a href="https://wa.me/21699400090" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-green-600 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold mb-5">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Accueil', page: 'home' as const },
                { label: 'Boutique', page: 'shop' as const },
                { label: 'Mon Panier', page: 'cart' as const },
                { label: 'Commander', page: 'checkout' as const },
                { label: 'Contact', page: 'contact' as const },
              ].map(link => (
                <li key={link.page}>
                  <button
                    onClick={() => navigate(link.page)}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-5">Catégories</h4>
            <ul className="space-y-3">
              {['Smartphones', 'Coques & Protections', 'Chargeurs & Câbles', 'Écouteurs & Casques', 'Montres Connectées', 'Accessoires Gaming'].map(cat => (
                <li key={cat}>
                  <button
                    onClick={() => navigate('shop')}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-5">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:+21699400090" className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group">
                  <div className="w-8 h-8 bg-gray-800 group-hover:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <Phone size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Téléphone</p>
                    <p className="text-sm font-medium">+216 99 400 090</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="https://wa.me/21699400090" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group">
                  <div className="w-8 h-8 bg-gray-800 group-hover:bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <MessageCircle size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">WhatsApp</p>
                    <p className="text-sm font-medium">+216 99 400 090</p>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:contact@fiftystore.tn" className="flex items-start gap-3 text-gray-400 hover:text-white transition-colors group">
                  <div className="w-8 h-8 bg-gray-800 group-hover:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                    <Mail size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium">contact@fiftystore.tn</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-gray-400">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Localisation</p>
                    <p className="text-sm font-medium">🇹🇳 Tunisie</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © 2025 FiftyStore. Tous droits réservés. — Fondé par <span className="text-blue-400">Wissem Loueti</span>
          </p>
          <div className="flex items-center gap-4 text-gray-500 text-xs">
            <span>🇹🇳 Livraison sur toute la Tunisie</span>
            <span>•</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
