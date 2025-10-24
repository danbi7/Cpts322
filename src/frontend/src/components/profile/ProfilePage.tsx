import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './profilePage.module.css';

interface ProfileData {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  nickname: string;
  bio: string;
  createdAt: Date;
  profileImageUrl: string;
}

const ProfilePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  // Mock profile data - replace with API call when ready
  useEffect(() => {
    const mockProfile: ProfileData = {
      username: "kenson05",
      firstName: "Kenneth",
      lastName: "Son",
      email: "kenneth.son@wsu.edu",
      nickname: "Kenny",
      bio: "Computer Science student at WSU. Love coding, studying algorithms, and helping fellow students. Always up for a study session!",
      createdAt: new Date('2024-01-15'),
      profileImageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg=="
    };
    
    setProfile(mockProfile);
    setLoading(false);
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
      // Mock API call - replace with actual API when ready
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          nickname: editForm.nickname,
          bio: editForm.bio,
          profileImageUrl: editForm.profileImageUrl
        });
      }
      
      setIsEditing(false);
      setMessage('Profile updated successfully!');
      setMessageType('success');
    } catch (error) {
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

  const formatDate = (date: Date) => {
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
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => window.history.back()}>
          ← Back
        </button>
        <h1 className={styles.pageTitle}>Profile</h1>
      </div>

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
  );
};

export default ProfilePage;
