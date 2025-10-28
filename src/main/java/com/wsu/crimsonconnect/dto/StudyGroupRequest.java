package com.wsu.crimsonconnect.dto;

import lombok.Data;
import java.util.List;

@Data
public class StudyGroupRequest {
    private String name;
    private String description;
    private String fullDescription;
    private List<String> tags;
    private int maxMembers;
    private boolean isPrivate;
}
