package com.wsu.crimsonconnect.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Profile {
    private int profileId;
    private int userId;
    private String nickname;
    private String bio;
    private String profileImageUrl;
}
