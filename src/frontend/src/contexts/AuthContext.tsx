import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tokenManager, profileAPI, ProfileResponse } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
  userProfile: ProfileResponse | null;
  refreshProfile: () => Promise<void>;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<ProfileResponse | null>(null);

  const fetchUserProfile = async () => {
    try {
      const profile = await profileAPI.getProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUserProfile(null);
    }
  };

  useEffect(() => {
    // Check if user is already authenticated on app load
    const token = tokenManager.getToken();
    if (token) {
      setIsAuthenticated(true);
      fetchUserProfile();
    }
    setLoading(false);
  }, []);

  const login = async (token: string) => {
    tokenManager.setToken(token);
    setIsAuthenticated(true);
    await fetchUserProfile();
  };

  const logout = () => {
    tokenManager.removeToken();
    setIsAuthenticated(false);
    setUserProfile(null);
  };

  const refreshProfile = async () => {
    if (isAuthenticated) {
      await fetchUserProfile();
    }
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading,
    userProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
