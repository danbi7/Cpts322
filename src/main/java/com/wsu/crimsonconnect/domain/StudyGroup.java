package com.wsu.crimsonconnect.domain;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class StudyGroup {
    private Long groupId;
    private String name;
    private String description;
    private String fullDescription;
    private List<String> tags;
    private int memberCount;
    private int maxMembers;
    private boolean isPrivate;
    private boolean isMember;
    private boolean hasPendingRequest;
    private LocalDateTime createdAt;
}
