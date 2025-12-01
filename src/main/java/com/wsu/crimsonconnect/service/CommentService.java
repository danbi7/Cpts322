package com.wsu.crimsonconnect.service;

import com.wsu.crimsonconnect.domain.Comment;
import com.wsu.crimsonconnect.dto.CommentRequest;
import com.wsu.crimsonconnect.dto.CommentResponse;
import com.wsu.crimsonconnect.mapper.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentMapper commentMapper;

    public void createComment(Long postId, Long userId, CommentRequest request) {
        Comment c = new Comment();
        c.setPostId(postId);
        c.setUserId(userId);
        c.setReplyingToUserId(request.getReplyingToUserId());
        c.setContent(request.getContent());

        commentMapper.insert(c);
    }

    public List<CommentResponse> getComments(Long postId) {
        return commentMapper.getCommentsByPost(postId);
    }

    public void deleteComment(Long commentId, Long userId) {
        int deleted = commentMapper.deleteComment(commentId, userId);

        if (deleted == 0) {
            throw new RuntimeException("Not authorized to delete this comment.");
        }
    }
}

