import { Sparkles } from 'lucide-react';
import FormSignup from '../components/FormSignup';

export default function Signup() {
  return (
    <div className="min-h-screen bg-gray-950 pt-24 px-4 sm:px-6 pb-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Nouveau compte</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-5">Créez votre espace Fifty Store</h1>
          <p className="text-gray-400 text-lg max-w-xl">
            Un compte simple pour lier vos commandes à votre profil et faciliter le suivi avec notre équipe.
          </p>

          <div className="mt-8 bg-blue-600/10 border border-blue-500/30 rounded-2xl p-6">
            <p className="text-white font-bold">Cash on Delivery toujours disponible</p>
            <p className="text-gray-400 text-sm mt-2">
              Le compte sert au suivi et au support. Le paiement reste à la livraison.
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-black text-2xl">Inscription</h2>
              <p className="text-gray-500 text-sm">Votre espace client</p>
            </div>
          </div>
          <FormSignup />
        </div>
      </div>
    </div>
  );
}
