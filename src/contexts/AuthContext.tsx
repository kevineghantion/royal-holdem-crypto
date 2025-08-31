import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  connectWallet: () => Promise<void>;
  isWalletConnected: boolean;
  walletBalance: number;
  updateWalletBalance: (amount: number) => void;
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
  const [walletBalance, setWalletBalance] = useState(1250.75); // Mock initial balance

  const login = async (identifier: string, password: string, rememberMe: boolean = false): Promise<void> => {
    // Mock login - replace with real authentication later
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Determine if identifier is email or username
    const isEmail = identifier.includes('@');
    const mockUser = {
      id: '1',
      username: isEmail ? identifier.split('@')[0] : identifier,
      email: isEmail ? identifier : `${identifier}@casino.com`
    };
    
    setUser(mockUser);
    setWalletBalance(1250.75); // Set initial wallet balance
    
    // Mock JWT session handling
    if (rememberMe) {
      localStorage.setItem('remember_user', 'true');
      console.log('Remember me enabled - extended session (30 days)');
    } else {
      localStorage.removeItem('remember_user');
      console.log('Short session (2 hours)');
    }
    
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
    setWalletBalance(0);
    localStorage.removeItem('remember_user');
    console.log('User logged out');
  };

  const updateWalletBalance = (amount: number): void => {
    setWalletBalance(amount);
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
    isWalletConnected,
    walletBalance,
    updateWalletBalance
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};