"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_KEY = 'ustad_siana_auth';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    try {
      const authData = localStorage.getItem(AUTH_KEY);
      setIsAuthenticated(!!authData);
    } catch (error) {
      // localStorage is not available (e.g., SSR, private browsing)
      setIsAuthenticated(false);
    }
  }, []);

  const login = useCallback((redirectPath: string = '/admin/dashboard') => {
    localStorage.setItem(AUTH_KEY, 'true');
    setIsAuthenticated(true);
    router.push(redirectPath);
  }, [router]);

  const logout = useCallback((redirectPath: string = '/admin/login') => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    router.push(redirectPath);
  }, [router]);

  return { isAuthenticated, login, logout };
}
