import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import { authAPI, profileAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, userProfile } = useAuth();
  
  React.useEffect(() => {
    document.body.classList.add('login-active');
    return () => {
      document.body.classList.remove('login-active');
    };
  }, []);
  
  React.useEffect(() => {
    if (isAuthenticated) {
      // If user is authenticated but has no profile, go to profile creation
      if (!userProfile || !userProfile.bio) {
        navigate('/profile-creation');
      } else {
        // Otherwise go to dashboard
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, userProfile, navigate]);
  
  // Form data state
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await authAPI.login(formData);
      
      // Update authentication state
      await login(response.token);
      
      setMessage('Login successful! Redirecting...');
      setMessageType('success');
      
      // Reset form
      setFormData({
        email: '',
        password: '',
      });
      
      // Check if user has a profile
      try {
        const profile = await profileAPI.getProfile();
        // If profile exists but has no bio (profile not fully created), redirect to profile creation
        if (!profile || !profile.bio) {
          setTimeout(() => {
            navigate('/profile-creation');
          }, 1500);
        } else {
          // Profile exists, go to dashboard
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        }
      } catch (profileError) {
        // Profile doesn't exist, redirect to profile creation
        setTimeout(() => {
          navigate('/profile-creation');
        }, 1500);
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = 'Login failed. Please check your email and password and try again.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <h1 className={styles.logo}>CrimsonConnect</h1>
      <div className={styles.loginContainer}>
        <h2 className={styles.title}>Welcome Back</h2>

        {message && (
          <div className={`${styles.message} ${styles[`message${messageType.charAt(0).toUpperCase() + messageType.slice(1)}`]}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.loginFooter}>
          <p>Don't have an account? <Link to="/signup" className={styles.signupLink}>Sign up here</Link></p>
          <p><Link to="/forgot-password" className={styles.forgotPasswordLink}>Forgot your password?</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
