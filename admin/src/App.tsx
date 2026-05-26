import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, LogOut, PackageCheck, RefreshCcw, Shield, Truck, XCircle } from 'lucide-react';
import {
  clearAdminToken,
  fetchAdminOrders,
  getAdminToken,
  loginAdmin,
  Order,
  OrderStatus,
  updateOrderStatus,
} from './lib/api';

const statuses: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'pending', label: 'En attente' },
  { value: 'confirmed', label: 'Confirmées' },
  { value: 'delivering', label: 'Livraison' },
  { value: 'completed', label: 'Terminées' },
  { value: 'cancelled', label: 'Annulées' },
];

const nextActions: { status: OrderStatus; label: string; icon: typeof CheckCircle2 }[] = [
  { status: 'confirmed', label: 'Confirmer', icon: CheckCircle2 },
  { status: 'delivering', label: 'En livraison', icon: Truck },
  { status: 'completed', label: 'Terminée', icon: PackageCheck },
  { status: 'cancelled', label: 'Annuler', icon: XCircle },
];

function money(value: string | number) {
  return `${Number(value).toLocaleString()} TND`;
}

function statusLabel(status: OrderStatus) {
  return statuses.find((item) => item.value === status)?.label || status;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getAdminToken()));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState<OrderStatus | 'all'>('all');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingId, setIsSavingId] = useState<number | null>(null);

  const stats = useMemo(() => {
    const total = orders.reduce((sum, order) => sum + Number(order.total), 0);
    return {
      count: orders.length,
      pending: orders.filter((order) => order.status === 'pending').length,
      confirmed: orders.filter((order) => order.status === 'confirmed').length,
      total,
    };
  }, [orders]);

  const loadOrders = useCallback(async () => {
    setError('');
    setIsLoading(true);
    try {
      const data = await fetchAdminOrders(status);
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger les commandes.');
      if (err instanceof Error && err.message.toLowerCase().includes('session')) {
        clearAdminToken();
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated, loadOrders]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await loginAdmin(email, password);
      setIsAuthenticated(true);
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion impossible.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatus = async (orderId: number, nextStatus: OrderStatus) => {
    setError('');
    setIsSavingId(orderId);
    try {
      const data = await updateOrderStatus(orderId, nextStatus);
      setOrders((current) => current.map((order) => (order.id === orderId ? data.order : order)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mise à jour impossible.');
    } finally {
      setIsSavingId(null);
    }
  };

  const logout = () => {
    clearAdminToken();
    setIsAuthenticated(false);
    setOrders([]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 pt-28 px-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">Admin</h1>
              <p className="text-gray-400 text-sm">Fifty Store dashboard</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            {error && <div className="text-sm text-red-200 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">{error}</div>}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-8 px-4 sm:px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Dashboard commandes</h1>
            <p className="text-gray-400 text-sm">Gestion des commandes Cash on Delivery</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadOrders}
              disabled={isLoading}
              className="px-4 py-3 bg-gray-900 border border-gray-800 text-gray-200 rounded-xl hover:border-gray-700 transition-colors flex items-center gap-2"
            >
              <RefreshCcw size={16} />
              Actualiser
            </button>
            <button
              onClick={logout}
              className="px-4 py-3 bg-gray-900 border border-gray-800 text-gray-200 rounded-xl hover:border-gray-700 transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              Sortir
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase">Commandes</p>
            <p className="text-white text-2xl font-black mt-1">{stats.count}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase">En attente</p>
            <p className="text-yellow-300 text-2xl font-black mt-1">{stats.pending}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase">Confirmées</p>
            <p className="text-blue-300 text-2xl font-black mt-1">{stats.confirmed}</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-xs uppercase">Total</p>
            <p className="text-green-300 text-2xl font-black mt-1">{money(stats.total)}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {statuses.map((item) => (
            <button
              key={item.value}
              onClick={() => setStatus(item.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                status === item.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-900 border border-gray-800 text-gray-300 hover:border-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {error && <div className="mb-6 text-sm text-red-200 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">{error}</div>}

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h2 className="text-white font-black text-xl">Commande #{order.id}</h2>
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-200 border border-blue-500/20 text-xs font-bold">
                      {statusLabel(order.status)}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(order.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-300 font-semibold">{order.customer_name} · {order.phone}</p>
                  <p className="text-gray-500 text-sm mt-1">{order.address}, {order.city}</p>
                  {order.notes && <p className="text-gray-400 text-sm mt-2">Note: {order.notes}</p>}
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-gray-500 text-xs uppercase">Total</p>
                  <p className="text-white text-2xl font-black">{money(order.total)}</p>
                </div>
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-500 border-b border-gray-800">
                    <tr>
                      <th className="text-left pb-2 font-medium">Produit</th>
                      <th className="text-right pb-2 font-medium">Qté</th>
                      <th className="text-right pb-2 font-medium">Prix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-3 text-gray-200">{item.name}</td>
                        <td className="py-3 text-right text-gray-400">{item.quantity}</td>
                        <td className="py-3 text-right text-gray-200">{money(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap gap-2 mt-5">
                {nextActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.status}
                      onClick={() => handleStatus(order.id, action.status)}
                      disabled={isSavingId === order.id || order.status === action.status}
                      className="px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-100 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
                    >
                      <Icon size={15} />
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {!isLoading && orders.length === 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center text-gray-400">
              Aucune commande pour ce filtre.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
