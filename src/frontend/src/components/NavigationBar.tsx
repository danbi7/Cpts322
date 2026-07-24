import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './NavigationBar.module.css';

interface NavigationBarProps {
  className?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ className, searchValue, onSearchChange, onSearchSubmit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userProfile, logout } = useAuth();
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSettingsDropdown(false);
      }
    };

    if (showSettingsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showSettingsDropdown]);

  return (
    <nav className={`${styles.navbar} ${className || ''}`}>
      <div className={styles.navbarContent}>
        {/* Logo and Navigation Links */}
        <div className={styles.leftSection}>
          <button 
            onClick={handleLogoClick}
            className={styles.logo}
          >
            CrimsonConnect
          </button>
          
        </div>

        {/* Search Bar (only on dashboard routes) */}
        {location.pathname.startsWith('/dashboard') && (
          <div className={styles.searchSection}>
            <div className={styles.searchWrapper}>
              <svg 
                className={styles.searchIcon}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className={styles.searchInput}
                value={searchValue ?? ''}
                onChange={(e) => onSearchChange?.(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSearchSubmit?.(searchValue ?? '');
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Icons */}
        <div className={styles.rightSection}>
          <button className={styles.iconButton}>
            <svg 
              className={styles.notificationIcon}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className={styles.notificationBadge}></span>
          </button>
          
          <div className={styles.settingsContainer} ref={dropdownRef}>
            <button 
              className={styles.iconButton}
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            >
              <svg 
                className={styles.settingsIcon}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {showSettingsDropdown && (
              <div className={styles.settingsDropdown}>
                <button 
                  className={styles.dropdownItem}
                  onClick={handleLogout}
                >
                  <svg 
                    className={styles.dropdownIcon}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
          
          {/* Profile Picture */}
          <button 
            onClick={() => handleNavigation('/profile')}
            className={styles.profilePictureButton}
          >
            <div className={styles.profilePicture}>
              {userProfile?.profileImageUrl ? (
                <img 
                  src={userProfile.profileImageUrl} 
                  alt="Profile" 
                  className={styles.profileImage}
                />
              ) : (
                <div className={styles.profileImagePlaceholder}>
                  {userProfile ? getInitials(userProfile.firstName, userProfile.lastName) : 'U'}
                </div>
              )}
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
