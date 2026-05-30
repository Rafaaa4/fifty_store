import { useEffect, useRef, useState } from 'react';

interface GoogleAuthButtonProps {
  label: string;
  disabled?: boolean;
  onCredential: (credential: string) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

let googleScriptPromise: Promise<void> | null = null;
let initializedClientId: string | null = null;
let latestCredentialHandler: ((credential: string) => void) | null = null;

function loadGoogleScript() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Google script failed')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google script failed'));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export default function GoogleAuthButton({ label, disabled = false, onCredential }: GoogleAuthButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();

  useEffect(() => {
    if (!clientId || disabled) return;
    let mounted = true;
    setFailed(false);

    loadGoogleScript()
      .then(() => {
        if (!mounted || !containerRef.current || !window.google?.accounts?.id) return;

        latestCredentialHandler = onCredential;
        containerRef.current.innerHTML = '';
        if (initializedClientId !== clientId) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              if (response.credential) latestCredentialHandler?.(response.credential);
            },
          });
          initializedClientId = clientId;
        }
        window.google.accounts.id.renderButton(containerRef.current, {
          theme: 'outline',
          size: 'large',
          text: label.toLowerCase().includes('inscription') ? 'signup_with' : 'continue_with',
          shape: 'pill',
          width: containerRef.current.clientWidth || 320,
        });
        setReady(true);
      })
      .catch(() => {
        setReady(false);
        setFailed(true);
      });

    return () => {
      mounted = false;
    };
  }, [clientId, disabled, label, onCredential]);

  if (!clientId) {
    return (
      <div className="mt-5">
        <div className="relative flex items-center py-2">
          <span className="h-px flex-1 bg-soft" />
          <span className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">ou</span>
          <span className="h-px flex-1 bg-soft" />
        </div>
        <button
          type="button"
          disabled
          className="mt-3 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-soft bg-surface-strong px-4 text-sm font-bold text-muted opacity-70"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-black text-slate-900 shadow-sm">
            G
          </span>
          Continuer avec Google
        </button>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <div className="relative flex items-center py-2">
        <span className="h-px flex-1 bg-soft" />
        <span className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted">ou</span>
        <span className="h-px flex-1 bg-soft" />
      </div>

      <div className="mt-3 rounded-xl border border-soft bg-white p-1 shadow-sm transition hover:border-fuchsia-400/60 dark:bg-slate-950">
        <div
          ref={containerRef}
          aria-label={label}
          className={`flex min-h-11 w-full items-center justify-center overflow-hidden rounded-lg ${
            disabled ? 'pointer-events-none opacity-60' : ''
          }`}
        />

        {!ready && !disabled ? (
          <div className="flex h-11 w-full animate-pulse items-center justify-center gap-3 rounded-lg bg-surface-strong px-4 text-sm font-bold text-secondary">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-black text-slate-900 shadow-sm">
              G
            </span>
            {failed ? 'Google indisponible' : label}
          </div>
        ) : null}
      </div>
    </div>
  );
}
