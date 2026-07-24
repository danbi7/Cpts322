import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import styles from './resetPassword.module.css';

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    newPassword: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setMessage('Invalid or missing reset token.');
      setMessageType('error');
    }
  }, [token]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setMessage('Invalid or missing reset token.');
      setMessageType('error');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      await authAPI.resetPassword(token, formData.newPassword);
      
      setMessage('Password has been reset successfully!');
      setMessageType('success');
      setPasswordReset(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error: any) {
      console.error('Password reset error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to reset password. The token may be invalid or expired.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  if (passwordReset) {
    return (
      <div className={styles.resetPasswordPage}>
        <h1 className={styles.logo}>CrimsonConnect</h1>
        <div className={styles.resetPasswordContainer}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.title}>Password Reset Successful</h2>
          
          <div className={`${styles.message} ${styles.messageSuccess}`}>
            Your password has been successfully reset.
          </div>

          <div className={styles.instructions}>
            <p>You can now log in with your new password.</p>
            <p>Redirecting to login page...</p>
          </div>

          <div className={styles.actions}>
            <Link to="/login" className={styles.loginLink}>
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.resetPasswordPage}>
      <h1 className={styles.logo}>CrimsonConnect</h1>
      <div className={styles.resetPasswordContainer}>
        <h2 className={styles.title}>Reset Password</h2>
        <p className={styles.subtitle}>
          Enter your new password below.
        </p>

        {message && (
          <div className={`${styles.message} ${styles[`message${messageType.charAt(0).toUpperCase() + messageType.slice(1)}`]}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.resetPasswordForm}>
          <div className={styles.formGroup}>
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              className={`${styles.passwordInput} ${errors.newPassword ? styles.errorInput : ''}`}
            />
            {errors.newPassword && (
              <span className={styles.errorMessage}>{errors.newPassword}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`${styles.passwordInput} ${errors.confirmPassword ? styles.errorInput : ''}`}
            />
            {errors.confirmPassword && (
              <span className={styles.errorMessage}>{errors.confirmPassword}</span>
            )}
          </div>

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading || !token}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Remember your password? <Link to="/login" className={styles.backToLoginLink}>Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
