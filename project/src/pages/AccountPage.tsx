import { useEffect, useState } from 'react';
import { PackageCheck, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { fetchMyOrders, Order } from '../lib/api';

function money(value: string | number) {
  return `${Number(value).toLocaleString()} TND`;
}

export default function AccountPage() {
  const { navigate } = useApp();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('login');
      return;
    }

    fetchMyOrders()
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err instanceof Error ? err.message : 'Impossible de charger vos commandes.'))
      .finally(() => setIsLoading(false));
  }, [navigate, user]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-24 px-4 sm:px-6 pb-16">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
            <PackageCheck size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">Mes commandes</h1>
            <p className="text-gray-400 text-sm">{user.fullName} · {user.email}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {!isLoading && orders.length === 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center">
            <ShoppingBag size={34} className="text-gray-600 mx-auto mb-4" />
            <p className="text-white font-bold text-xl mb-2">Aucune commande liée à ce compte</p>
            <p className="text-gray-500 mb-6">Vos prochaines commandes apparaîtront ici automatiquement.</p>
            <button
              onClick={() => navigate('shop')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors"
            >
              Voir la boutique
            </button>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-white font-black text-xl">Commande #{order.id}</h2>
                  <p className="text-gray-500 text-sm mt-1">{new Date(order.created_at).toLocaleString()}</p>
                </div>
                <div className="sm:text-right">
                  <span className="inline-flex px-3 py-1 rounded-full bg-blue-500/10 text-blue-200 border border-blue-500/20 text-xs font-bold">
                    {order.status}
                  </span>
                  <p className="text-white text-2xl font-black mt-2">{money(order.total)}</p>
                </div>
              </div>

              <div className="divide-y divide-gray-800">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-sm">
                    <span className="text-gray-200">{item.name}</span>
                    <span className="text-gray-400">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
