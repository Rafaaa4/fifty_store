import { useState } from 'react';
import {
  ArrowRight, Truck, Shield, MessageCircle, Zap, Star,
  ChevronDown, ChevronUp, Package, Clock, CreditCard,
  Smartphone, Headphones, Watch, Gamepad2
} from 'lucide-react';
import { categories, testimonials, faqs } from '../data/products';
import ProductCard from '../components/ProductCard';
import { useApp } from '../context/AppContext';
import { useProducts } from '../context/ProductContext';

export default function HomePage() {
  const { navigate } = useApp();
  const { products } = useProducts();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const featuredProducts = products.filter(p => p.isBestSeller).slice(0, 4);
  const newProducts = products.filter(p => p.isNew).slice(0, 4);
  const promoProducts = products.filter(p => p.discount && p.discount >= 20).slice(0, 4);

  const categoryIcons: Record<string, React.ReactNode> = {
    smartphones: <Smartphone size={28} />,
    coques: <Shield size={28} />,
    chargeurs: <Zap size={28} />,
    ecouteurs: <Headphones size={28} />,
    montres: <Watch size={28} />,
    gaming: <Gamepad2 size={28} />,
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=1920"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-950/85 to-blue-950/60" />
        </div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500/10 animate-pulse"
              style={{
                width: `${100 + i * 60}px`,
                height: `${100 + i * 60}px`,
                top: `${10 + i * 15}%`,
                left: `${5 + i * 14}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-400 text-sm font-medium">Livraison disponible sur toute la Tunisie 🇹🇳</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              La tech premium
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                à portée de main
              </span>
            </h1>

            <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
              Smartphones, accessoires et gadgets tech au meilleur prix en Tunisie.
              Commandez facilement, payez à la livraison.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('shop')}
                className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all duration-200 flex items-center gap-3 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
              >
                Découvrir la boutique
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="https://wa.me/21699400090?text=Bonjour%20Fifty%20Store%20!"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-green-600/20 hover:bg-green-600/30 border border-green-500/40 text-green-400 font-bold rounded-2xl transition-all duration-200 flex items-center gap-3 hover:scale-105"
              >
                <MessageCircle size={20} />
                Commander sur WhatsApp
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-14">
              {[
                { value: '500+', label: 'Clients satisfaits' },
                { value: '200+', label: 'Produits disponibles' },
                { value: '24h', label: 'Délai de livraison' },
              ].map(stat => (
                <div key={stat.label}>
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-gray-400 text-sm mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="text-gray-400 text-xs">Scroll</span>
          <div className="w-5 h-8 border-2 border-gray-600 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-blue-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Delivery features */}
      <section className="py-16 bg-gray-900 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Truck size={24} />, title: 'Livraison rapide', desc: 'Partout en Tunisie', color: 'blue' },
              { icon: <CreditCard size={24} />, title: 'Cash on Delivery', desc: 'Payez à la livraison', color: 'green' },
              { icon: <Shield size={24} />, title: 'Produits garantis', desc: '100% authentiques', color: 'cyan' },
              { icon: <Clock size={24} />, title: 'Support 7j/7', desc: 'Via WhatsApp', color: 'orange' },
            ].map(feat => (
              <div key={feat.title} className="flex items-center gap-4 p-5 bg-gray-800/50 rounded-2xl border border-gray-700/50 hover:border-blue-500/30 transition-colors group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  feat.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  feat.color === 'green' ? 'bg-green-500/20 text-green-400' :
                  feat.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {feat.icon}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{feat.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Explorer</span>
            <h2 className="text-4xl font-black text-white mt-2">Nos Catégories</h2>
            <p className="text-gray-400 mt-3 max-w-xl mx-auto">Trouvez exactement ce dont vous avez besoin parmi notre sélection premium.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.filter(c => c.id !== 'all').map(cat => (
              <button
                key={cat.id}
                onClick={() => navigate('shop')}
                className="group flex flex-col items-center gap-3 p-6 bg-gray-900 border border-gray-800 rounded-2xl hover:border-blue-500/50 hover:bg-gray-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                  {categoryIcons[cat.id]}
                </div>
                <span className="text-gray-300 text-xs font-medium text-center leading-snug group-hover:text-white transition-colors">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 px-4 sm:px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Top ventes</span>
              <h2 className="text-4xl font-black text-white mt-2">Meilleures Ventes</h2>
            </div>
            <button
              onClick={() => navigate('shop')}
              className="hidden sm:flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors group"
            >
              Tout voir
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl overflow-hidden p-8 sm:p-12">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/4" />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-3">OFFRE LIMITÉE</span>
                <h3 className="text-white text-3xl sm:text-4xl font-black">Jusqu'à -34%</h3>
                <p className="text-blue-200 mt-2 text-lg">sur une sélection de produits tech premium</p>
              </div>
              <button
                onClick={() => navigate('shop')}
                className="flex-shrink-0 px-8 py-4 bg-white text-blue-700 font-bold rounded-2xl hover:bg-blue-50 transition-colors flex items-center gap-2 group"
              >
                Profiter des offres
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-green-400 text-sm font-semibold uppercase tracking-widest">Arrivages</span>
              <h2 className="text-4xl font-black text-white mt-2">Nouveautés</h2>
            </div>
            <button
              onClick={() => navigate('shop')}
              className="hidden sm:flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors group"
            >
              Tout voir
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="py-20 px-4 sm:px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <span className="text-red-400 text-sm font-semibold uppercase tracking-widest">Prix réduits</span>
              <h2 className="text-4xl font-black text-white mt-2">Promotions</h2>
            </div>
            <button
              onClick={() => navigate('shop')}
              className="hidden sm:flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors group"
            >
              Tout voir
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {promoProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-yellow-400 text-sm font-semibold uppercase tracking-widest">Avis clients</span>
            <h2 className="text-4xl font-black text-white mt-2">Ils nous font confiance</h2>
            <div className="flex items-center justify-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-gray-400 ml-2 text-sm">4.9/5 basé sur 500+ avis</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/30 transition-colors">
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5 line-clamp-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.city}, Tunisie</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery info */}
      <section className="py-20 px-4 sm:px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Livraison</span>
              <h2 className="text-4xl font-black text-white mt-2 mb-6">Livraison sur toute la Tunisie 🇹🇳</h2>
              <div className="space-y-4">
                {[
                  { icon: <Truck size={18} />, title: 'Livraison Express', desc: 'Délai de 24 à 72h selon votre région' },
                  { icon: <Package size={18} />, title: 'Emballage soigné', desc: 'Vos produits protégés et sécurisés' },
                  { icon: <CreditCard size={18} />, title: 'Cash on Delivery', desc: 'Payez uniquement à la réception' },
                  { icon: <MessageCircle size={18} />, title: 'Suivi WhatsApp', desc: 'Suivi en temps réel de votre commande' },
                ].map(item => (
                  <div key={item.title} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                    <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                      <p className="text-gray-400 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative rounded-3xl overflow-hidden aspect-video lg:aspect-square max-w-lg mx-auto">
                <img
                  src="https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Livraison Tunisie"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 to-transparent" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl">
                <p className="font-black text-2xl">24h</p>
                <p className="text-green-200 text-xs">Délai moyen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">FAQ</span>
            <h2 className="text-4xl font-black text-white mt-2">Questions fréquentes</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`bg-gray-900 border rounded-2xl overflow-hidden transition-colors ${
                  openFaq === i ? 'border-blue-500/50' : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="text-white font-semibold text-sm pr-4">{faq.question}</span>
                  {openFaq === i
                    ? <ChevronUp size={18} className="text-blue-400 flex-shrink-0" />
                    : <ChevronDown size={18} className="text-gray-500 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gray-900 border border-gray-800 rounded-3xl p-12 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600" />
            <div className="w-16 h-16 bg-green-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle size={32} className="text-green-400" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Commandez via WhatsApp</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Envoyez-nous un message sur WhatsApp pour commander, poser vos questions ou obtenir un conseil personnalisé. Réponse rapide garantie !
            </p>
            <a
              href="https://wa.me/21699400090?text=Bonjour%20Fifty%20Store%20!%20Je%20souhaite%20commander."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 bg-green-600 hover:bg-green-500 text-white font-bold text-lg rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg shadow-green-500/25"
            >
              <MessageCircle size={22} />
              Contacter sur WhatsApp
            </a>
            <p className="text-gray-500 text-sm mt-4">+216 99 400 090 — Réponse en quelques minutes</p>
          </div>
        </div>
      </section>
    </div>
  );
}
