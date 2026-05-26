import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2, Image, LogOut, Mail, MessageSquare, PackageCheck,
  Plus, RefreshCcw, Shield, Trash2, Truck, XCircle
} from 'lucide-react';
import {
  clearAdminToken,
  ContactMessage,
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminContacts,
  fetchAdminOrders,
  fetchAdminProducts,
  getAdminToken,
  loginAdmin,
  markContactRead,
  Order,
  OrderStatus,
  Product,
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
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [view, setView] = useState<'orders' | 'contacts' | 'products'>('orders');
  const [status, setStatus] = useState<OrderStatus | 'all'>('all');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingId, setIsSavingId] = useState<number | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'smartphones',
    price: '',
    originalPrice: '',
    discount: '',
    description: '',
    features: '',
    badge: '',
    inStock: true,
    isNew: false,
    isBestSeller: false,
  });
  const [productImage, setProductImage] = useState<File | null>(null);

  const stats = useMemo(() => {
    const total = orders.reduce((sum, order) => sum + Number(order.total), 0);
    return {
      count: orders.length,
      pending: orders.filter((order) => order.status === 'pending').length,
      confirmed: orders.filter((order) => order.status === 'confirmed').length,
      total,
    };
  }, [orders]);

  const unreadContacts = contacts.filter((message) => message.status === 'new').length;

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

  const loadContacts = useCallback(async () => {
    setError('');
    setIsLoading(true);
    try {
      const data = await fetchAdminContacts();
      setContacts(data.messages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger les messages.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setError('');
    setIsLoading(true);
    try {
      const data = await fetchAdminProducts();
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger les produits.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (view === 'orders') {
        loadOrders();
      } else if (view === 'contacts') {
        loadContacts();
      } else {
        loadProducts();
      }
    }
  }, [isAuthenticated, loadContacts, loadOrders, loadProducts, view]);

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

  const handleContactRead = async (messageId: number) => {
    setError('');
    setIsSavingId(messageId);
    try {
      const data = await markContactRead(messageId);
      setContacts((current) => current.map((message) => (message.id === messageId ? data.message : message)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Mise à jour impossible.');
    } finally {
      setIsSavingId(null);
    }
  };

  const handleCreateProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!productImage) {
      setError('Image produit obligatoire.');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(productForm).forEach(([key, value]) => formData.append(key, String(value)));
      formData.append('image', productImage);

      const data = await createAdminProduct(formData);
      setProducts((current) => [data.product, ...current]);
      setProductForm({
        name: '',
        category: 'smartphones',
        price: '',
        originalPrice: '',
        discount: '',
        description: '',
        features: '',
        badge: '',
        inStock: true,
        isNew: false,
        isBestSeller: false,
      });
      setProductImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload produit impossible.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    setError('');
    setIsSavingId(productId);
    try {
      await deleteAdminProduct(productId);
      setProducts((current) => current.filter((product) => product.id !== productId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Suppression impossible.');
    } finally {
      setIsSavingId(null);
    }
  };

  const logout = () => {
    clearAdminToken();
    setIsAuthenticated(false);
    setOrders([]);
    setContacts([]);
    setProducts([]);
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
            <h1 className="text-3xl font-black text-white">Dashboard Fifty Store</h1>
            <p className="text-gray-400 text-sm">Gestion des commandes et messages contact</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={view === 'orders' ? loadOrders : view === 'contacts' ? loadContacts : loadProducts}
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

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setView('orders')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
              view === 'orders' ? 'bg-blue-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-300 hover:border-gray-700'
            }`}
          >
            <PackageCheck size={16} />
            Commandes
          </button>
          <button
            onClick={() => setView('contacts')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
              view === 'contacts' ? 'bg-blue-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-300 hover:border-gray-700'
            }`}
          >
            <MessageSquare size={16} />
            Contacts
            {unreadContacts > 0 && <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">{unreadContacts}</span>}
          </button>
          <button
            onClick={() => setView('products')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
              view === 'products' ? 'bg-blue-600 text-white' : 'bg-gray-900 border border-gray-800 text-gray-300 hover:border-gray-700'
            }`}
          >
            <Image size={16} />
            Produits
          </button>
        </div>

        {view === 'orders' && <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
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
        </div>}

        {view === 'orders' && <div className="flex flex-wrap gap-2 mb-6">
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
        </div>}

        {error && <div className="mb-6 text-sm text-red-200 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">{error}</div>}

        {view === 'orders' ? <div className="space-y-4">
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
        </div> : view === 'contacts' ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-gray-500 border-b border-gray-800">
                  <tr>
                    <th className="text-left p-4 font-medium">Client</th>
                    <th className="text-left p-4 font-medium">Contact</th>
                    <th className="text-left p-4 font-medium">Message</th>
                    <th className="text-left p-4 font-medium">Date</th>
                    <th className="text-right p-4 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {contacts.map((message) => (
                    <tr key={message.id} className="align-top">
                      <td className="p-4">
                        <p className="text-white font-semibold">{message.name}</p>
                        {message.customer_full_name && (
                          <p className="text-blue-300 text-xs mt-1">Compte: {message.customer_full_name}</p>
                        )}
                      </td>
                      <td className="p-4 text-gray-300">
                        <p>{message.phone}</p>
                        {message.email && <p className="text-gray-500 mt-1">{message.email}</p>}
                      </td>
                      <td className="p-4 text-gray-300 max-w-xl">
                        <p className="whitespace-pre-wrap">{message.message}</p>
                      </td>
                      <td className="p-4 text-gray-500">{new Date(message.created_at).toLocaleString()}</td>
                      <td className="p-4 text-right">
                        {message.status === 'new' ? (
                          <button
                            onClick={() => handleContactRead(message.id)}
                            disabled={isSavingId === message.id}
                            className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors inline-flex items-center gap-2"
                          >
                            <Mail size={15} />
                            Marquer lu
                          </button>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-300 border border-green-500/20 text-xs font-bold">
                            Lu
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!isLoading && contacts.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-gray-400">Aucun message contact.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <form onSubmit={handleCreateProduct} className="xl:col-span-1 bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
              <h2 className="text-white font-black text-xl">Nouveau produit</h2>
              <input
                value={productForm.name}
                onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="Nom produit"
                required
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm"
              />
              <select
                value={productForm.category}
                onChange={(event) => setProductForm((current) => ({ ...current, category: event.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm"
              >
                {['smartphones', 'coques', 'chargeurs', 'ecouteurs', 'montres', 'gaming'].map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(event) => setProductForm((current) => ({ ...current, price: event.target.value }))}
                  placeholder="Prix"
                  required
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm"
                />
                <input
                  type="number"
                  value={productForm.originalPrice}
                  onChange={(event) => setProductForm((current) => ({ ...current, originalPrice: event.target.value }))}
                  placeholder="Ancien prix"
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  value={productForm.discount}
                  onChange={(event) => setProductForm((current) => ({ ...current, discount: event.target.value }))}
                  placeholder="Remise %"
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm"
                />
                <input
                  value={productForm.badge}
                  onChange={(event) => setProductForm((current) => ({ ...current, badge: event.target.value }))}
                  placeholder="Badge"
                  className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm"
                />
              </div>
              <textarea
                value={productForm.description}
                onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Description"
                required
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm resize-none"
              />
              <textarea
                value={productForm.features}
                onChange={(event) => setProductForm((current) => ({ ...current, features: event.target.value }))}
                placeholder="Caractéristiques, une par ligne"
                rows={4}
                className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm resize-none"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setProductImage(event.target.files?.[0] || null)}
                required
                className="w-full bg-gray-800 border border-gray-700 text-gray-300 px-4 py-3 rounded-xl text-sm"
              />
              <div className="grid grid-cols-3 gap-2 text-sm text-gray-300">
                {[
                  ['inStock', 'Stock'],
                  ['isNew', 'Nouveau'],
                  ['isBestSeller', 'Best'],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2">
                    <input
                      type="checkbox"
                      checked={Boolean(productForm[key as keyof typeof productForm])}
                      onChange={(event) => setProductForm((current) => ({ ...current, [key]: event.target.checked }))}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Ajouter produit
              </button>
            </form>

            <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-gray-500 border-b border-gray-800">
                    <tr>
                      <th className="text-left p-4 font-medium">Produit</th>
                      <th className="text-left p-4 font-medium">Catégorie</th>
                      <th className="text-right p-4 font-medium">Prix</th>
                      <th className="text-right p-4 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                            <span className="text-white font-semibold">{product.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-400">{product.category}</td>
                        <td className="p-4 text-right text-white font-bold">{money(product.price)}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={isSavingId === product.id}
                            className="p-2 text-gray-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!isLoading && products.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-10 text-center text-gray-400">Aucun produit ajouté.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
