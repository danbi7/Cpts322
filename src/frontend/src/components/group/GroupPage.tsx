import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import NavigationBar from '../NavigationBar';
import { studyGroupAPI, StudyGroupResponse, JoinRequestProfile, postAPI, PostResponseDTO, commentAPI, CommentResponse } from '../../services/api';
import styles from './groupPage.module.css';

interface Post extends PostResponseDTO {}

const GroupPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { userId, userProfile } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [postLoading, setPostLoading] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [showNewPost, setShowNewPost] = useState(false);
  const [groupInfo, setGroupInfo] = useState<StudyGroupResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [joinRequests, setJoinRequests] = useState<JoinRequestProfile[]>([]);
  const [actionMessage, setActionMessage] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEditPostModal, setShowEditPostModal] = useState<boolean>(false);
  const [showDeletePostModal, setShowDeletePostModal] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [editPostData, setEditPostData] = useState({ title: '', content: '' });
  
  // Comment states
  const [comments, setComments] = useState<{ [postId: number]: CommentResponse[] }>({});
  const [showComments, setShowComments] = useState<{ [postId: number]: boolean }>({});
  const [newComment, setNewComment] = useState<{ [postId: number]: string }>({});
  const [replyingTo, setReplyingTo] = useState<{ [postId: number]: { userId: number; username: string } | null }>({});

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

  // Determine admin and load join requests if admin
  useEffect(() => {
    const fetchAdminAndRequests = async () => {
      if (!groupId || !userId) return;
      try {
        const admin = await studyGroupAPI.isAdmin(parseInt(groupId), userId);
        setIsAdmin(admin);
        // If user is admin, ensure UI reflects membership
        if (admin) {
          setGroupInfo(prev => prev ? { ...prev, member: true } : prev);
        }
        if (admin) {
          const requests = await studyGroupAPI.getJoinRequests(parseInt(groupId), userId);
          setJoinRequests(requests);
        } else {
          setJoinRequests([]);
        }
      } catch (e) {
        // silently ignore
      }
    };
    fetchAdminAndRequests();
  }, [groupId, userId]);

  const handleJoinGroup = async () => {
    if (!groupId || !userId) return;
    setActionMessage('');
    try {
      const message = await studyGroupAPI.joinStudyGroup(parseInt(groupId), userId);
      setActionMessage(message || 'Join action completed.');
      // Refresh group info
      const groupData = await studyGroupAPI.getStudyGroup(parseInt(groupId), userId);
      setGroupInfo(groupData);
    } catch (err: any) {
      const backendMsg = err?.response?.data;
      setActionMessage(typeof backendMsg === 'string' && backendMsg ? backendMsg : 'Failed to join group.');
    }
  };

  const handleLeaveGroup = async () => {
    if (!groupId || !userId) return;
    setActionMessage('');
    try {
      const message = await studyGroupAPI.leaveStudyGroup(parseInt(groupId), userId);
      // Redirect to dashboard after successfully leaving
      navigate('/dashboard');
    } catch (err: any) {
      const backendMsg = err?.response?.data;
      setActionMessage(typeof backendMsg === 'string' && backendMsg ? backendMsg : 'Failed to leave group.');
    }
  };

  const handleDeleteGroup = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteGroup = async () => {
    if (!groupId || !userId) return;
    
    setShowDeleteModal(false);
    setActionMessage('');
    try {
      const message = await studyGroupAPI.deleteStudyGroup(parseInt(groupId), userId);
      // Redirect to dashboard after successfully deleting
      navigate('/dashboard');
    } catch (err: any) {
      const backendMsg = err?.response?.data;
      setActionMessage(typeof backendMsg === 'string' && backendMsg ? backendMsg : 'Failed to delete group.');
    }
  };

  const handleUpdateGroup = () => {
    if (!groupId) return;
    navigate(`/update-group/${groupId}`);
  };

  // Load posts
  useEffect(() => {
    const loadPosts = async () => {
      if (!groupId || !userId) return;
      setPostLoading(true);
      try {
        const data = await postAPI.getPosts(parseInt(groupId), userId, 20, 0);
        setPosts(data as Post[]);
      } catch {}
      finally {
        setPostLoading(false);
      }
    };
    loadPosts();
  }, [groupId, userId]);

  // Voting not implemented

  // Comment voting not implemented

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId || !userId) return;
    if (newPost.title.trim() && newPost.content.trim()) {
      try {
        await postAPI.createPost(parseInt(groupId), userId, { title: newPost.title.trim(), content: newPost.content.trim() });
        const data = await postAPI.getPosts(parseInt(groupId), userId, 20, 0);
        setPosts(data as Post[]);
        setNewPost({ title: '', content: '' });
        setShowNewPost(false);
      } catch (error: any) {
        console.error('Failed to create post:', error);
        const errorMsg = error?.response?.data || error?.message || 'Failed to create post. Please try again.';
        setActionMessage(errorMsg);
        setTimeout(() => setActionMessage(''), 5000);
      }
    }
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setEditPostData({ title: post.title, content: post.content });
    setShowEditPostModal(true);
  };

  const handleSubmitEditPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId || !userId || !editingPost) return;
    if (editPostData.title.trim() && editPostData.content.trim()) {
      try {
        await postAPI.updatePost(parseInt(groupId), userId, editingPost.postId, { 
          title: editPostData.title.trim(), 
          content: editPostData.content.trim() 
        });
        const data = await postAPI.getPosts(parseInt(groupId), userId, 20, 0);
        setPosts(data as Post[]);
        setEditPostData({ title: '', content: '' });
        setShowEditPostModal(false);
        setEditingPost(null);
      } catch (error: any) {
        console.error('Failed to update post:', error);
        const errorMsg = error?.response?.data || error?.message || 'Failed to update post. Please try again.';
        setActionMessage(errorMsg);
        setTimeout(() => setActionMessage(''), 5000);
      }
    }
  };

  const handleDeletePostClick = (postId: number) => {
    setDeletingPostId(postId);
    setShowDeletePostModal(true);
  };

  const confirmDeletePost = async () => {
    if (!groupId || !userId || !deletingPostId) return;
    
    setShowDeletePostModal(false);
    setActionMessage('');
    try {
      await postAPI.deletePost(parseInt(groupId), userId, deletingPostId);
      const data = await postAPI.getPosts(parseInt(groupId), userId, 20, 0);
      setPosts(data as Post[]);
      setDeletingPostId(null);
    } catch (error: any) {
      const errorMsg = error?.response?.data || error?.message || 'Failed to delete post. Please try again.';
      setActionMessage(errorMsg);
      setTimeout(() => setActionMessage(''), 5000);
    }
  };

  // Comment handlers
  const toggleComments = async (postId: number) => {
    const isShowing = showComments[postId];
    setShowComments({ ...showComments, [postId]: !isShowing });
    
    // Load comments if not already loaded and we're opening the section
    if (!isShowing && !comments[postId]) {
      try {
        const commentsData = await commentAPI.getComments(postId);
        setComments({ ...comments, [postId]: commentsData });
      } catch (error) {
        console.error('Failed to load comments:', error);
      }
    }
  };

  const handleSubmitComment = async (postId: number, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userId) return;
    
    const content = newComment[postId]?.trim();
    if (!content) return;

    try {
      const replyTo = replyingTo[postId];
      await commentAPI.createComment(postId, {
        content,
        replyingToUserId: replyTo?.userId,
      });
      
      // Reload comments
      const commentsData = await commentAPI.getComments(postId);
      setComments({ ...comments, [postId]: commentsData });
      
      // Clear input and reply state
      setNewComment({ ...newComment, [postId]: '' });
      setReplyingTo({ ...replyingTo, [postId]: null });

    } catch (error: any) {
      console.error('Failed to create comment:', error);
      const errorMsg = error?.response?.data || error?.message || 'Failed to add comment. Please try again.';
      setActionMessage(errorMsg);
      setTimeout(() => setActionMessage(''), 5000);
    }
  };

  const handleDeleteComment = async (postId: number, commentId: number) => {
    if (!userId) return;
    
    try {
      await commentAPI.deleteComment(commentId);
      
      // Reload comments
      const commentsData = await commentAPI.getComments(postId);
      setComments({ ...comments, [postId]: commentsData });
    } catch (error: any) {
      console.error('Failed to delete comment:', error);
      const errorMsg = error?.response?.data || error?.message || 'Failed to delete comment. Please try again.';
      setActionMessage(errorMsg);
      setTimeout(() => setActionMessage(''), 5000);
    }
  };

  const handleReplyToComment = (postId: number, userId: number, username: string) => {
    setReplyingTo({ ...replyingTo, [postId]: { userId, username } });
  };

  const cancelReply = (postId: number) => {
    setReplyingTo({ ...replyingTo, [postId]: null });
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
                  <svg className={styles.groupIconSvg} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
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

                  {(() => {
                    if (groupInfo.member) {
                      return (
                        <button className={styles.followingButton} onClick={handleLeaveGroup}>
                          <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Leave Group
                        </button>
                      );
                    }
                    if (groupInfo.hasPendingRequest) {
                      return (
                        <button className={styles.pendingButton} disabled>
                          <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Request Pending
                        </button>
                      );
                    }
                    return (
                      <button className={styles.joinButton} onClick={handleJoinGroup}>
                        <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Join Group
                      </button>
                    );
                  })()}
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
                    <div className={styles.activityLabel}>Total posts</div>
                  </div>
                </div>
                
                <div className={styles.activityCard}>
                  <svg className={styles.activityIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <div className={styles.activityContent}>
                    <div className={styles.activityNumber}>
                      {Object.values(comments).reduce((total, commentList) => total + commentList.length, 0)}
                    </div>
                    <div className={styles.activityLabel}>Comments</div>
                  </div>
                </div>
                
                <div className={styles.activityCard}>
                  <svg className={styles.activityIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div className={styles.activityContent}>
                    <div className={styles.activityNumber}>{groupInfo.memberCount}</div>
                    <div className={styles.activityLabel}>Members</div>
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
              {actionMessage && (
                <div className={styles.infoBanner}>{actionMessage}</div>
              )}
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
                {postLoading ? (
                  <div className={styles.loadingContainer}><div className={styles.loadingSpinner}></div><p>Loading posts...</p></div>
                ) : posts.map((post) => (
                  <div key={post.postId} className={styles.postCard}>
                    <div className={styles.postHeader}>
                      <div className={styles.postAuthor}>
                        <div className={styles.authorAvatar}>
                          {post.userProfileImage ? (
                            <img src={post.userProfileImage} alt={post.username} />
                          ) : (
                            post.username.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className={styles.authorInfo}>
                          <div className={styles.authorName}>{post.username}</div>
                          <div className={styles.postTime}>{formatTimeAgo(new Date(post.createdAt))}</div>
                        </div>
                      </div>
                      <div className={styles.postActions}>
                        <button 
                          className={styles.editButton}
                          onClick={() => handleEditPost(post)}
                          title="Edit post"
                        >
                          <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          className={styles.deleteButton}
                          onClick={() => handleDeletePostClick(post.postId)}
                          title="Delete post"
                        >
                          <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className={styles.postContent}>
                      <h3 className={styles.postTitle}>{post.title}</h3>
                      <p className={styles.postText}>{post.content}</p>
                    </div>
                    
                    <div className={styles.postFooter}>
                      <div className={styles.voteButtons}>
                        <span className={styles.voteButton}>Views: {post.viewCount}</span>
                        <span className={styles.voteButton}>Likes: {post.likeCount}</span>
                      </div>
                      
                      <button 
                        className={styles.commentButton}
                        onClick={() => toggleComments(post.postId)}
                      >
                        <svg className={styles.commentIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {comments[post.postId]?.length || 0} Comments
                      </button>
                    </div>
                    
                    {/* Comments Section */}
                    {showComments[post.postId] && (
                      <div className={styles.commentsSection}>
                        {/* Add Comment Input */}
                        <div className={styles.addCommentForm}>
                          {replyingTo[post.postId] && (
                            <div className={styles.replyingToBar}>
                              <span>Replying to @{replyingTo[post.postId]?.username}</span>
                              <button 
                                className={styles.cancelReplyButton}
                                onClick={() => cancelReply(post.postId)}
                              >
                                ✕
                              </button>
                            </div>
                          )}
                          <div className={styles.commentInputContainer}>
                            <div className={styles.commentAvatar}>
                              {userProfile ? `${userProfile.firstName.charAt(0)}${userProfile.lastName.charAt(0)}` : 'A'}
                            </div>
                            <input
                              type="text"
                              placeholder="Write a comment..."
                              value={newComment[post.postId] || ''}
                              onChange={(e) => setNewComment({ ...newComment, [post.postId]: e.target.value })}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  handleSubmitComment(post.postId, e);
                                }
                              }}
                              className={styles.commentInput}
                            />
                            <button
                              className={styles.submitCommentButton}
                              onClick={() => handleSubmitComment(post.postId)}
                              disabled={!newComment[post.postId]?.trim()}
                            >
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Comments List */}
                        <div className={styles.commentsList}>
                          {comments[post.postId]?.length === 0 ? (
                            <div className={styles.noComments}>No comments yet. Be the first to comment!</div>
                          ) : (
                            comments[post.postId]?.map((comment) => (
                              <div key={comment.commentId} className={styles.commentItem}>
                                <div className={styles.commentAvatar}>
                                  {comment.userProfileImage ? (
                                    <img src={comment.userProfileImage} alt={comment.username} />
                                  ) : (
                                    comment.username.charAt(0).toUpperCase()
                                  )}
                                </div>
                                <div className={styles.commentContent}>
                                  <div className={styles.commentHeader}>
                                    <span className={styles.commentAuthor}>{comment.username}</span>
                                    <span className={styles.commentTime}>
                                      {formatTimeAgo(new Date(comment.createdAt))}
                                    </span>
                                  </div>
                                  {comment.replyingToUsername && (
                                    <div className={styles.replyingToTag}>
                                      Replying to @{comment.replyingToUsername}
                                    </div>
                                  )}
                                  <p className={styles.commentText}>{comment.content}</p>
                                  <div className={styles.commentActions}>
                                    <button
                                      className={styles.replyButton}
                                      onClick={() => handleReplyToComment(post.postId, comment.userId, comment.username)}
                                    >
                                      Reply
                                    </button>
                                    {userId === comment.userId && (
                                      <button
                                        className={styles.deleteCommentButton}
                                        onClick={() => handleDeleteComment(post.postId, comment.commentId)}
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column - Sidebar */}
              <div className={styles.sidebar}>
                {isAdmin && (
                  <div className={styles.sidebarCard}>
                    <div className={styles.sidebarCardHeader}>
                      <h3 className={styles.sidebarTitle}>Pending Join Requests</h3>
                    </div>
                    {joinRequests.length === 0 ? (
                      <div className={styles.noEvents}><p>No pending requests</p></div>
                    ) : (
                      <ul className={styles.requestsList}>
                        {joinRequests.map((r) => (
                          <li key={r.userId} className={styles.requestItem}>
                            <div className={styles.requestInfo}>
                              <div className={styles.requestAvatar}>
                                {r.profileImageUrl ? (
                                  <img src={r.profileImageUrl} alt={`${r.firstName} ${r.lastName}`} />
                                ) : (
                                  <>{r.firstName?.charAt(0)}{r.lastName?.charAt(0)}</>
                                )}
                              </div>
                              <div>
                                <div className={styles.requestName}>{r.firstName} {r.lastName}</div>
                                <div className={styles.requestMeta}>{r.nickname ? `• ${r.nickname}` : ''}</div>
                              </div>
                            </div>
                            <div className={styles.requestActions}>
                              <button
                                className={styles.approveButton}
                                disabled={!r.requestId}
                                onClick={async () => {
                                  if (!groupId || !userId || !r.requestId) return;
                                  try {
                                    await studyGroupAPI.approveJoinRequest(parseInt(groupId), r.requestId, userId);
                                    const updated = await studyGroupAPI.getJoinRequests(parseInt(groupId), userId);
                                    setJoinRequests(updated);
                                  } catch (e: any) {
                                  }
                                }}
                              >
                                Approve
                              </button>
                              <button
                                className={styles.rejectButton}
                                disabled={!r.requestId}
                                onClick={async () => {
                                  if (!groupId || !userId || !r.requestId) return;
                                  try {
                                    await studyGroupAPI.rejectJoinRequest(parseInt(groupId), r.requestId, userId);
                                    const updated = await studyGroupAPI.getJoinRequests(parseInt(groupId), userId);
                                    setJoinRequests(updated);
                                  } catch (e: any) {
                                  }
                                }}
                              >
                                Reject
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className={styles.groupManagementActions}>
                      <button 
                        className={styles.updateGroupButton} 
                        onClick={handleUpdateGroup}
                      >
                        <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Update Group
                      </button>
                      <button 
                        className={styles.deleteGroupButton} 
                        onClick={handleDeleteGroup}
                      >
                        <svg className={styles.actionIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Group
                      </button>
                    </div>
                  </div>
                )}
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
                    <div className={styles.modalHeader}>
                      <h3 className={styles.modalTitle}>
                        <div className={styles.modalTitleIcon}>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        Create New Post
                      </h3>
                      <button 
                        type="button" 
                        className={styles.closeModalButton}
                        onClick={() => setShowNewPost(false)}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <form onSubmit={handleSubmitPost} className={styles.modalForm}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          Title
                        </label>
                        <input
                          type="text"
                          placeholder="Enter post title..."
                          value={newPost.title}
                          onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                          className={styles.modalInput}
                          required
                          maxLength={200}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                          </svg>
                          Content
                        </label>
                        <textarea
                          placeholder="Share your thoughts with the group..."
                          value={newPost.content}
                          onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                          className={styles.modalTextarea}
                          required
                          maxLength={5000}
                        />
                        <div className={styles.characterCount}>
                          {newPost.content.length} / 5000 characters
                        </div>
                      </div>
                      <div className={styles.modalActions}>
                        <button type="button" onClick={() => setShowNewPost(false)} className={styles.cancelButton}>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                        <button type="submit" className={styles.submitButton}>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Publish Post
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Group Confirmation Modal */}
            {showDeleteModal && (
              <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
                <div className={`${styles.modal} ${styles.confirmationModal}`} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalContent}>
                    <div className={styles.confirmationIcon}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className={styles.modalTitle}>Delete Group?</h3>
                    <p className={styles.confirmationText}>
                      Are you sure you want to delete this group? This action cannot be undone. All posts, members, and data associated with this group will be permanently deleted.
                    </p>
                    <div className={styles.modalActions}>
                      <button 
                        type="button" 
                        onClick={() => setShowDeleteModal(false)} 
                        className={styles.cancelButton}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                      <button 
                        type="button" 
                        onClick={confirmDeleteGroup} 
                        className={styles.submitButton}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Group
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Post Modal */}
            {showEditPostModal && editingPost && (
              <div className={styles.modalOverlay} onClick={() => setShowEditPostModal(false)}>
                <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                      <h3 className={styles.modalTitle}>
                        <div className={styles.modalTitleIcon}>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        Edit Post
                      </h3>
                      <button 
                        type="button" 
                        className={styles.closeModalButton}
                        onClick={() => {
                          setShowEditPostModal(false);
                          setEditingPost(null);
                          setEditPostData({ title: '', content: '' });
                        }}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <form onSubmit={handleSubmitEditPost} className={styles.modalForm}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          Title
                        </label>
                        <input
                          type="text"
                          placeholder="Enter post title..."
                          value={editPostData.title}
                          onChange={(e) => setEditPostData({...editPostData, title: e.target.value})}
                          className={styles.modalInput}
                          required
                          maxLength={200}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                          </svg>
                          Content
                        </label>
                        <textarea
                          placeholder="Share your thoughts with the group..."
                          value={editPostData.content}
                          onChange={(e) => setEditPostData({...editPostData, content: e.target.value})}
                          className={styles.modalTextarea}
                          required
                          maxLength={5000}
                        />
                        <div className={styles.characterCount}>
                          {editPostData.content.length} / 5000 characters
                        </div>
                      </div>
                      <div className={styles.modalActions}>
                        <button 
                          type="button" 
                          onClick={() => {
                            setShowEditPostModal(false);
                            setEditingPost(null);
                            setEditPostData({ title: '', content: '' });
                          }} 
                          className={styles.cancelButton}
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Cancel
                        </button>
                        <button type="submit" className={styles.submitButton}>
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Update Post
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Delete Post Confirmation Modal */}
            {showDeletePostModal && (
              <div className={styles.modalOverlay} onClick={() => setShowDeletePostModal(false)}>
                <div className={`${styles.modal} ${styles.confirmationModal}`} onClick={(e) => e.stopPropagation()}>
                  <div className={styles.modalContent}>
                    <div className={styles.confirmationIcon}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h3 className={styles.modalTitle}>Delete Post?</h3>
                    <p className={styles.confirmationText}>
                      Are you sure you want to delete this post? This action cannot be undone.
                    </p>
                    <div className={styles.modalActions}>
                      <button 
                        type="button" 
                        onClick={() => {
                          setShowDeletePostModal(false);
                          setDeletingPostId(null);
                        }} 
                        className={styles.cancelButton}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                      <button 
                        type="button" 
                        onClick={confirmDeletePost} 
                        className={styles.submitButton}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Post
                      </button>
                    </div>
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