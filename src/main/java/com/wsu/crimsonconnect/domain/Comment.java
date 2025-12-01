package com.wsu.crimsonconnect.domain;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Comment {
    private Long commentId;
    private Long postId;
    private Long userId;
    private Long replyingToUserId;
    private String content;
    private LocalDateTime createdAt;
}
