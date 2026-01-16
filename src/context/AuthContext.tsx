import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthMethod = 'email' | 'wallet';

export interface User {
  id: string;
  email?: string;
  walletAddress?: string;
  name: string;
  authMethod: AuthMethod;
  companyId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithWallet: (walletAddress: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AUTH_STORAGE_KEY = '@auth_user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      // Simulate email authentication
      // In production, this would call your authentication API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: User = {
        id: `email_${Date.now()}`,
        email,
        name: email.split('@')[0],
        authMethod: 'email',
      };

      setUser(newUser);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch (error) {
      console.error('Error logging in with email:', error);
      throw error;
    }
  };

  const loginWithWallet = async (walletAddress: string) => {
    try {
      // Simulate wallet authentication
      await new Promise(resolve => setTimeout(resolve, 500));

      const newUser: User = {
        id: `wallet_${Date.now()}`,
        walletAddress,
        name: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        authMethod: 'wallet',
      };

      setUser(newUser);
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    } catch (error) {
      console.error('Error logging in with wallet:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    loginWithEmail,
    loginWithWallet,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
