import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireProfile = true }) => {
  const { isAuthenticated, loading, userProfile } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Check authentication first
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if profile exists and is required
  if (requireProfile) {
    const hasProfile = userProfile && userProfile.bio && userProfile.bio.trim() !== '';
    
    if (!hasProfile) {
      // No profile exists - redirect to profile creation (unless already there)
      if (location.pathname !== '/profile-creation') {
        console.log('ProtectedRoute: No profile found, redirecting to profile creation. Profile:', userProfile);
        return <Navigate to="/profile-creation" replace />;
      }
    } else {
      // Profile exists - redirect away from profile creation to dashboard
      if (location.pathname === '/profile-creation') {
        console.log('ProtectedRoute: Profile exists, redirecting away from profile creation to dashboard');
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
