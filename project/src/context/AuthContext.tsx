import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
  clearCustomerToken,
  Customer,
  fetchCurrentCustomer,
  getCustomerToken,
  loginCustomer,
  signupCustomer,
} from '../lib/api';

interface SignupData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextType {
  user: Customer | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(getCustomerToken()));

  useEffect(() => {
    if (!getCustomerToken()) {
      return;
    }

    fetchCurrentCustomer()
      .then((data) => setUser(data.user))
      .catch(() => clearCustomerToken())
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const nextUser = await loginCustomer(email, password);
    setUser(nextUser);
  };

  const signup = async (data: SignupData) => {
    const nextUser = await signupCustomer(data);
    setUser(nextUser);
  };

  const logout = () => {
    clearCustomerToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
