import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import styles from './forgotPassword.module.css';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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
      await authAPI.requestPasswordReset(formData.email);
      
      setMessage('Password reset email sent! Please check your inbox.');
      setMessageType('success');
      setEmailSent(true);
      
    } catch (error: any) {
      console.error('Password reset request error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to send password reset email. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className={styles.forgotPasswordPage}>
        <h1 className={styles.logo}>CrimsonConnect</h1>
        <div className={styles.forgotPasswordContainer}>
          <h2 className={styles.title}>Check Your Email</h2>
          
          <div className={`${styles.message} ${styles.messageSuccess}`}>
            We've sent a password reset link to {formData.email}
          </div>

          <div className={styles.instructions}>
            <p>Please check your email and click the link to reset your password.</p>
            <p>The link will expire in 1 hour.</p>
          </div>

          <div className={styles.actions}>
            <Link to="/login" className={styles.backToLoginLink}>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.forgotPasswordPage}>
      <h1 className={styles.logo}>CrimsonConnect</h1>
      <div className={styles.forgotPasswordContainer}>
        <h2 className={styles.title}>Forgot Password</h2>
        <p className={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {message && (
          <div className={`${styles.message} ${styles[`message${messageType.charAt(0).toUpperCase() + messageType.slice(1)}`]}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.forgotPasswordForm}>
          <div className={styles.formGroup}>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className={styles.emailInput}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Remember your password? <Link to="/login" className={styles.loginLink}>Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
