import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import NavigationBar from '../NavigationBar';
import { studyGroupAPI, StudyGroupResponse } from '../../services/api';
import styles from './dashboard.module.css';

// Type Definitions
interface JoinButtonState {
  text: string;
  disabled: boolean;
  variant: 'success' | 'disabled' | 'pending' | 'private' | 'public';
}

type FilterType = 'popular' | 'newest' | 'myGroup' | 'calendar';
type CategoryType = 'all' | 'cs' | 'math' | 'science' | 'humanities';

const Dashboard: React.FC = () => {
  const { userId } = useAuth();
  
  // State for study groups
  const [studyGroups, setStudyGroups] = useState<StudyGroupResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Filter and search state
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('popular');
  // Backend handles filtering/sorting; category is not used client-side
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroupResponse | null>(null);
  
  // Message state
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  
  // Fetch study groups from API
  useEffect(() => {
    const fetchStudyGroups = async () => {
      if (!userId) {
        console.log('No userId available');
        return;
      }
      
      try {
        setLoading(true);
        setError('');
        console.log('Fetching study groups with userId:', userId);
        const response = await studyGroupAPI.getStudyGroups(
          userId, 
          searchQuery || undefined, 
          currentPage, 
          10,
          selectedFilter
        );
        let groups = response.groups;

        // Secondary pass: if backend doesn't flag membership but user is admin, treat as member
        try {
          const checks = await Promise.all(
            groups.map(async (g) => {
              if (g.member) return { id: g.groupId, isAdmin: false };
              try {
                const admin = await studyGroupAPI.isAdmin(g.groupId, Number(userId));
                return { id: g.groupId, isAdmin: admin };
              } catch {
                return { id: g.groupId, isAdmin: false };
              }
            })
          );
          const adminSet = new Set(checks.filter(c => c.isAdmin).map(c => c.id));
          if (adminSet.size > 0) {
            groups = groups.map(g => adminSet.has(g.groupId) ? { ...g, member: true } : g);
          }
        } catch {}

        if (selectedFilter === 'myGroup') {
          groups = groups.filter(g => g.member);
        }
        if (selectedFilter === 'myGroup') {
          groups = groups.filter((g: any) => g.member === true || g.isMember === true);
        }
        setStudyGroups(groups);
        setTotalPages(response.pagination.totalPages);
      } catch (err: any) {
        console.error('Failed to fetch study groups:', err);
        setError('Failed to load study groups. Please try again.');
        setStudyGroups([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudyGroups();
  }, [userId, searchQuery, currentPage, selectedFilter]);

  useEffect(() => {
    // Reset page on filter change to avoid empty pages
    setCurrentPage(1);
  }, [selectedFilter]);

  // Use server-paginated and filtered results directly

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle modal operations
  const openGroupModal = (group: StudyGroupResponse) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
  };

  // Get join button state for a group
  const getJoinButtonState = (group: StudyGroupResponse): JoinButtonState => {
    if (group.member) {
      return { text: 'View Group', disabled: false, variant: 'success' };
    }
    if (group.memberCount >= group.maxMembers) {
      return { text: 'Group Full', disabled: true, variant: 'disabled' };
    }
    if (group.hasPendingRequest) {
      return { text: 'Request Pending', disabled: true, variant: 'pending' };
    }
    if (group.private) {
      return { text: 'Send Join Request', disabled: false, variant: 'private' };
    }
    return { text: 'Join Now', disabled: false, variant: 'public' };
  };

  // Handle join group action
  const handleJoinAction = async (group: StudyGroupResponse) => {
    const buttonState = getJoinButtonState(group);
    if (buttonState.disabled) return;

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      await studyGroupAPI.joinStudyGroup(group.groupId, Number(userId));
      const refreshedGroup = await studyGroupAPI.getStudyGroup(group.groupId, Number(userId));
      setStudyGroups(prev => prev.map(g => g.groupId === group.groupId ? refreshedGroup : g));
      setSelectedGroup(refreshedGroup);
      setMessage('Membership updated!');
      setMessageType('success');
    } catch (error: any) {
      setMessage('Failed to join group. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className={styles.dashboardContainer}>
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Main Content */}
      <main className={styles.main}>
        {/* Message Display */}
        {message && (
          <div className={`${styles.message} ${styles[`message${messageType.charAt(0).toUpperCase() + messageType.slice(1)}`]}`}>
            {message}
          </div>
        )}

        {/* Filter Buttons */}
        <div className={styles.filterButtons}>
          <button
            onClick={() => setSelectedFilter('popular')}
            className={`${styles.filterButton} ${selectedFilter === 'popular' ? styles.active : styles.inactive}`}
          >
            Popular
          </button>
          <button
            onClick={() => setSelectedFilter('newest')}
            className={`${styles.filterButton} ${selectedFilter === 'newest' ? styles.active : styles.inactive}`}
          >
            Newest
          </button>
          <button
            onClick={() => setSelectedFilter('myGroup')}
            className={`${styles.filterButton} ${selectedFilter === 'myGroup' ? styles.active : styles.inactive}`}
          >
            My Groups
          </button>
          <button
           // onClick={() => setSelectedFilter('calendar')}
            className={`${styles.filterButton} ${selectedFilter === 'calendar' ? styles.gray : styles.gray}`}
          >
            Calendar
          </button>
          <button
            onClick={() => window.location.href = '/create-group'}
            className={styles.createGroupButton}
          >
            <svg className={styles.plusIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create New Group
          </button>
        </div>

        {/* Study Groups Grid */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading study groups...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <svg className={styles.errorIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className={styles.errorText}>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : studyGroups.length > 0 ? (
          <div className={styles.groupsGrid}>
            {studyGroups.map((group) => (
              <div
                key={group.groupId}
                onClick={() => openGroupModal(group)}
                className={styles.groupCard}
              >
                <div className={styles.groupCardHeader}>
                  <h3 className={styles.groupName}>{group.name}</h3>
                  {group.private && (
                    <svg className={styles.lockIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
                <p className={styles.groupDescription}>{group.description}</p>
                <div className={styles.groupTags}>
                  {group.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className={styles.groupFooter}>
                  <span className={styles.memberCount}>
                    <svg className={styles.memberIcon} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    {`${group.memberCount}/${group.maxMembers}`}
                  </span>
                  {group.hasPendingRequest ? (
                      <span className={styles.pendingBadge}>Pending</span>
                    ) : group.member ? (
                      <span className={styles.memberBadge}>Member</span>
                    ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>No study groups found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={styles.paginationButton}
            >
              &lt;&lt; Previous
            </button>

            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`${styles.pageNumber} ${currentPage === page ? styles.active : ''}`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className={styles.pageEllipsis}>...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={styles.paginationButton}
            >
              Next &gt;&gt;
            </button>
          </div>
        )}
      </main>

      {/* Group Detail Modal */}
      {isModalOpen && selectedGroup && (
        <div 
          className={styles.modalOverlay}
          onClick={closeModal}
        >
          <div 
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalContent}>
              {/* Modal Header */}
              <div className={styles.modalHeader}>
                <div className={styles.modalHeaderContent}>
                  <div className={styles.modalTitle}>
                    <h2 className={styles.modalTitleText}>{selectedGroup.name}</h2>
                    {selectedGroup.private && (
                      <svg className={styles.modalLockIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                  <div className={styles.modalTags}>
                    {selectedGroup.tags.map((tag, index) => (
                      <span key={index} className={styles.modalTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className={styles.closeButton}
                >
                  <svg className={styles.closeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className={styles.modalBody}>
                <h3 className={styles.modalSectionTitle}>About This Group</h3>
                <p className={styles.modalDescription}>{selectedGroup.fullDescription}</p>
              </div>

              {/* Group Stats */}
              <div className={styles.modalStats}>
                <div className={styles.statItem}>
                  <p className={styles.statLabel}>Members</p>
                  <p className={styles.statValue}>
                    {selectedGroup.memberCount}/{selectedGroup.maxMembers}
                  </p>
                </div>
                <div className={styles.statItem}>
                  <p className={styles.statLabel}>Type</p>
                  <p className={styles.statValue}>
                    {selectedGroup.private ? 'Private' : 'Public'}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className={styles.modalActions}>
                {(() => {
                  const buttonState = getJoinButtonState(selectedGroup);
                  // Determine if current user is the creator for navigation logic
                  let isCreatorGroup = false;
                  try {
                    const createdIds = JSON.parse(localStorage.getItem('createdGroupIds') || '[]');
                    if (Array.isArray(createdIds)) {
                      isCreatorGroup = createdIds.includes(selectedGroup.groupId);
                    }
                  } catch {}
                  return (
                    <button
                      onClick={() => {
                        if (selectedGroup.member || isCreatorGroup) {
                          // If user is already a member, go to group page
                          closeModal();
                          window.location.href = `/group/${selectedGroup.groupId}`;
                        } else {
                          // If not a member, show join functionality (not implemented yet)
                          handleJoinAction(selectedGroup);
                        }
                      }}
                      disabled={buttonState.disabled || loading}
                      className={`${styles.joinButton} ${styles[buttonState.variant]}`}
                    >
                      {loading ? 'Processing...' : buttonState.text}
                    </button>
                  );
                })()}
                <button
                  onClick={closeModal}
                  className={styles.modalCloseButton}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;