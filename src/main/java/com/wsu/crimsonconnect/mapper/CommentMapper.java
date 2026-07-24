package com.wsu.crimsonconnect.mapper;

import com.wsu.crimsonconnect.domain.Comment;
import com.wsu.crimsonconnect.dto.CommentResponse;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CommentMapper {

    @Insert("""
        INSERT INTO comments (post_id, user_id, replying_to_user_id, content)
        VALUES (#{postId}, #{userId}, #{replyingToUserId}, #{content})
    """)
    @Options(useGeneratedKeys = true, keyProperty = "commentId")
    void insert(Comment comment);

    @Select("""
        SELECT c.comment_id, c.post_id, c.content, c.created_at,
               u.user_id AS userId, u.username,
               up.profile_image_url AS userProfileImage,
               r.user_id AS replyingToUserId, r.username AS replyingToUsername
        FROM comments c
        JOIN users u ON c.user_id = u.user_id
        LEFT JOIN user_profile up ON up.user_id = u.user_id
        LEFT JOIN users r ON c.replying_to_user_id = r.user_id
        WHERE c.post_id = #{postId}
        ORDER BY c.created_at ASC
    """)
    List<CommentResponse> getCommentsByPost(Long postId);

    @Delete("DELETE FROM comments WHERE comment_id = #{commentId} AND user_id = #{userId}")
    int deleteComment(Long commentId, Long userId);
}

