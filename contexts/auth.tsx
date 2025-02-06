import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter, useSegments } from 'expo-router';

type AuthContextType = {
  isAuthenticated: boolean | null;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === null) return;

    const inAuthGroup = segments[0] === 'auth';
    const inProtectedGroup = ['buyticket'].includes(segments[0]);

    if (!isAuthenticated && (inProtectedGroup || !inAuthGroup)) {
      router.replace('/auth/sign-in');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments]);

  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      setIsAuthenticated(!!token);
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const signIn = async (token: string) => {
    try {
      await SecureStore.setItemAsync('authToken', token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Ошибка при сохранении токена:', error);
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Ошибка при удалении токена:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
}; 