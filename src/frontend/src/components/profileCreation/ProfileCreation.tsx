import React, { useState } from 'react';
import { profileAPI } from '../../services/api';
import styles from './profileCreation.module.css';

interface ProfileFormData {
  nickname: string;
  bio: string;
  profileImageUrl: string;
}

const ProfileCreation: React.FC = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    nickname: '',
    bio: '',
    profileImageUrl: '',
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    // Basic validation
    if (!formData.bio.trim()) {
      setMessage('Please fill in your bio.');
      setMessageType('error');
      return;
    }

    try {
      // Update profile with all supported fields
      await profileAPI.updateProfile({
        nickname: formData.nickname,
        bio: formData.bio,
        profileImageUrl: formData.profileImageUrl
      });

      setMessage('Profile created successfully!');
      setMessageType('success');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          nickname: '',
          bio: '',
          profileImageUrl: '',
        });
        setMessage('');
        setMessageType('');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to create profile:', error);
      setMessage('Failed to create profile. Please try again.');
      setMessageType('error');
    }
  };

  return (
    <div className={styles.profileCreationPage}>
      <h1 className={styles.logo}>CrimsonConnect</h1>
      <div className={styles.profileContainer}>
        <h2 className={styles.title}>Create Your Profile</h2>
        <p className={styles.subtitle}>Tell us about yourself to get started</p>

        {message && (
          <div className={`${styles.message} ${styles[`message${messageType.charAt(0).toUpperCase() + messageType.slice(1)}`]}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Profile Information</h3>
            
            <div className={styles.formGroup}>
              <label htmlFor="nickname" className={styles.label}>
                Nickname
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                placeholder="Enter your nickname"
                value={formData.nickname}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="bio" className={styles.label}>
                Bio <span className={styles.required}>*</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio}
                onChange={handleChange}
                className={styles.textarea}
                rows={4}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="profileImageUrl" className={styles.label}>
                Profile Image URL
              </label>
              <input
                type="url"
                id="profileImageUrl"
                name="profileImageUrl"
                placeholder="https://example.com/your-image.jpg"
                value={formData.profileImageUrl}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.createButton}
          >
            Create Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreation;
