import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tokenManager, profileAPI, ProfileResponse } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
  userProfile: ProfileResponse | null;
  refreshProfile: () => Promise<ProfileResponse | null>;
  userId: number | null;
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
  const [userId, setUserId] = useState<number | null>(null);

  const fetchUserProfile = async () => {
    try {
      const profile = await profileAPI.getProfile();
      console.log('AuthContext: Fetched profile:', profile);
      setUserProfile(profile);
      // Extract userId from JWT token
      const token = tokenManager.getToken();
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.userId;
          if (userId) {
            setUserId(parseInt(userId.toString(), 10));
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      }
      return profile;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setUserProfile(null);
      return null;
    }
  };

  useEffect(() => {
    // Check if user is already authenticated on app load
    const initAuth = async () => {
      const token = tokenManager.getToken();
      if (token) {
        setIsAuthenticated(true);
        await fetchUserProfile();
      }
      setLoading(false);
    };
    
    initAuth();
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
    setUserId(null);
  };

  const refreshProfile = async () => {
    if (isAuthenticated) {
      return await fetchUserProfile();
    }
    return null;
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading,
    userProfile,
    refreshProfile,
    userId,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
