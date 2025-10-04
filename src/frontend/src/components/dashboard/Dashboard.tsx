import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './dashboard.module.css';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardContent}>
        <div className={styles.dashboardHeader}>
          <h1 className={styles.dashboardTitle}>CrimsonConnect</h1>
          <p className={styles.successMessage}>Logged in successfully!</p>
        </div>
        
        <button 
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;