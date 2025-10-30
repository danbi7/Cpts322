package com.wsu.crimsonconnect.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JoinRequestListResponse {
    private Long userId;
    private String firstName;
    private String lastName;
    private String email;
    private String nickname;
    private String profileImageUrl;
}
