import { useMemo, useState } from 'react';
import { CalendarClock, Check, MapPin, PackageCheck, Truck, Wrench } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createRepairRequest } from '../lib/api';

const services = [
  { id: 'screen', name: 'Afficheur téléphone', price: 'à partir de 100 TND' },
  { id: 'battery', name: 'Batterie téléphone', price: 'sur devis' },
  { id: 'charging_port', name: 'Connecteur de charge', price: 'sur devis' },
  { id: 'camera', name: 'Caméra / lentille', price: 'sur devis' },
  { id: 'speaker', name: 'Haut-parleur / micro', price: 'sur devis' },
  { id: 'software', name: 'Problème logiciel', price: 'sur devis' },
  { id: 'diagnostic', name: 'Diagnostic complet', price: '20 TND' },
  { id: 'other', name: 'Autre réparation', price: 'sur devis' },
];

const courierCities = ['Tunis', 'Ariana', 'Ben Arous', 'Manouba'];

export default function RepairPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    serviceType: 'screen',
    deviceBrand: '',
    deviceModel: '',
    issueDescription: '',
    deliveryMode: 'appointment',
    preferredDate: '',
    preferredTime: '',
    customer: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      city: '',
      address: '',
      notes: '',
    },
  });
  const [isDone, setIsDone] = useState(false);
  const [repairId, setRepairId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasCourier = useMemo(() => courierCities.includes(form.customer.city), [form.customer.city]);

  const update = (field: string, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateCustomer = (field: string, value: string) => {
    setForm((current) => ({ ...current, customer: { ...current.customer, [field]: value } }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const data = await createRepairRequest(form);
      setRepairId(data.repair.id);
      setIsDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible d’envoyer la demande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDone) {
    return (
      <div className="min-h-screen bg-gray-950 pt-24 px-4 flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={34} className="text-green-300" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Demande reçue</h1>
          <p className="text-gray-400 mb-4">Notre équipe va confirmer le pickup ou le rendez-vous selon votre ville.</p>
          {repairId && <p className="text-blue-300 font-bold">Référence réparation #{repairId}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <span className="text-blue-400 text-sm font-semibold uppercase tracking-widest">Atelier téléphone</span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 mb-4">Réparation téléphone</h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Choisissez le service, on organise le pickup si vous êtes dans notre zone. Sinon, prenez rendez-vous pour passer sur place.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => update('serviceType', service.id)}
              className={`w-full text-left p-5 rounded-2xl border transition-colors ${
                form.serviceType === service.id
                  ? 'bg-blue-600/10 border-blue-500/50'
                  : 'bg-gray-900 border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wrench size={20} className="text-blue-300" />
                <div>
                  <p className="text-white font-bold">{service.name}</p>
                  <p className="text-gray-500 text-sm">{service.price}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
          {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required value={form.deviceBrand} onChange={(e) => update('deviceBrand', e.target.value)} placeholder="Marque: Samsung, iPhone..." className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm" />
            <input required value={form.deviceModel} onChange={(e) => update('deviceModel', e.target.value)} placeholder="Modèle: A55, iPhone 13..." className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm" />
          </div>

          <textarea required rows={4} value={form.issueDescription} onChange={(e) => update('issueDescription', e.target.value)} placeholder="Décrivez la panne..." className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm resize-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required value={form.customer.fullName} onChange={(e) => updateCustomer('fullName', e.target.value)} placeholder="Nom complet" className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm" />
            <input required value={form.customer.phone} onChange={(e) => updateCustomer('phone', e.target.value)} placeholder="+216 XX XXX XXX" className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm" />
            <select required value={form.customer.city} onChange={(e) => updateCustomer('city', e.target.value)} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm">
              <option value="">Ville</option>
              {['Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Sousse', 'Sfax', 'Nabeul', 'Bizerte', 'Autre'].map((city) => <option key={city}>{city}</option>)}
            </select>
            <input required value={form.customer.address} onChange={(e) => updateCustomer('address', e.target.value)} placeholder="Adresse / quartier" className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className={`p-4 rounded-2xl border cursor-pointer ${form.deliveryMode === 'courier_pickup' ? 'border-blue-500 bg-blue-600/10' : 'border-gray-800 bg-gray-950/40'} ${!hasCourier ? 'opacity-50' : ''}`}>
              <input type="radio" name="deliveryMode" className="sr-only" disabled={!hasCourier} checked={form.deliveryMode === 'courier_pickup'} onChange={() => update('deliveryMode', 'courier_pickup')} />
              <Truck size={20} className="text-blue-300 mb-2" />
              <p className="text-white font-bold text-sm">Livreur pickup</p>
              <p className="text-gray-500 text-xs">On prend le colis et on le ramène après réparation.</p>
            </label>
            <label className={`p-4 rounded-2xl border cursor-pointer ${form.deliveryMode === 'appointment' ? 'border-blue-500 bg-blue-600/10' : 'border-gray-800 bg-gray-950/40'}`}>
              <input type="radio" name="deliveryMode" className="sr-only" checked={form.deliveryMode === 'appointment'} onChange={() => update('deliveryMode', 'appointment')} />
              <CalendarClock size={20} className="text-blue-300 mb-2" />
              <p className="text-white font-bold text-sm">Rendez-vous</p>
              <p className="text-gray-500 text-xs">Vous venez sur place à l’heure confirmée.</p>
            </label>
            <label className={`p-4 rounded-2xl border cursor-pointer ${form.deliveryMode === 'store_dropoff' ? 'border-blue-500 bg-blue-600/10' : 'border-gray-800 bg-gray-950/40'}`}>
              <input type="radio" name="deliveryMode" className="sr-only" checked={form.deliveryMode === 'store_dropoff'} onChange={() => update('deliveryMode', 'store_dropoff')} />
              <MapPin size={20} className="text-blue-300 mb-2" />
              <p className="text-white font-bold text-sm">Dépôt boutique</p>
              <p className="text-gray-500 text-xs">Vous déposez le téléphone au magasin.</p>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input type="date" value={form.preferredDate} onChange={(e) => update('preferredDate', e.target.value)} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm" />
            <input type="time" value={form.preferredTime} onChange={(e) => update('preferredTime', e.target.value)} className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm" />
          </div>

          <textarea rows={3} value={form.customer.notes} onChange={(e) => updateCustomer('notes', e.target.value)} placeholder="Notes pour le livreur / technicien..." className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl outline-none focus:border-blue-500 text-sm resize-none" />

          <button disabled={isSubmitting} className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2">
            <PackageCheck size={18} />
            {isSubmitting ? 'Envoi...' : 'Envoyer la demande réparation'}
          </button>
        </form>
      </div>
    </div>
  );
}
