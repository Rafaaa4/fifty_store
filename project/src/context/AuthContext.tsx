/* eslint-disable react-refresh/only-export-components */
import { useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import {
  clearCustomerToken,
  fetchCurrentCustomer,
  getCustomerToken,
  loginCustomer,
  loginCustomerWithGoogle,
  signupCustomer,
  type Customer,
} from '../lib/api';
import { createStableContext } from './stableContext';

export type UserRole = 'client';
type AuthProviderType = 'backend';

interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  provider: AuthProviderType;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isClient: boolean;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: (credential: string) => Promise<boolean>;
  signUpWithEmail: (fullName: string, email: string, password: string, phone?: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { fullName: string; email: string; phone: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createStableContext<AuthContextType>('auth');

function mapCustomer(user: Customer): AuthUser {
  return {
    id: String(user.id),
    email: user.email,
    fullName: user.fullName,
    phone: user.phone,
    role: 'client',
    provider: 'backend',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!getCustomerToken()) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCurrentCustomer();
        if (mounted) setUser(mapCustomer(data.user));
      } catch {
        clearCustomerToken();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void init();
    return () => {
      mounted = false;
    };
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password.trim()) {
      toast.error('Email et mot de passe obligatoires.');
      return false;
    }

    try {
      const customer = await loginCustomer(normalizedEmail, password);
      setUser(mapCustomer(customer));
      toast.success('Connexion reussie');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Connexion impossible.');
      return false;
    }
  }, []);

  const signUpWithEmail = useCallback(
    async (fullName: string, email: string, password: string, phone = ''): Promise<boolean> => {
      const normalizedEmail = email.trim().toLowerCase();
      const trimmedFullName = fullName.trim();
      const trimmedPhone = phone.trim();

      if (!trimmedFullName || !normalizedEmail || !trimmedPhone || !password.trim()) {
        toast.error('Veuillez remplir tous les champs.');
        return false;
      }

      if (password.length < 8) {
        toast.error('Le mot de passe doit contenir au moins 8 caracteres.');
        return false;
      }

      try {
        const customer = await signupCustomer({
          fullName: trimmedFullName,
          email: normalizedEmail,
          phone: trimmedPhone,
          password,
        });
        setUser(mapCustomer(customer));
        toast.success('Compte cree avec succes.');
        return true;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Inscription impossible.');
        return false;
      }
    },
    [],
  );

  const signInWithGoogle = useCallback(async (credential: string): Promise<boolean> => {
    if (!credential.trim()) {
      toast.error('Google credential manquant.');
      return false;
    }

    try {
      const customer = await loginCustomerWithGoogle(credential);
      setUser(mapCustomer(customer));
      toast.success('Connexion Google reussie');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Connexion Google impossible.');
      return false;
    }
  }, []);

  const signOutUser = useCallback(async (): Promise<void> => {
    clearCustomerToken();
    setUser(null);
    toast.success('Deconnecte');
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const success = await signInWithEmail(email, password);
    if (!success) throw new Error('Login failed');
  }, [signInWithEmail]);

  const signup = useCallback(async (data: { fullName: string; email: string; phone: string; password: string }): Promise<void> => {
    const success = await signUpWithEmail(data.fullName, data.email, data.password, data.phone);
    if (!success) throw new Error('Signup failed');
  }, [signUpWithEmail]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isClient: user?.role === 'client',
      signInWithEmail,
      signInWithGoogle,
      signUpWithEmail,
      login,
      signup,
      signOut: signOutUser,
    }),
    [user, loading, signInWithEmail, signInWithGoogle, signUpWithEmail, login, signup, signOutUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
