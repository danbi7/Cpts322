package com.wsu.crimsonconnect.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class User {
    private Long userId;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String passwordHash;
    private Boolean enabled;
}
