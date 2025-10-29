import React, { useState, useMemo } from 'react';
import NavigationBar from '../NavigationBar';
import styles from './dashboard.module.css';

// Type Definitions
interface StudyGroup {
  id: number;
  name: string;
  description: string;
  fullDescription: string;
  tags: string[];
  memberCount: number;
  maxMembers: number;
  isPrivate: boolean;
  isMember: boolean;
  hasPendingRequest: boolean;
  createdAt: Date;
}

interface JoinButtonState {
  text: string;
  disabled: boolean;
  variant: 'success' | 'disabled' | 'pending' | 'private' | 'public';
}

// Sample Data - Replace with actual API calls
const MOCK_GROUPS: StudyGroup[] = [
  {
    id: 1,
    name: "Cpts 322 - Software Engineering",
    description: "Weekly study sessions for SE concepts, project help, and exam prep.",
    fullDescription: "Join us for comprehensive coverage of software engineering principles, design patterns, and agile methodologies. We meet twice weekly for collaborative learning sessions, code reviews, and exam preparation. Perfect for students looking to excel in Cpts 322.",
    tags: ["Cpts 322", "CS", "Engineering"],
    memberCount: 12,
    maxMembers: 20,
    isPrivate: false,
    isMember: true,
    hasPendingRequest: false,
    createdAt: new Date('2025-01-15'),
  },
  {
    id: 2,
    name: "English 402 - Writing Workshop",
    description: "Peer review and writing practice for advanced composition.",
    fullDescription: "A collaborative space for students enrolled in English 402 to share their work, receive constructive feedback, and improve their writing skills. We focus on academic writing, creative pieces, and research papers.",
    tags: ["English 402", "Humanities", "Writing"],
    memberCount: 8,
    maxMembers: 15,
    isPrivate: true,
    isMember: false,
    hasPendingRequest: false,
    createdAt: new Date('2025-02-01'),
  },
  {
    id: 3,
    name: "Stat 360 - Statistical Analysis",
    description: "Master probability and statistics through collaborative problem solving.",
    fullDescription: "This group focuses on understanding statistical concepts, working through problem sets together, and preparing for exams. We use R and Python for data analysis projects and share helpful resources.",
    tags: ["Stat 360", "Math", "Statistics"],
    memberCount: 15,
    maxMembers: 15,
    isPrivate: false,
    isMember: false,
    hasPendingRequest: false,
    createdAt: new Date('2025-01-20'),
  },
  {
    id: 4,
    name: "CS 215 - Data Structures Study Group",
    description: "Learn algorithms and data structures through hands-on practice.",
    fullDescription: "Dive deep into data structures including trees, graphs, hash tables, and sorting algorithms. We work on coding challenges, review homework assignments, and prepare for technical interviews.",
    tags: ["CS 215", "CS", "Algorithms"],
    memberCount: 18,
    maxMembers: 25,
    isPrivate: false,
    isMember: false,
    hasPendingRequest: true,
    createdAt: new Date('2025-10-10'),
  },
  {
    id: 5,
    name: "Bio 101 - General Biology",
    description: "Study cellular processes, genetics, and evolution together.",
    fullDescription: "A supportive environment for Bio 101 students to review lecture materials, work through lab reports, and prepare for quizzes and exams. We share study guides and mnemonics to help with memorization.",
    tags: ["Bio 101", "Science", "Biology"],
    memberCount: 10,
    maxMembers: 20,
    isPrivate: false,
    isMember: false,
    hasPendingRequest: false,
    createdAt: new Date('2025-01-10'),
  },
  {
    id: 6,
    name: "Math 220 - Calculus II",
    description: "Integration techniques, series, and calculus applications.",
    fullDescription: "Tackle the challenging topics of Calculus II including integration methods, infinite series, parametric equations, and polar coordinates. Group sessions include practice problems and exam review.",
    tags: ["Math 220", "Math", "Calculus"],
    memberCount: 14,
    maxMembers: 18,
    isPrivate: true,
    isMember: false,
    hasPendingRequest: false,
    createdAt: new Date('2025-09-15'),
  },
  {
    id: 7,
    name: "Cpts 355 - Programming Language Design",
    description: "Explore functional programming and language paradigms.",
    fullDescription: "Study programming language concepts including syntax, semantics, type systems, and runtime environments. We work with languages like Python, Haskell, and Prolog to understand different paradigms.",
    tags: ["Cpts 355", "CS", "Programming"],
    memberCount: 9,
    maxMembers: 15,
    isPrivate: false,
    isMember: true,
    hasPendingRequest: false,
    createdAt: new Date('2025-02-05'),
  },
  {
    id: 8,
    name: "Psych 105 - Introduction to Psychology",
    description: "Discussion group for psychology concepts and research methods.",
    fullDescription: "Explore the fundamentals of psychology including cognitive processes, developmental psychology, social behavior, and mental health. We discuss case studies, research papers, and prepare for exams together.",
    tags: ["Psych 105", "Social Science", "Psychology"],
    memberCount: 11,
    maxMembers: 20,
    isPrivate: false,
    isMember: false,
    hasPendingRequest: false,
    createdAt: new Date('2025-10-01'),
  },
  {
    id: 9,
    name: "Econ 101 - Microeconomics",
    description: "Understand supply, demand, and market structures.",
    fullDescription: "A study group dedicated to mastering microeconomic principles including consumer theory, producer theory, market equilibrium, and welfare economics. We solve problem sets and analyze real-world economic scenarios.",
    tags: ["Econ 101", "Economics", "Business"],
    memberCount: 13,
    maxMembers: 20,
    isPrivate: false,
    isMember: false,
    hasPendingRequest: false,
    createdAt: new Date('2025-08-20'),
  },
  {
    id: 10,
    name: "Chem 105 - General Chemistry",
    description: "Chemistry fundamentals and lab experiment help.",
    fullDescription: "Cover atomic structure, chemical bonding, stoichiometry, thermodynamics, and equilibrium. We help each other with lab reports, practice problems, and exam preparation.",
    tags: ["Chem 105", "Science", "Chemistry"],
    memberCount: 16,
    maxMembers: 22,
    isPrivate: false,
    isMember: false,
    hasPendingRequest: false,
    createdAt: new Date('2025-09-01'),
  },
  {
    id: 11,
    name: "Art 101 - Art History",
    description: "Explore art movements from Renaissance to Modern era.",
    fullDescription: "Journey through the history of art, examining major movements, influential artists, and cultural contexts. We share visual resources, discuss art theory, and prepare presentations together.",
    tags: ["Art 101", "Humanities", "Art"],
    memberCount: 7,
    maxMembers: 12,
    isPrivate: true,
    isMember: false,
    hasPendingRequest: false,
    createdAt: new Date('2025-10-05'),
  },
  {
    id: 12,
    name: "Physics 201 - University Physics",
    description: "Mechanics, waves, and thermodynamics study sessions.",
    fullDescription: "Master classical mechanics, oscillations, waves, and thermal physics through collaborative problem solving. We work through challenging textbook problems and lab assignments together.",
    tags: ["Physics 201", "Science", "Physics"],
    memberCount: 15,
    maxMembers: 20,
    isPrivate: false,
    isMember: true,
    hasPendingRequest: false,
    createdAt: new Date('2025-07-25'),
  },
];

type FilterType = 'popular' | 'newest' | 'myGroup' | 'calendar';
type CategoryType = 'all' | 'cs' | 'math' | 'science' | 'humanities';

const Dashboard: React.FC = () => {
  
  // Filter and search state
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('popular');
  const [selectedCategory] = useState<CategoryType>('all');
  const [searchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal state
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

  const GROUPS_PER_PAGE = 9;

  // Filter and search groups
  const filteredGroups = useMemo(() => {
    let groups = [...MOCK_GROUPS];

    // Apply search
    if (searchQuery) {
      groups = groups.filter(group => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      groups = groups.filter(group => {
        const categoryMap: Record<CategoryType, string[]> = {
          all: [],
          cs: ['CS', 'Cpts 322', 'Cpts 355', 'CS 215'],
          math: ['Math', 'Statistics', 'Stat 360'],
          science: ['Science', 'Biology', 'Chemistry', 'Physics'],
          humanities: ['Humanities', 'English', 'Art'],
        };
        return group.tags.some(tag => 
          categoryMap[selectedCategory]?.some(cat => 
            tag.toLowerCase().includes(cat.toLowerCase())
          )
        );
      });
    }

    // Apply filter
    switch (selectedFilter) {
      case 'popular':
        groups.sort((a, b) => b.memberCount - a.memberCount);
        break;
      case 'newest':
        groups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'myGroup':
        groups = groups.filter(group => group.isMember);
        break;
      case 'calendar':
        // For now, same as popular - can be enhanced with calendar integration
        groups.sort((a, b) => b.memberCount - a.memberCount);
        break;
    }

    return groups;
  }, [selectedFilter, selectedCategory, searchQuery]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredGroups.length / GROUPS_PER_PAGE);
  const startIndex = (currentPage - 1) * GROUPS_PER_PAGE;
  const paginatedGroups = filteredGroups.slice(startIndex, startIndex + GROUPS_PER_PAGE);

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle modal operations
  const openGroupModal = (group: StudyGroup) => {
    setSelectedGroup(group);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGroup(null);
  };

  // Get join button state for a group
  const getJoinButtonState = (group: StudyGroup): JoinButtonState => {
    if (group.isMember) {
      return { text: 'View Group', disabled: false, variant: 'success' };
    }
    if (group.memberCount >= group.maxMembers) {
      return { text: 'Group Full', disabled: true, variant: 'disabled' };
    }
    if (group.hasPendingRequest) {
      return { text: 'Request Pending', disabled: true, variant: 'pending' };
    }
    if (group.isPrivate) {
      return { text: 'Send Join Request', disabled: false, variant: 'private' };
    }
    return { text: 'Join Now', disabled: false, variant: 'public' };
  };

  // Handle join group action
  const handleJoinAction = async (group: StudyGroup) => {
    const buttonState = getJoinButtonState(group);
    if (buttonState.disabled) return;

    setLoading(true);
    setMessage('');
    setMessageType('');

    try {
      // TODO: Implement actual API call
      // await groupAPI.joinGroup(group.id);
      // setMessage(`Successfully ${buttonState.text.toLowerCase()} for ${group.name}`);
      // setMessageType('success');
    } catch (error: any) {
      console.error('Join group error:', error);
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
        {paginatedGroups.length > 0 ? (
          <div className={styles.groupsGrid}>
            {paginatedGroups.map((group) => (
              <div
                key={group.id}
                onClick={() => openGroupModal(group)}
                className={styles.groupCard}
              >
                <div className={styles.groupCardHeader}>
                  <h3 className={styles.groupName}>{group.name}</h3>
                  {group.isPrivate && (
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
                    {group.memberCount}/{group.maxMembers}
                  </span>
                  {group.isMember && (
                    <span className={styles.memberBadge}>Member</span>
                  )}
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
                    {selectedGroup.isPrivate && (
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
                    {selectedGroup.isPrivate ? 'Private' : 'Public'}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className={styles.modalActions}>
                {(() => {
                  const buttonState = getJoinButtonState(selectedGroup);
                  return (
                    <button
                      onClick={() => {
                        if (selectedGroup.isMember) {
                          // If user is already a member, go to group page
                          closeModal();
                          window.location.href = `/group/${selectedGroup.id}`;
                        } else {
                          // If not a member, show join functionality (not implemented yet)
                          handleJoinAction(selectedGroup);
                        }
                      }}
                      disabled={buttonState.disabled || loading}
                      className={`${styles.joinButton} ${styles[buttonState.variant]}`}
                    >
                      {loading ? 'Processing...' : selectedGroup.isMember ? 'Go to Group' : buttonState.text}
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