import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import NavigationBar from '../NavigationBar';
import { profileAPI, ProfileResponse } from '../../services/api';
import styles from './profilePage.module.css';

const ProfilePage: React.FC = () => {
  const { isAuthenticated, logout, refreshProfile } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await profileAPI.getProfile();
        setProfile(profileData);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setMessage('Failed to load profile data');
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);

  const [editForm, setEditForm] = useState({
    nickname: '',
    bio: '',
    profileImageUrl: ''
  });

  useEffect(() => {
    if (profile) {
      setEditForm({
        nickname: profile.nickname || '',
        bio: profile.bio || '',
        profileImageUrl: profile.profileImageUrl || ''
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
    setMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditForm({
        nickname: profile.nickname || '',
        bio: profile.bio || '',
        profileImageUrl: profile.profileImageUrl || ''
      });
    }
    setMessage('');
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    
    try {
      await profileAPI.updateProfile({
        nickname: editForm.nickname,
        bio: editForm.bio,
        profileImageUrl: editForm.profileImageUrl
      });
      
      // Refresh profile data from API
      const updatedProfile = await profileAPI.getProfile();
      setProfile(updatedProfile);
      
      await refreshProfile();
      
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setMessage('Failed to update profile. Please try again.');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) {
      return 'Not available';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.profilePage}>
        <div className={styles.errorContainer}>
          <h2>Profile not found</h2>
          <p>Unable to load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      {/* Navigation Bar */}
      <NavigationBar />
      
      {/* Main Content */}
      <div className={styles.mainContent}>
      {/* Profile Card */}
      <div className={styles.profileCard}>
        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.profileImageContainer}>
            {profile.profileImageUrl ? (
              <img 
                src={profile.profileImageUrl} 
                alt="Profile" 
                className={styles.profileImage}
              />
            ) : (
              <div className={styles.profileImagePlaceholder}>
                {getInitials(profile.firstName, profile.lastName)}
              </div>
            )}
          </div>
          
          <div className={styles.profileInfo}>
            <h2 className={styles.profileName}>
              {profile.firstName} {profile.lastName}
            </h2>
            <p className={styles.profileUsername}>@{profile.username}</p>
            {profile.nickname && (
              <p className={styles.profileNickname}>"{profile.nickname}"</p>
            )}
          </div>

          <div className={styles.profileActions}>
            {!isEditing ? (
              <button className={styles.editButton} onClick={handleEdit}>
                Edit Profile
              </button>
            ) : (
              <div className={styles.editActions}>
                <button 
                  className={styles.cancelButton} 
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  className={styles.saveButton} 
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`${styles.message} ${styles[`message${messageType.charAt(0).toUpperCase() + messageType.slice(1)}`]}`}>
            {message}
          </div>
        )}

        {/* Profile Details */}
        <div className={styles.profileDetails}>
          <div className={styles.detailsGrid}>
            {/* Basic Information */}
            <div className={styles.detailSection}>
              <h3 className={styles.sectionTitle}>Basic Information</h3>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>First Name</label>
                <span className={styles.detailValue}>{profile.firstName}</span>
              </div>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Last Name</label>
                <span className={styles.detailValue}>{profile.lastName}</span>
              </div>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Email</label>
                <span className={styles.detailValue}>{profile.email}</span>
              </div>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Username</label>
                <span className={styles.detailValue}>@{profile.username}</span>
              </div>
            </div>

            {/* Editable Information */}
            <div className={styles.detailSection}>
              <h3 className={styles.sectionTitle}>Personal Details</h3>
              
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Nickname</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nickname"
                    value={editForm.nickname}
                    onChange={handleInputChange}
                    className={styles.editInput}
                    placeholder="Enter nickname"
                  />
                ) : (
                  <span className={styles.detailValue}>
                    {profile.nickname || 'Not set'}
                  </span>
                )}
              </div>

              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={editForm.bio}
                    onChange={handleInputChange}
                    className={styles.editTextarea}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                ) : (
                  <span className={styles.detailValue}>
                    {profile.bio || 'No bio provided'}
                  </span>
                )}
              </div>
            </div>

            {/* Account Information */}
            <div className={styles.detailSection}>
              <h3 className={styles.sectionTitle}>Account Information</h3>
              <div className={styles.detailItem}>
                <label className={styles.detailLabel}>Member Since</label>
                <span className={styles.detailValue}>
                  {formatDate(profile.createdAt)}
                </span>
              </div>
              <div className={styles.logoutSection}>
                <button 
                  onClick={logout}
                  className={styles.logoutButton}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className={styles.statsSection}>
          <h3 className={styles.sectionTitle}>Activity Stats</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>12</div>
              <div className={styles.statLabel}>Study Groups</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>45</div>
              <div className={styles.statLabel}>Posts</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>128</div>
              <div className={styles.statLabel}>Comments</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>89</div>
              <div className={styles.statLabel}>Upvotes</div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProfilePage;
