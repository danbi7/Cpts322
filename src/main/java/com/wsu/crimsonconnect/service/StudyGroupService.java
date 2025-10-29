package com.wsu.crimsonconnect.service;
import com.wsu.crimsonconnect.dto.StudyGroupRequest;

import com.wsu.crimsonconnect.domain.StudyGroup;
import com.wsu.crimsonconnect.dto.StudyGroupListResponse;
import com.wsu.crimsonconnect.dto.StudyGroupResponse;
import com.wsu.crimsonconnect.mapper.StudyGroupMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyGroupService {
    private final StudyGroupMapper studyGroupMapper;

    public StudyGroupListResponse getStudyGroups(Long userId, String search, int page, int size, String filter) {
        int offset = (page - 1) * size;
        String orderBy;

        switch (filter) {
            case "popular":
                orderBy = "member_count DESC";
                break;
            case "mygroup":
                orderBy = "is_member DESC, created_at DESC";
                break;
            default:
                orderBy = "created_at DESC";
        }

        List<StudyGroup> groups = studyGroupMapper.getStudyGroups(userId, search, size, offset, orderBy);
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

    public StudyGroupResponse getStudyGroupById(Long groupId, Long userId) {
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

        studyGroupMapper.createStudyGroup(group, userId);
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

        studyGroupMapper.updateStudyGroup(group, userId);
    }

    public void deleteStudyGroup(Long groupId, Long userId) {
        studyGroupMapper.deleteStudyGroup(groupId, userId);
    }

    public String joinStudyGroup(Long groupId, Long userId) {
        boolean alreadyMember = studyGroupMapper.isUserInGroup(groupId, userId);

        if(alreadyMember){
            return "Already a member of this group.";
        }

        boolean isPrivate = studyGroupMapper.isGroupPrivate(groupId);

        if(isPrivate){
            boolean alreadyRequested = studyGroupMapper.hasPendingRequest(groupId, userId);
            if(alreadyRequested){
                return "Join request already pending.";
            }

            studyGroupMapper.createJoinRequest(groupId, userId);
            return "Join request submitted (pending approval).";
        }else{
            int memberCount = studyGroupMapper.getMemberCount(groupId);
            int maxMembers = studyGroupMapper.getMaxMembers(groupId);
            if(memberCount >= maxMembers){
                return "Group is full.";
            }

            studyGroupMapper.addMember(groupId, userId);
            studyGroupMapper.incrementMemberCount(groupId);
            return "Joined study group successfully.";
        }
    }
}