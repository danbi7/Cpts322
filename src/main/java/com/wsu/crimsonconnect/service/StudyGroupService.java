package com.wsu.crimsonconnect.service;

import com.wsu.crimsonconnect.domain.StudyGroup;
import com.wsu.crimsonconnect.dto.StudyGroupListResponse;
import com.wsu.crimsonconnect.dto.StudyGroupResponse;
import com.wsu.crimsonconnect.mapper.StudyGroupMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudyGroupService {
    private StudyGroupMapper studyGroupMapper;

    public StudyGroupListResponse getStudyGroups(int userId, String search, int page, int size) {
        int offset = (page - 1) * size;
        List<StudyGroup> groups = studyGroupMapper.getStudyGroups(userId, search, offset, size);
        int totalItems = studyGroupMapper.countStudyGroups(search);

        List<StudyGroupResponse> groupResponses = groups.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        StudyGroupListResponse.Pagination pagination = StudyGroupListResponse.Pagination.builder()
                .page(page)
                .size(size)
                .totalItems(totalItems)
                .totalPages((int) Math.ceil((double) totalItems / size))
                .build();

        return StudyGroupListResponse.builder()
                .groups(groupResponses)
                .pagination(pagination)
                .build();
    }

    public StudyGroupResponse getStudyGroupById(int groupId, int userId) {
        StudyGroup group = studyGroupMapper.getStudyGroupById(groupId, userId);
        return toResponse(group);
    }

    private StudyGroupResponse toResponse(StudyGroup group) {
        return StudyGroupResponse.builder()
                .groupId(group.getGroupId())
                .name(group.getName())
                .description(group.getDescription())
                .fullDescription(group.getFullDescription())
                .tags(group.getTags())
                .memberCount(group.getMemberCount())
                .maxMembers(group.getMaxMembers())
                .isPrivate(group.isPrivate())
                .isMember(group.isMember())
                .hasPendingRequest(group.isHasPendingRequest())
                .createdAt(group.getCreatedAt())
                .build();
    }
}