package com.wsu.crimsonconnect.domain;

import lombok.Data;

@Data
public class User {
    private Long userId;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String passwordHash;
}
