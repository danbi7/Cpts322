import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavigationBar from '../NavigationBar';
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [showNewPost, setShowNewPost] = useState(false);
  const [groupInfo, setGroupInfo] = useState({
    name: 'Cpts 322 - Software Engineering',
    description: 'Weekly study sessions for SE concepts, project help, and exam prep.',
    memberCount: 12,
    maxMembers: 20,
    isPrivate: false
  });

  // Mock data
  useEffect(() => {
    
    const mockPosts: Post[] = [
      {
        id: 1,
        title: "Midterm was brutal! Anyone else struggling?",
        content: "Just finished the midterm and I'm pretty sure I failed. The time complexity questions were insane. Anyone want to study together for the final?",
        author: "StudyBuddy123",
        authorAvatar: "S",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        upvotes: 15,
        downvotes: 2,
        isUpvoted: false,
        isDownvoted: false,
        comments: [
          {
            id: 1,
            content: "Same here! The dynamic programming section killed me",
            author: "CodeMaster",
            authorAvatar: "C",
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            upvotes: 8,
            isUpvoted: false
          },
          {
            id: 2,
            content: "We should definitely form a study group for the final",
            author: "AlgorithmAce",
            authorAvatar: "A",
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
        author: "GroupLeader",
        authorAvatar: "G",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        upvotes: 23,
        downvotes: 1,
        isUpvoted: true,
        isDownvoted: false,
        comments: [
          {
            id: 3,
            content: "I'm in! Should I bring my laptop?",
            author: "TechStudent",
            authorAvatar: "T",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
            upvotes: 3,
            isUpvoted: false
          }
        ]
      },
      {
        id: 3,
        title: "Best resources for understanding design patterns?",
        content: "I'm having trouble with the Singleton and Factory patterns. Any good YouTube videos or websites that explain them clearly?",
        author: "PatternLearner",
        authorAvatar: "P",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        upvotes: 12,
        downvotes: 0,
        isUpvoted: false,
        isDownvoted: false,
        comments: [
          {
            id: 4,
            content: "Check out 'Design Patterns Explained' on YouTube - really helped me understand the concepts",
            author: "DesignPro",
            authorAvatar: "D",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
            upvotes: 7,
            isUpvoted: false
          }
        ]
      },
      {
        id: 4,
        title: "Project partner needed for final assignment",
        content: "Looking for someone to work on the final project with. I'm good with frontend but need help with the backend API design. Message me if interested!",
        author: "ProjectSeeker",
        authorAvatar: "P",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        upvotes: 8,
        downvotes: 0,
        isUpvoted: false,
        isDownvoted: false,
        comments: []
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
            newPost.upvotes++;
            newPost.isUpvoted = true;
            if (newPost.isDownvoted) {
              newPost.downvotes--;
              newPost.isDownvoted = false;
            }
          }
        } else {
          if (newPost.isDownvoted) {
            newPost.downvotes--;
            newPost.isDownvoted = false;
          } else {
            newPost.downvotes++;
            newPost.isDownvoted = true;
            if (newPost.isUpvoted) {
              newPost.upvotes--;
              newPost.isUpvoted = false;
            }
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
        author: "You",
        authorAvatar: "Y",
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


  return (
    <div className={styles.groupPage}>
      {/* Navigation Bar */}
      <NavigationBar />
      
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.groupTitle}>{groupInfo.name}</h1>
          <p className={styles.groupDescription}>{groupInfo.description}</p>
          <div className={styles.groupStats}>
            <span className={styles.memberCount}>
              {groupInfo.memberCount}/{groupInfo.maxMembers} members
            </span>
          </div>
        </div>
        <button className={styles.backButton} onClick={() => window.history.back()}>
          ← Back to Dashboard
        </button>
      </div>

      {/* Create Post Button */}
      <div className={styles.createPostSection}>
        <button 
          className={styles.createPostButton}
          onClick={() => setShowNewPost(!showNewPost)}
        >
          {showNewPost ? 'Cancel' : 'Create Post'}
        </button>
      </div>

      {/* New Post Form */}
      {showNewPost && (
        <div className={styles.newPostForm}>
          <form onSubmit={handleSubmitPost}>
            <input
              type="text"
              placeholder="Post title..."
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              className={styles.postTitleInput}
              required
            />
            <textarea
              placeholder="What's on your mind? Share study tips, ask questions, or organize study sessions..."
              value={newPost.content}
              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              className={styles.postContentInput}
              required
            />
            <div className={styles.formActions}>
              <button type="button" onClick={() => setShowNewPost(false)} className={styles.cancelButton}>
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>Post</button>
            </div>
          </form>
        </div>
      )}

      {/* Posts Feed */}
      <div className={styles.postsFeed}>
        {posts.map(post => (
          <div key={post.id} className={styles.post}>
            {/* Post Header */}
            <div className={styles.postHeader}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>{post.authorAvatar}</div>
                <div>
                  <div className={styles.authorName}>{post.author}</div>
                  <div className={styles.postTime}>
                    {formatTimeAgo(post.timestamp)}
                  </div>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className={styles.postContent}>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postText}>{post.content}</p>
            </div>

            {/* Post Actions */}
            <div className={styles.postActions}>
              <div className={styles.voteButtons}>
                <button 
                  className={`${styles.voteButton} ${post.isUpvoted ? styles.voted : ''}`}
                  onClick={() => handleVote(post.id, 'upvote')}
                >
                  ▲ {post.upvotes}
                </button>
                <button 
                  className={`${styles.voteButton} ${post.isDownvoted ? styles.voted : ''}`}
                  onClick={() => handleVote(post.id, 'downvote')}
                >
                  ▼ {post.downvotes}
                </button>
              </div>
              <button className={styles.commentButton}>
                💬 {post.comments.length} comments
              </button>
            </div>

            {/* Comments Section */}
            {post.comments.length > 0 && (
              <div className={styles.commentsSection}>
                {post.comments.map(comment => (
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
      </div>
    </div>
  );
};

// Helper function
const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return `${Math.floor(diffInMinutes / 1440)}d ago`;
};

export default GroupPage;
