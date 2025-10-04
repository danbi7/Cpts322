import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './login.module.css'

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
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
      // *Implement actual login API call when backend is ready*
      console.log('Login attempt:', formData);
      
      // Fake API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage('Login successful! (test message)');
      setMessageType('success');
      
      // Reset form
      setFormData({
        email: '',
        password: '',
      });
    } catch (error: any) {
      setMessage('Login failed. Please check your email and password and try again.');
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
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
