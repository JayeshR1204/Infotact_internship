import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Define the User Session Profile Type structure
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'HR Manager' | 'Employee';
  employeeId?: string;
}

// 2. Define the exact properties our application components can access globally
interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  loginSession: (token: string, userData: AuthUser) => void;
  logoutSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Automatically check local storage on application mount for a saved secure session
  useEffect(() => {
    const storedToken = localStorage.getItem('hrms_token');
    const storedUser = localStorage.getItem('hrms_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Commits an authorized user session token and data profile to memory and persistence layers
   */
  const loginSession = (jwtToken: string, userData: AuthUser) => {
    setToken(jwtToken);
    setUser(userData);
    localStorage.setItem('hrms_token', jwtToken);
    localStorage.setItem('hrms_user', JSON.stringify(userData));
  };
/**
   * Completely flushes the session contexts to prevent cross-account data leaking
   */
  const logoutSession = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('hrms_token');
    localStorage.removeItem('hrms_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginSession, logoutSession }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

/**
 * Custom React Hook to cleanly extract auth variables inside any UI component layout
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be executed within an explicit AuthProvider wrapper');
  }
  return context;
};
