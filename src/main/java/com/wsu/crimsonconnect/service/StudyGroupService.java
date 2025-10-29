package com.wsu.crimsonconnect.service;
import com.wsu.crimsonconnect.dto.StudyGroupRequest;

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
    public Long createStudyGroup(StudyGroupRequest request, Long userId) {
        StudyGroup group = StudyGroup.builder()
                .name(request.getName())
                .description(request.getDescription())
                .fullDescription(request.getFullDescription())
                .tags(request.getTags())
                .maxMembers(request.getMaxMembers())
                .isPrivate(request.isPrivate())
                .createdAt(java.time.LocalDateTime.now())
                .build();

        studyGroupMapper.createStudyGroup(group);
        return group.getGroupId();
    }

    public void updateStudyGroup(Long groupId, StudyGroupRequest request, Long userId) {
        StudyGroup group = StudyGroup.builder()
                .groupId(groupId)
                .name(request.getName())
                .description(request.getDescription())
                .fullDescription(request.getFullDescription())
                .tags(request.getTags())
                .maxMembers(request.getMaxMembers())
                .isPrivate(request.isPrivate())
                .build();

        studyGroupMapper.updateStudyGroup(group);
    }

    public void deleteStudyGroup(Long groupId, Long userId) {
        studyGroupMapper.deleteStudyGroup(groupId, userId);
    }
}