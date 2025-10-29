import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../NavigationBar';
import styles from './createGroup.module.css';

interface FormData {
  name: string;
  description: string;
  fullDescription: string;
  tags: string[];
  maxMembers: number;
  isPrivate: boolean;
  category: string;
  courseCode: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  fullDescription?: string;
  maxMembers?: string;
  category?: string;
}

interface StudyGroupRequest {
  name: string;
  description: string;
  fullDescription: string;
  tags: string[];
  maxMembers: number;
  isPrivate: boolean;
}

const CreateGroup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    fullDescription: '',
    tags: [],
    maxMembers: 20,
    isPrivate: false,
    category: '',
    courseCode: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Computer Science',
    'Mathematics',
    'Science',
    'Humanities',
    'Engineering',
    'Business',
    'Arts',
    'Social Sciences',
    'Other'
  ];

  const handleInputChange = (field: keyof FormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Group name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!formData.fullDescription.trim()) {
      newErrors.fullDescription = 'Full description is required';
    } else if (formData.fullDescription.trim().length < 20) {
      newErrors.fullDescription = 'Full description must be at least 20 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.maxMembers === 0) {
      newErrors.maxMembers = 'Max members is required';
    } else if (formData.maxMembers < 2 || formData.maxMembers > 100) {
      newErrors.maxMembers = 'Max members must be between 2 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, action: 'create' | 'draft') => {
    e.preventDefault();
    
    if (action === 'create' && !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create tags array from category and course code
      const tags: string[] = [];
      if (formData.category) tags.push(formData.category);
      if (formData.courseCode.trim()) tags.push(formData.courseCode.trim());
      
      // Create request object matching backend structure
      const studyGroupRequest: StudyGroupRequest = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        fullDescription: formData.fullDescription.trim(),
        tags,
        maxMembers: formData.maxMembers,
        isPrivate: formData.isPrivate
      };
      
      // TODO: Replace with actual API call
      // await createStudyGroup(studyGroupRequest);
      
      if (action === 'create') {
        // Redirect to dashboard or group page
        navigate('/dashboard');
      } else {
        // TODO: Implement draft save functionality
        // await saveDraft(studyGroupRequest);
      }
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const getPreviewDescription = () => {
    if (!formData.description) {
      return 'Your group description will appear here...';
    }
    return formData.description.length > 100 
      ? formData.description.substring(0, 100) + '...'
      : formData.description;
  };

  return (
    <div className={styles.createGroupContainer}>
      <NavigationBar />
      
      {/* Header Banner */}
      <div className={styles.headerBanner}>
        <div className={styles.headerContent}>
          <div className={styles.headerText}>
            <h1 className={styles.headerTitle}>Create New Study Group</h1>
            <p className={styles.headerSubtitle}>
              Build a collaborative learning community for your course
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentGrid}>
          {/* Left Column - Form */}
          <div className={styles.formColumn}>
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>Basic Information</h2>
              
              <form onSubmit={(e) => handleSubmit(e, 'create')} className={styles.form}>
                {/* Group Name */}
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.label}>
                    Group Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., CS 320 - Algorithm Study Group"
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  />
                  <div className={styles.textareaFooter}>
                  <p className={styles.helperText}>
                    Use a clear, descriptive name that includes the course code
                  </p>
                  </div>
                  {errors.name && (
                    <p className={styles.errorText}>{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div className={styles.formGroup}>
                  <label htmlFor="description" className={styles.label}>
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the purpose of your study group, what topics you'll cover, and what members can expect..."
                    className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                    rows={4}
                    maxLength={500}
                  />
                  <div className={styles.textareaFooter}>
                    <span className={styles.characterCount}>
                      {formData.description.length}/500 characters
                    </span>
                  </div>
                  {errors.description && (
                    <p className={styles.errorText}>{errors.description}</p>
                  )}
                </div>

                {/* Full Description */}
                <div className={styles.formGroup}>
                  <label htmlFor="fullDescription" className={styles.label}>
                    Full Description *
                  </label>
                  <textarea
                    id="fullDescription"
                    value={formData.fullDescription}
                    onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                    placeholder="Provide a detailed description of your study group, including meeting schedules, study materials, group rules, and what members can expect to learn..."
                    className={`${styles.textarea} ${errors.fullDescription ? styles.inputError : ''}`}
                    rows={5}
                    maxLength={1000}
                  />
                  <div className={styles.textareaFooter}>
                    <span className={styles.characterCount}>
                      {formData.fullDescription.length}/1000 characters
                    </span>
                  </div>
                  {errors.fullDescription && (
                    <p className={styles.errorText}>{errors.fullDescription}</p>
                  )}
                </div>

                {/* Category and Course Code */}
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="category" className={styles.label}>
                      Category *
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className={`${styles.select} ${errors.category ? styles.inputError : ''}`}
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className={styles.errorText}>{errors.category}</p>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="courseCode" className={styles.label}>
                      Course Code
                    </label>
                    <input
                      type="text"
                      id="courseCode"
                      value={formData.courseCode}
                      onChange={(e) => handleInputChange('courseCode', e.target.value)}
                      placeholder="e.g., CS 320"
                      className={styles.input}
                    />
                  </div>
                </div>

              </form>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className={styles.previewColumn}>
            <div className={styles.previewSection}>
              <h2 className={styles.sectionTitle}>Preview</h2>
              
              <div className={styles.previewCard}>
                <div className={styles.previewCardHeader}>
                  <div className={styles.previewIcon}>
                    <svg className={styles.peopleIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <h3 className={styles.previewTitle}>
                    {formData.name || 'Your Group Name'}
                  </h3>
                </div>
                
                {formData.category && (
                  <div className={styles.previewTag}>
                    {formData.category}
                  </div>
                )}
                
                <p className={styles.previewDescription}>
                  {getPreviewDescription()}
                </p>
                
                <div className={styles.previewFooter}>
                  <span className={styles.previewMemberCount}>
                    <svg className={styles.memberIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    0/{formData.maxMembers} members
                  </span>
                  <div className={styles.previewPrivacyTag}>
                    {formData.isPrivate ? 'Private' : 'Public'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={styles.actionButtons}>
                <button
                  onClick={(e) => handleSubmit(e, 'create')}
                  disabled={isSubmitting}
                  className={styles.createButton}
                >
                  <svg className={styles.plusIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {isSubmitting ? 'Creating...' : 'Create Group'}
                </button>
                
                <button
                  onClick={(e) => handleSubmit(e, 'draft')}
                  disabled={isSubmitting}
                  className={styles.draftButton}
                >
                  Save as Draft
                </button>
              </div>
            </div>
          </div>

          {/* Group Settings Card - Separate from Basic Information */}
          <div className={styles.groupSettingsCard}>
            <div className={styles.groupSettingsSection}>
              <h2 className={styles.sectionTitle}>Group Settings</h2>
              
              {/* Max Members */}
              <div className={styles.settingsField}>
                <div className={styles.maxMembersContainer}>
                  <label htmlFor="maxMembers" className={styles.label}>
                    Max Members
                  </label>
                  <input
                    type="number"
                    id="maxMembers"
                    value={formData.maxMembers}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        handleInputChange('maxMembers', 0);
                      } else {
                        const numValue = parseInt(value);
                        if (!isNaN(numValue)) {
                          handleInputChange('maxMembers', numValue);
                        }
                      }
                    }}
                    min="2"
                    max="100"
                    className={`${styles.input} ${errors.maxMembers ? styles.inputError : ''}`}
                  />
                </div>
                <p className={styles.helperText}>
                  Maximum number of members (2-100)
                </p>
                {errors.maxMembers && (
                  <p className={styles.errorText}>{errors.maxMembers}</p>
                )}
              </div>

              {/* Privacy */}
              <div className={styles.settingsField}>
                <h3 className={styles.privacyLabel}>Privacy</h3>
                <div className={styles.privacyCards}>
                  <div 
                    className={`${styles.privacyCard} ${!formData.isPrivate ? styles.privacyCardSelected : ''}`}
                    onClick={() => handleInputChange('isPrivate', false)}
                  >
                    <div className={styles.privacyIcon}>
                      <svg className={styles.globeIcon} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                      </svg>
                    </div>
                    <h3 className={styles.privacyTitle}>Public</h3>
                    <p className={styles.privacyDescription}>Anyone can find and join this group</p>
                  </div>

                  <div 
                    className={`${styles.privacyCard} ${formData.isPrivate ? styles.privacyCardSelected : ''}`}
                    onClick={() => handleInputChange('isPrivate', true)}
                  >
                    <div className={styles.privacyIcon}>
                      <svg className={styles.lockIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className={styles.privacyTitle}>Private</h3>
                    <p className={styles.privacyDescription}>Members must be invited or approved</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
