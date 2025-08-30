'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  isLoading: boolean;
  login: (email: string) => void;
  loginWithGoogle: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'isAuthenticated';
const EMAIL_STORAGE_KEY = 'userEmail';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for persistent login
    try {
      const authStatus = localStorage.getItem(AUTH_STORAGE_KEY);
      const email = localStorage.getItem(EMAIL_STORAGE_KEY);
      
      if (authStatus === 'true' && email) {
        setIsAuthenticated(true);
        setUserEmail(email);
      }
    } catch (error) {
      console.warn('Failed to read auth data from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((email: string) => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      localStorage.setItem(EMAIL_STORAGE_KEY, email);
      setIsAuthenticated(true);
      setUserEmail(email);
    } catch (error) {
      console.warn('Failed to save auth data to localStorage:', error);
      // Still set the state even if localStorage fails
      setIsAuthenticated(true);
      setUserEmail(email);
    }
  }, []);

  const loginWithGoogle = useCallback(() => {
    // Fallback to email login if Google OAuth is not configured
    login('user@google.com');
    router.push('/');
  }, [login, router]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(EMAIL_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear auth data from localStorage:', error);
    }
    
    setIsAuthenticated(false);
    setUserEmail(null);
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, isLoading, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 