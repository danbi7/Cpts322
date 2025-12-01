package com.wsu.crimsonconnect.domain;

import lombok.Data;

@Data
public class Comment {
    private Long commentId;
    private Long postId;
    private Long userId;
    private Integer replyingToUserId;
    private String content;
}

