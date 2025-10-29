import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NavigationBar from '../NavigationBar';
import { studyGroupAPI, StudyGroupResponse } from '../../services/api';
import styles from './groupPage.module.css';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  timestamp: Date;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  isUpvoted: boolean;
  isDownvoted: boolean;
}

interface Comment {
  id: number;
  content: string;
  author: string;
  authorAvatar: string;
  timestamp: Date;
  upvotes: number;
  isUpvoted: boolean;
  replies?: Comment[];
}

const GroupPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { userId, userProfile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [showNewPost, setShowNewPost] = useState(false);
  const [groupInfo, setGroupInfo] = useState<StudyGroupResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Fetch group data from API
  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId || !userId) return;
      
      try {
        setLoading(true);
        setError('');
        const groupData = await studyGroupAPI.getStudyGroup(parseInt(groupId), userId);
        setGroupInfo(groupData);
      } catch (err: any) {
        console.error('Failed to fetch group data:', err);
        setError('Failed to load group data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchGroupData();
  }, [groupId, userId]);

  // Mock posts data - TODO: Replace with real posts API when available
  useEffect(() => {
    const mockPosts: Post[] = [
      {
        id: 1,
        title: "Big O Notation Study Guide",
        content: "I've created a comprehensive guide on Big O notation with examples from our recent lectures. This covers best case, average case, and worst case scenarios with visual examples. Let me know if you have questions!",
        author: "Sarah Johnson",
        authorAvatar: "SJ",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        upvotes: 15,
        downvotes: 2,
        isUpvoted: false,
        isDownvoted: false,
        comments: [
          {
            id: 1,
            content: "This is amazing! The visual examples really helped me understand the concepts",
            author: "Mike Chen",
            authorAvatar: "MC",
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            upvotes: 8,
            isUpvoted: false
          },
          {
            id: 2,
            content: "Thanks for sharing! Can you add more examples for sorting algorithms?",
            author: "Alex Kim",
            authorAvatar: "AK",
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            upvotes: 5,
            isUpvoted: false
          }
        ]
      },
      {
        id: 2,
        title: "Study group for final exam - who's in?",
        content: "Planning to meet at the library this Saturday 2pm. Bring your notes and we'll go through all the topics together. We'll focus on algorithms, design patterns, and system design.",
        author: "Group Leader",
        authorAvatar: "GL",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        upvotes: 23,
        downvotes: 1,
        isUpvoted: true,
        isDownvoted: false,
        comments: [
          {
            id: 3,
            content: "I'm in! Should I bring my laptop?",
            author: "Tech Student",
            authorAvatar: "TS",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            upvotes: 3,
            isUpvoted: false
          }
        ]
      }
    ];
    setPosts(mockPosts);
  }, []);

  const handleVote = (postId: number, type: 'upvote' | 'downvote') => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newPost = { ...post };

        if (type === 'upvote') {
          if (newPost.isUpvoted) {
            newPost.upvotes--;
            newPost.isUpvoted = false;
          } else {
            if (newPost.isDownvoted) {
              newPost.downvotes--;
              newPost.isDownvoted = false;
            }
            newPost.upvotes++;
            newPost.isUpvoted = true;
          }
        } else {
          if (newPost.isDownvoted) {
            newPost.downvotes--;
            newPost.isDownvoted = false;
          } else {
            if (newPost.isUpvoted) {
              newPost.upvotes--;
              newPost.isUpvoted = false;
            }
            newPost.downvotes++;
            newPost.isDownvoted = true;
          }
        }

        return newPost;
      }
      return post;
    }));
  };

  const handleCommentVote = (postId: number, commentId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                upvotes: comment.isUpvoted ? comment.upvotes - 1 : comment.upvotes + 1,
                isUpvoted: !comment.isUpvoted
              };
            }
            return comment;
          })
        };
      }
      return post;
    }));
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.title.trim() && newPost.content.trim()) {
      const post: Post = {
        id: Date.now(),
        title: newPost.title,
        content: newPost.content,
        author: userProfile?.firstName + ' ' + userProfile?.lastName || 'Anonymous',
        authorAvatar: userProfile ? `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}` : 'A',
        timestamp: new Date(),
        upvotes: 0,
        downvotes: 0,
        isUpvoted: false,
        isDownvoted: false,
        comments: []
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '' });
      setShowNewPost(false);
    }
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <div>
      <NavigationBar />
      <div className={styles.groupPage}>
        {/* Loading State */}
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading group data...</p>
          </div>
        ) : error ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        ) : !groupInfo ? (
          <div className={styles.errorContainer}>
            <p className={styles.errorText}>Group not found</p>
            <button 
              className={styles.retryButton}
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        ) : (
          <>
            {/* Group Header Banner */}
            <div className={styles.groupBanner}>
              <div className={styles.bannerContent}>
                <div className={styles.groupIcon}>
                  <svg className={styles.groupIconSvg} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.99L14 10.5V22h6zM12.5 11.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 9.17 11 10s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9l-1.5-4.5A1.5 1.5 0 0 0 6 10H4c-.8 0-1.54.37-2.01.99L1 12.5V22h6.5z"/>
                  </svg>
                </div>
                
                <div className={styles.groupInfo}>
                  <h1 className={styles.groupTitle}>{groupInfo.name}</h1>
                  <p className={styles.groupDescription}>{groupInfo.description}</p>
                  
                  <div className={styles.groupStats}>
                    <div className={styles.statItem}>
                      <svg className={styles.statIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <span>{groupInfo.memberCount} members</span>
                    </div>
                    
                    <div className={styles.statItem}>
                      <svg className={styles.statIcon} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                      </svg>
                      <span>{posts.length} posts</span>
                    </div>
                    
                    {groupInfo.tags.length > 0 && (
                      <div className={styles.categoryTag}>
                        {groupInfo.tags[0]}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={styles.bannerActions}>
                  <button className={styles.shareButton}>
                    <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share
                  </button>
                  
                  {groupInfo.isMember ? (
                    <button className={styles.followingButton}>
                      <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 00-15 0v5h5l-5 5-5-5h5v-5a7.5 7.5 0 0115 0v5z" />
                      </svg>
                      Following
                    </button>
                  ) : (
                    <button className={styles.joinButton}>
                      <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Join Group
                    </button>
                  )}
                </div>
              </div>
              
              {/* Activity Overview Cards */}
              <div className={styles.activityCards}>
                <div className={styles.activityCard}>
                  <svg className={styles.activityIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div className={styles.activityContent}>
                    <div className={styles.activityNumber}>{posts.length}</div>
                    <div className={styles.activityLabel}>Posts this week</div>
                  </div>
                </div>
                
                <div className={styles.activityCard}>
                  <svg className={styles.activityIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <div className={styles.activityContent}>
                    <div className={styles.activityNumber}>
                      {posts.reduce((total, post) => total + post.comments.length, 0)}
                    </div>
                    <div className={styles.activityLabel}>Comments</div>
                  </div>
                </div>
                
                <div className={styles.activityCard}>
                  <svg className={styles.activityIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <div className={styles.activityContent}>
                    <div className={styles.activityNumber}>+{Math.floor(groupInfo.memberCount * 0.1)}</div>
                    <div className={styles.activityLabel}>New members</div>
                  </div>
                </div>
                
                <div className={styles.activityCard}>
                  <svg className={styles.activityIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div className={styles.activityContent}>
                    <div className={styles.activityNumber}>0</div>
                    <div className={styles.activityLabel}>Upcoming events</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className={styles.mainContent}>
              {/* Left Column - Activity Feed */}
              <div className={styles.activityFeed}>
                {/* Post Creation Input */}
                <div className={styles.createPostCard}>
                  <div className={styles.createPostHeader}>
                    <div className={styles.userAvatar}>
                      {userProfile ? `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}` : 'A'}
                    </div>
                    <input
                      type="text"
                      placeholder="Share something with the group..."
                      className={styles.postInput}
                      onClick={() => setShowNewPost(true)}
                    />
                  </div>
                </div>

                {/* Posts */}
                {posts.map((post) => (
                  <div key={post.id} className={styles.postCard}>
                    <div className={styles.postHeader}>
                      <div className={styles.postAuthor}>
                        <div className={styles.authorAvatar}>{post.authorAvatar}</div>
                        <div className={styles.authorInfo}>
                          <div className={styles.authorName}>{post.author}</div>
                          <div className={styles.postTime}>{formatTimeAgo(post.timestamp)}</div>
                        </div>
                      </div>
                      <div className={styles.postActions}>
                        <button className={styles.pinButton}>
                          <svg className={styles.pinIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          Pinned
                        </button>
                      </div>
                    </div>
                    
                    <div className={styles.postContent}>
                      <h3 className={styles.postTitle}>{post.title}</h3>
                      <p className={styles.postText}>{post.content}</p>
                    </div>
                    
                    <div className={styles.postFooter}>
                      <div className={styles.voteButtons}>
                        <button 
                          className={`${styles.voteButton} ${post.isUpvoted ? styles.voted : ''}`}
                          onClick={() => handleVote(post.id, 'upvote')}
                        >
                          <svg className={styles.voteIcon} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          {post.upvotes}
                        </button>
                        <button 
                          className={`${styles.voteButton} ${post.isDownvoted ? styles.voted : ''}`}
                          onClick={() => handleVote(post.id, 'downvote')}
                        >
                          <svg className={styles.voteIcon} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                          {post.downvotes}
                        </button>
                      </div>
                      
                      <div className={styles.commentButton}>
                        <svg className={styles.commentIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {post.comments.length} comments
                      </div>
                    </div>
                    
                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className={styles.commentsSection}>
                        {post.comments.map((comment) => (
                          <div key={comment.id} className={styles.comment}>
                            <div className={styles.commentHeader}>
                              <div className={styles.commentAuthorAvatar}>{comment.authorAvatar}</div>
                              <div className={styles.commentAuthor}>{comment.author}</div>
                              <div className={styles.commentTime}>
                                {formatTimeAgo(comment.timestamp)}
                              </div>
                            </div>
                            <div className={styles.commentContent}>{comment.content}</div>
                            <div className={styles.commentActions}>
                              <button 
                                className={`${styles.commentVote} ${comment.isUpvoted ? styles.commentVoted : ''}`}
                                onClick={() => handleCommentVote(post.id, comment.id)}
                              >
                                ▲ {comment.upvotes}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column - Sidebar */}
              <div className={styles.sidebar}>
                {/* About Section */}
                <div className={styles.sidebarCard}>
                  <h3 className={styles.sidebarTitle}>About</h3>
                  <p className={styles.sidebarDescription}>{groupInfo.fullDescription}</p>
                  
                  <div className={styles.sidebarStats}>
                    <div className={styles.sidebarStat}>
                      <svg className={styles.sidebarIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      <span>{groupInfo.memberCount} members</span>
                    </div>
                    
                    <div className={styles.sidebarStat}>
                      <svg className={styles.sidebarIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{posts.length} posts</span>
                    </div>
                    
                    <div className={styles.sidebarStat}>
                      <svg className={styles.sidebarIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Created {formatDate(groupInfo.createdAt)}</span>
                    </div>
                  </div>
                  
                  {groupInfo.tags.length > 0 && (
                    <div className={styles.tagsSection}>
                      <h4 className={styles.tagsTitle}>Tags</h4>
                      <div className={styles.tagsList}>
                        {groupInfo.tags.map((tag, index) => (
                          <span key={index} className={styles.tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Upcoming Events Section */}
                <div className={styles.sidebarCard}>
                  <div className={styles.sidebarCardHeader}>
                    <h3 className={styles.sidebarTitle}>Upcoming Events</h3>
                    <button className={styles.viewAllButton}>View All</button>
                  </div>
                  <div className={styles.noEvents}>
                    <p>No upcoming events scheduled</p>
                  </div>
                </div>
              </div>
            </div>

            {/* New Post Modal */}
            {showNewPost && (
              <div className={styles.modalOverlay} onClick={() => setShowNewPost(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalContent}>
                    <h3 className={styles.modalTitle}>Create New Post</h3>
                    <form onSubmit={handleSubmitPost}>
                      <input
                        type="text"
                        placeholder="Post title..."
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                        className={styles.modalInput}
                        required
                      />
                      <textarea
                        placeholder="What's on your mind?"
                        value={newPost.content}
                        onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                        className={styles.modalTextarea}
                        required
                      />
                      <div className={styles.modalActions}>
                        <button type="button" onClick={() => setShowNewPost(false)} className={styles.cancelButton}>
                          Cancel
                        </button>
                        <button type="submit" className={styles.submitButton}>Post</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GroupPage;