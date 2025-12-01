package com.wsu.crimsonconnect.dto;

import lombok.Data;

@Data
public class CommentRequest {
    private String content;
    private Long replyingToUserId;
}
