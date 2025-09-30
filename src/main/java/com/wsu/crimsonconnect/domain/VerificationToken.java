package com.wsu.crimsonconnect.domain;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class VerificationToken {
    private String emailId;
    private Long userId;
    private String token;
    private LocalDateTime expiryDate;
}
