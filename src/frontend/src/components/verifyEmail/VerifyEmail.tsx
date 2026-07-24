import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';
import styles from './verifyEmail.module.css';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      try {
        await authAPI.verifyEmail(token);
        setStatus('success');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
        
      } catch (error: any) {
        setStatus('error');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className={styles.verifyEmailPage}>
      <div className={styles.verifyEmailContainer}>
        <h1 className={styles.logo}>CrimsonConnect</h1>
        {status === 'verifying' && (
          <>
            <div className={styles.loadingSpinner}></div>
            <h2 className={styles.title}>Verifying...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className={styles.successIcon}>✓</div>
            <h2 className={styles.title}>Email Verified</h2>
            <p className={styles.subtitle}>Redirecting to login...</p>
            <Link to="/login" className={styles.link}>Go to Login</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className={styles.errorIcon}>✕</div>
            <h2 className={styles.title}>Verification Failed</h2>
            <p className={styles.subtitle}>Link expired or invalid</p>
            <Link to="/login" className={styles.link}>Go to Login</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;

