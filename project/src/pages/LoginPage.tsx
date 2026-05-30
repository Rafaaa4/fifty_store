import { LockKeyhole, LogIn, Mail, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Seo from '../components/Seo';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect');

  const { signInWithEmail, signInWithGoogle, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldNonce] = useState(() => Math.random().toString(36).slice(2));
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    const success = await signInWithEmail(normalizedEmail, password);
    if (!success) return;

    if (redirect) {
      navigate(decodeURIComponent(redirect), { replace: true });
      return;
    }

    navigate('/account', { replace: true });
  };

  const handleGoogleCredential = async (credential: string) => {
    const success = await signInWithGoogle(credential);
    if (!success) return;

    if (redirect) {
      navigate(decodeURIComponent(redirect), { replace: true });
      return;
    }

    navigate('/account', { replace: true });
  };

  return (
    <>
      <Seo
        title="Connexion"
        description="Connexion client Fifty Store avec email et mot de passe."
        path="/login"
      />

      <div className="page-bg min-h-screen pt-28 sm:pt-32">
        <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <section className="glass-card rounded-3xl p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-500">Authentification</p>
              <h1 className="mt-2 text-3xl font-bold text-primary">Connexion Fifty Store</h1>
              <p className="mt-3 text-sm text-muted">
                Connectez-vous a votre compte client pour commander plus rapidement et suivre vos demandes.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4" autoComplete="off">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-secondary">Email</label>
                  <input
                    type="email"
                    ref={emailRef}
                    name={`fs-client-login-${fieldNonce}`}
                    autoComplete="new-password"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                    placeholder="email@gmail.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-secondary">Mot de passe</label>
                  <input
                    type="password"
                    ref={passwordRef}
                    name={`fs-client-secret-${fieldNonce}`}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-soft bg-surface-strong px-3 py-3 text-sm text-primary outline-none"
                    placeholder="********"
                    required
                  />
                </div>

                <button disabled={loading} type="submit" className="premium-btn w-full justify-center">
                  <LogIn size={16} /> Se connecter
                </button>
              </form>

              <GoogleAuthButton
                label="Continuer avec Google"
                disabled={loading}
                onCredential={(credential) => void handleGoogleCredential(credential)}
              />

              <p className="mt-4 text-sm text-muted">
                Nouveau client ?{' '}
                <Link to="/register" className="font-semibold text-fuchsia-500">
                  Creer un compte
                </Link>
              </p>
            </section>

            <section className="glass-card relative overflow-hidden rounded-3xl p-6 sm:p-8">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />
              <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-orange-400/20 blur-3xl" />

              <div className="relative z-10">
                <p className="inline-flex items-center gap-2 rounded-full border border-soft bg-surface-strong px-3 py-1 text-xs font-semibold text-fuchsia-500">
                  <Sparkles size={14} /> Acces securise
                </p>

                <h2 className="mt-4 text-2xl font-bold text-primary">Espace sécurisé Fifty Store</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Connectez-vous pour accéder à votre espace en toute sécurité. Interface rapide, fluide et compatible
                  mobile.
                </p>

                <div className="mt-5 space-y-3">
                  <article className="card-strong rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-premium">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      <LockKeyhole size={16} className="text-emerald-500" /> Connexion protégée
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      Vos informations sont traitées de façon sécurisée.
                    </p>
                  </article>

                  <article className="card-strong rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-premium">
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      <Mail size={16} className="text-fuchsia-500" /> Accès rapide
                    </p>
                    <p className="mt-2 text-sm text-muted">
                      Utilisez votre email ou Google pour entrer en quelques secondes.
                    </p>
                  </article>
                </div>

              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
