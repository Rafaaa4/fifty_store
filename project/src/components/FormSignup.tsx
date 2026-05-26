import { useState } from 'react';
import { Mail, Lock, Phone, UserPlus, UserRound } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export default function FormSignup() {
  const { navigate } = useApp();
  const { signup } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signup(form);
      navigate('shop');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Création de compte impossible.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 space-y-5">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div>
        <label className="block text-gray-400 text-sm mb-2">Nom complet</label>
        <div className="relative">
          <UserRound size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={form.fullName}
            onChange={(event) => update('fullName', event.target.value)}
            required
            placeholder="Mohamed Ben Ali"
            className="w-full bg-gray-800 border border-gray-700 text-white pl-11 pr-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm placeholder-gray-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-400 text-sm mb-2">Email</label>
          <div className="relative">
            <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              required
              placeholder="votre@email.com"
              className="w-full bg-gray-800 border border-gray-700 text-white pl-11 pr-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm placeholder-gray-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-sm mb-2">Téléphone</label>
          <div className="relative">
            <Phone size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => update('phone', event.target.value)}
              required
              placeholder="+216 XX XXX XXX"
              className="w-full bg-gray-800 border border-gray-700 text-white pl-11 pr-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm placeholder-gray-600"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-gray-400 text-sm mb-2">Mot de passe</label>
        <div className="relative">
          <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="password"
            value={form.password}
            onChange={(event) => update('password', event.target.value)}
            required
            minLength={8}
            placeholder="8 caractères minimum"
            className="w-full bg-gray-800 border border-gray-700 text-white pl-11 pr-4 py-3 rounded-xl outline-none focus:border-blue-500 transition-colors text-sm placeholder-gray-600"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2"
      >
        <UserPlus size={18} />
        {isSubmitting ? 'Création...' : 'Créer mon compte'}
      </button>

      <p className="text-center text-sm text-gray-400">
        Déjà inscrit ?{' '}
        <button type="button" onClick={() => navigate('login')} className="text-blue-300 hover:text-blue-200 font-semibold">
          Se connecter
        </button>
      </p>
    </form>
  );
}
