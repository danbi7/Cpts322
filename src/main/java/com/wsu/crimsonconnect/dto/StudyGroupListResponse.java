package com.wsu.crimsonconnect.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudyGroupListResponse {
    private List<StudyGroupResponse> groups;
    private Pagination pagination;

    @Getter
    @Setter
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Pagination{
        private int page;
        private int size;
        private int totalPages;
        private long totalItems;
    }
}
