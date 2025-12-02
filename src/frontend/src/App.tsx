import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import SignupPage from './components/signup/signup';
import LoginPage from './components/login/login';
import Dashboard from './components/dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPasswordPage from './components/forgotPassword/forgotPassword';
import ResetPasswordPage from './components/resetPassword/resetPassword';
import VerifyEmailPage from './components/verifyEmail/VerifyEmail';
import GroupPage from './components/group/GroupPage';
import ProfilePage from './components/profile/ProfilePage';
import ProfileCreation from './components/profileCreation/ProfileCreation';
import CreateGroup from './components/createGroup/CreateGroup';
import UpdateGroup from './components/updateGroup/UpdateGroup';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route 
              path="/profile-creation" 
              element={
                <ProtectedRoute requireProfile={false}>
                  <ProfileCreation />
                </ProtectedRoute>
              } 
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/group/:groupId" 
              element={
                <ProtectedRoute>
                  <GroupPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-group" 
              element={
                <ProtectedRoute>
                  <CreateGroup />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/update-group/:groupId" 
              element={
                <ProtectedRoute>
                  <UpdateGroup />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
