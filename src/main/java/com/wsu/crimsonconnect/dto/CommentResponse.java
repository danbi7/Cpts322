package com.wsu.crimsonconnect.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {
    private Long commentId;
    private Long postId;
    private String content;
    private LocalDateTime createdAt;

    private Long userId;
    private String username;
    private String userProfileImage;

    private Long replyingToUserId;
    private String replyingToUsername;
}
