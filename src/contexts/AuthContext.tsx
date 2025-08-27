import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  connectWallet: () => Promise<void>;
  isWalletConnected: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const login = async (email: string, password: string): Promise<void> => {
    // Mock login - replace with real authentication later
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser = {
      id: '1',
      username: email.split('@')[0],
      email: email
    };
    setUser(mockUser);
    console.log('User logged in:', mockUser);
  };

  const signup = async (username: string, email: string, password: string): Promise<void> => {
    // Mock signup - replace with real authentication later
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser = {
      id: '1',
      username: username,
      email: email
    };
    setUser(mockUser);
    console.log('User signed up:', mockUser);
  };

  const logout = (): void => {
    setUser(null);
    setIsWalletConnected(false);
    console.log('User logged out');
  };

  const connectWallet = async (): Promise<void> => {
    // Mock wallet connection - replace with real wallet integration later
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsWalletConnected(true);
    console.log('Wallet Connected');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    connectWallet,
    isWalletConnected
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};