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

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
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
