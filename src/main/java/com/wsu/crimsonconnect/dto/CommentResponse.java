package com.wsu.crimsonconnect.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentResponse {
    private Long commentId;
    private Long userId;
    private String nickname;
    private String profileImageUrl;
    private String replyingTo;
    private String content;
    private LocalDateTime createdAt;
}
