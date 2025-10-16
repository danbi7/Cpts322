package com.wsu.crimsonconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProfileUpdateRequest {
    private String nickname;
    private String bio;
    private String profileImageUrl;
}
