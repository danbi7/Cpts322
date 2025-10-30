package com.wsu.crimsonconnect.domain;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PostImage {
    private Long imageId;
    private Long postId;
    private String imageUrl;
    private LocalDateTime uploadedAt;
}
