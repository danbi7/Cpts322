import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authAPI, SignupRequest } from '../../services/api';
import styles from './signup.module.css'

const SignupPage: React.FC = () => {
  useEffect(() => {
    document.body.classList.add('signup-active');
    return () => {
      document.body.classList.remove('signup-active');
    };
  }, []);

  const [formData, setFormData] = useState<SignupRequest>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');

  // Check for verification token in URL 
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setVerificationToken(token);
      setShowVerification(true);
      handleEmailVerification(token);
    }
  }, []);

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
      await authAPI.signup(formData);
      setMessage('Account created successfully! Please check your email for verification instructions.');
      setMessageType('success');
      setShowVerification(true);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
      });
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Registration failed. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Handle email verification
  const handleEmailVerification = async (token: string) => {
    try {
      await authAPI.verifyEmail(token);
      setMessage('Email verified successfully! You can now log in to your account.');
      setMessageType('success');
      setShowVerification(false);
    } catch (error: any) {
      setMessage('Email verification failed. The link may be expired or invalid.');
      setMessageType('error');
    }
  };

  // Resend verification email
  const handleResendVerification = async () => {
    if (!formData.email) {
      setMessage('Please enter your email address first.');
      setMessageType('error');
      return;
    }

    try {
      await authAPI.resendVerification(formData.email);
      setMessage('Verification email sent! Please check your inbox.');
      setMessageType('success');
    } catch (error: any) {
      setMessage('Failed to resend verification email. Please try again.');
      setMessageType('error');
    }
  };

  if (showVerification) {
    return (
      <div className={styles.signupPage}>
        <h1 className={styles.logo}>CrimsonConnect</h1>
        <div className={styles.signupContainer}>
          <h2 className={styles.title}>Email Verification</h2>
          
          {message && (
            <div className={`${styles.message} ${styles[`message${messageType.charAt(0).toUpperCase() + messageType.slice(1)}`]}`}>
              {message}
            </div>
          )}

          {!verificationToken && (
            <div className={styles.verificationInfo}>
              <p>We've sent a verification link to your email address.</p>
              <p>Please check your inbox and click the link to verify your account.</p>
              
              <button 
                onClick={handleResendVerification}
                className={styles.resendButton}
              >
                Resend Verification Email
              </button>
            </div>
          )}
          <Link to="/login" className={styles.loginLink}>Sign in here</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.signupPage}>
      <h1 className={styles.logo}>CrimsonConnect</h1>
      <div className={styles.signupContainer}>
        <h2 className={styles.title}>Create Your Account</h2>

        {message && (
          <div className={`${styles.message} ${styles[`message${messageType.charAt(0).toUpperCase() + messageType.slice(1)}`]}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="signup-form">
          <div className={styles.formGroup}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />  
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
              minLength={8}
            />
          </div>

          <button 
            type="submit" 
            className={styles.signupButton}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className={styles.signupFooter}>
          <p>Already have an account? <Link to="/login" className={styles.loginLink}>Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
