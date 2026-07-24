import React, { useState } from 'react';
import { profileAPI, ProfileResponse } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './profileCreation.module.css';

interface ProfileFormData {
  nickname: string;
  bio: string;
  profileImageUrl: string;
}

const ProfileCreation: React.FC = () => {
  const navigate = useNavigate();
  const { refreshProfile } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    nickname: '',
    bio: '',
    profileImageUrl: '',
  });
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');

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

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedImageFile(file);
    if (!file) {
      setImagePreviewUrl('');
      setFormData(prev => ({ ...prev, profileImageUrl: '' }));
      return;
    }

    // Basic validation: type and size (<= 5MB)
    const isImage = file.type.startsWith('image/');
    const isSmallEnough = file.size <= 5 * 1024 * 1024;
    if (!isImage || !isSmallEnough) {
      setMessage(!isImage ? 'Please select a valid image file.' : 'Image must be 5MB or smaller.');
      setMessageType('error');
      setSelectedImageFile(null);
      setImagePreviewUrl('');
      setFormData(prev => ({ ...prev, profileImageUrl: '' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      setImagePreviewUrl(dataUrl);
      // Send base64 data URL to backend via existing profileImageUrl field
      setFormData(prev => ({ ...prev, profileImageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
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

    try {
      // Create profile with all supported fields (profileImageUrl may be a base64 data URL)
      const response = await profileAPI.createProfile({
        nickname: formData.nickname.trim(),
        bio: formData.bio.trim(),
        profileImageUrl: formData.profileImageUrl.trim()
      });

      // Refresh the profile in AuthContext and verify it loaded
      console.log('ProfileCreation: Refreshing profile...');
      const updatedProfile: ProfileResponse | null = await refreshProfile();
      console.log('ProfileCreation: Updated profile:', updatedProfile);

      if (!updatedProfile || !updatedProfile.bio) {
        setMessage('Profile created, but failed to load. Please refresh the page.');
        setMessageType('error');
        setIsSubmitting(false);
        return;
      }

      setMessage(`Profile created successfully! ${response}`);
      setMessageType('success');

      // Small delay to ensure context updates before navigation
      setTimeout(() => {
        navigate('/dashboard');
      }, 200);
      
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
              <label className={styles.label}>Profile Image</label>
              <div className={styles.fileUpload}>
                <input
                  type="file"
                  id="profileImageFile"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.fileInputHidden}
                />
                <label htmlFor="profileImageFile" className={styles.uploadButton}>
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
              {imagePreviewUrl && (
                <div className={styles.imagePreviewWrapper}>
                  <img src={imagePreviewUrl} alt="Profile preview" className={styles.imagePreview} />
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            className={styles.primaryButton}
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
