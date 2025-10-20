package com.wsu.crimsonconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class ProfileResponse {
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String nickname;
    private String bio;
    private Date createdAt;
    private String profileImageUrl;
}
