import React, { useState } from 'react';
import { profileAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import styles from './profileCreation.module.css';

interface ProfileFormData {
  nickname: string;
  bio: string;
  profileImageUrl: string;
}

const ProfileCreation: React.FC = () => {
  const { refreshProfile } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    nickname: '',
    bio: '',
    profileImageUrl: '',
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

    // Enhanced validation
    if (!formData.bio.trim()) {
      setMessage('Please fill in your bio.');
      setMessageType('error');
      setIsSubmitting(false);
      return;
    }

    if (formData.bio.trim().length < 10) {
      setMessage('Bio must be at least 10 characters long.');
      setMessageType('error');
      setIsSubmitting(false);
      return;
    }

    if (formData.profileImageUrl && !isValidUrl(formData.profileImageUrl)) {
      setMessage('Please enter a valid URL for your profile image.');
      setMessageType('error');
      setIsSubmitting(false);
      return;
    }

    try {
      // Create profile with all supported fields
      const response = await profileAPI.createProfile({
        nickname: formData.nickname.trim(),
        bio: formData.bio.trim(),
        profileImageUrl: formData.profileImageUrl.trim()
      });

      // Refresh the profile in AuthContext for NavigationBar
      await refreshProfile();

      setMessage(`Profile created successfully! ${response}`);
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
      }, 3000);
      
    } catch (error: any) {
      console.error('Failed to create profile:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to create profile. Please try again.';
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to validate URL
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
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
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCreation;
