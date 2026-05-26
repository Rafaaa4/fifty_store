import { ShieldCheck } from 'lucide-react';
import FormLogin from '../components/FormLogin';

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-950 pt-24 px-4 sm:px-6 pb-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Compte client</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-5">Connectez-vous à Fifty Store</h1>
          <p className="text-gray-400 text-lg max-w-xl">
            Retrouvez vos commandes, passez plus vite au checkout et gardez vos achats liés à votre compte.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-white font-bold">Commandes suivies</p>
              <p className="text-gray-500 text-sm mt-1">Chaque nouvelle commande est attachée à votre compte.</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="text-white font-bold">Support plus rapide</p>
              <p className="text-gray-500 text-sm mt-1">Vos messages contact restent visibles côté admin.</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-black text-2xl">Connexion</h2>
              <p className="text-gray-500 text-sm">Accès sécurisé client</p>
            </div>
          </div>
          <FormLogin />
        </div>
      </div>
    </div>
  );
}
