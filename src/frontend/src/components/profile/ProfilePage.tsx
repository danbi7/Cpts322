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
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');

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
    
    // Enhanced validation
    if (!editForm.bio.trim()) {
      setMessage('Bio is required.');
      setMessageType('error');
      setSaving(false);
      return;
    }

    if (editForm.bio.trim().length < 10) {
      setMessage('Bio must be at least 10 characters long.');
      setMessageType('error');
      setSaving(false);
      return;
    }

    // If an image file was chosen, it has been validated client-side
    
    try {
      await profileAPI.updateProfile({
        nickname: editForm.nickname.trim(),
        bio: editForm.bio.trim(),
        profileImageUrl: editForm.profileImageUrl.trim()
      });
      
      // Refresh profile data from API
      const updatedProfile = await profileAPI.getProfile();
      setProfile(updatedProfile);
      
      await refreshProfile();
      
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setMessageType('success');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to update profile. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  // Handle image file selection for editing
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImageFile(file);
    if (!file) {
      setImagePreviewUrl('');
      return;
    }

    const isImage = file.type.startsWith('image/');
    const isSmallEnough = file.size <= 5 * 1024 * 1024;
    if (!isImage || !isSmallEnough) {
      setMessage(!isImage ? 'Please select a valid image file.' : 'Image must be 5MB or smaller.');
      setMessageType('error');
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      setImagePreviewUrl(dataUrl);
      setEditForm(prev => ({ ...prev, profileImageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
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

  const formatDate = (value: Date | string | number | null | undefined) => {
    if (!value) {
      return 'Not available';
    }
    const parsed = value instanceof Date ? value : new Date(value);
    if (isNaN(parsed.getTime())) {
      return 'Not available';
    }
    return parsed.toLocaleDateString('en-US', {
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
        <NavigationBar />
        <div className={styles.errorContainer}>
          <h2>Profile not found</h2>
          <p>It looks like you haven't created your profile yet.</p>
          <div className={styles.actionButtons}>
            <button 
              className={styles.createProfileButton}
              onClick={() => window.location.href = '/profile-creation'}
            >
              Create Profile
            </button>
            <button 
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      {/* Navigation Bar */}
      <NavigationBar />
      
      {/* Header Banner */}
      <div className={styles.headerBanner}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.headerTitle}>My Profile</h1>
            <p className={styles.headerSubtitle}>Manage your personal information and preferences</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentGrid}>
          {/* Profile Info Column */}
          <div className={styles.profileInfoColumn}>
            <h2 className={styles.sectionTitle}>Profile Information</h2>
            
            {/* Profile Image Section */}
            <div className={styles.profileImageSection}>
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
            </div>

            {/* Message Display */}
            {message && (
              <div className={`${styles.message} ${styles[`message${messageType.charAt(0).toUpperCase() + messageType.slice(1)}`]}`}>
                {message}
              </div>
            )}

            {/* Editable Fields */}
            <div className={styles.formField}>
              <label className={styles.formLabel}>Nickname</label>
              {isEditing ? (
                <input
                  type="text"
                  name="nickname"
                  value={editForm.nickname}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Enter your nickname"
                />
              ) : (
                <p className={styles.displayText}>
                  {profile.nickname || 'No nickname set'}
                </p>
              )}
            </div>

            <div className={styles.formField}>
              <label className={styles.formLabel}>Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className={styles.displayText}>
                  {profile.bio || 'No bio available'}
                </p>
              )}
            </div>

            {isEditing && (
              <div className={styles.formField}>
                <label className={styles.formLabel}>Profile Image</label>
                <div className={styles.fileUploadRow}>
                  <input
                    type="file"
                    id="editProfileImageFile"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.fileInputHidden}
                  />
                  <label htmlFor="editProfileImageFile" className={styles.uploadButton}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    {selectedImageFile ? 'Change Image' : 'Choose Image'}
                  </label>
                  <div className={styles.uploadMeta}>
                    <span className={styles.fileName}>{selectedImageFile ? selectedImageFile.name : 'No file chosen'}</span>
                    <span className={styles.uploadHint}>PNG, JPG up to 5MB</span>
                  </div>
                </div>
                {(imagePreviewUrl || editForm.profileImageUrl) && (
                  <div className={styles.imagePreviewWrapper}>
                    <img 
                      src={imagePreviewUrl || editForm.profileImageUrl} 
                      alt="Profile preview" 
                      className={styles.imagePreview}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              {!isEditing ? (
                <button className={styles.primaryButton} onClick={handleEdit}>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button 
                    className={styles.secondaryButton} 
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button 
                    className={styles.primaryButton} 
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Profile Details Column */}
          <div className={styles.profileDetailsColumn}>
            <h2 className={styles.sectionTitle}>Account Details</h2>
            
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Full Name</span>
              <span className={styles.detailValue}>{profile.firstName} {profile.lastName}</span>
            </div>
            
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Username</span>
              <span className={styles.detailValue}>@{profile.username}</span>
            </div>
            
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Email</span>
              <span className={styles.detailValue}>{profile.email}</span>
            </div>
            
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Member Since</span>
              <span className={styles.detailValue}>{formatDate(profile.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;