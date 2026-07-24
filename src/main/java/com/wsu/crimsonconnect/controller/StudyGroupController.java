package com.wsu.crimsonconnect.controller;
import com.wsu.crimsonconnect.dto.JoinRequestListResponse;
import com.wsu.crimsonconnect.dto.StudyGroupRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.wsu.crimsonconnect.domain.User;
import com.wsu.crimsonconnect.dto.StudyGroupListResponse;
import com.wsu.crimsonconnect.dto.StudyGroupResponse;
import com.wsu.crimsonconnect.service.StudyGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-groups")
@RequiredArgsConstructor
public class StudyGroupController {
    private final StudyGroupService studyGroupService;

    @GetMapping
    public StudyGroupListResponse getStudyGroups(@RequestParam Long userId, @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "popular") String filter){
        return studyGroupService.getStudyGroups(userId, search, page, size, filter);
    }

    @GetMapping("/{groupId}")
    public StudyGroupResponse getStudyGroup(@PathVariable("groupId") Long groupId, @RequestParam Long userId){
        return studyGroupService.getStudyGroupById(groupId, userId);
    }
    @PostMapping
    public StudyGroupResponse createStudyGroup(@RequestBody StudyGroupRequest request, @RequestParam Long userId) {
        Long newGroupId = studyGroupService.createStudyGroup(request, userId);
        return studyGroupService.getStudyGroupById(newGroupId, userId);
    }

    @PutMapping("/{id}")
    public String updateStudyGroup(@PathVariable Long id, @RequestBody StudyGroupRequest request, @RequestParam Long userId) {
        studyGroupService.updateStudyGroup(id, request, userId);
        return "Group updated successfully";
    }

    @DeleteMapping("/{id}")
    public String deleteStudyGroup(@PathVariable Long id, @RequestParam Long userId) {
        studyGroupService.deleteStudyGroup(id, userId);
        return "Group deleted successfully";
    }

    @PostMapping("/{groupId}/join")
    public String joinStudyGroup(@PathVariable Long groupId, @RequestParam Long userId) {
        return studyGroupService.joinStudyGroup(groupId, userId);
    }

    @PostMapping("/{groupId}/requests/{requestId}/approve")
    public String approveRequest(@PathVariable Long groupId, @PathVariable Long requestId, @RequestParam Long userId) {
        return studyGroupService.approveRequest(groupId, requestId, userId);
    }

    @PostMapping("/{groupId}/requests/{requestId}/reject")
    public String rejectRequest(@PathVariable Long groupId, @PathVariable Long requestId, @RequestParam Long userId) {
        return studyGroupService.rejectRequest(groupId, requestId,userId);
    }

    @GetMapping("/{groupId}/requests")
    public List<JoinRequestListResponse> getRequests(@PathVariable Long groupId, @RequestParam Long userId) {
        return studyGroupService.getRequestList(groupId, userId);
    }

    @GetMapping("/{groupId}/isAdmin")
    public boolean isAdmin(@PathVariable Long groupId, @RequestParam Long userId) {
        return studyGroupService.isAdmin(groupId, userId);
    }

    @PostMapping("/{groupId}/leave")
    public String leaveStudyGroup(@PathVariable Long groupId, @RequestParam Long userId) {
        return studyGroupService.leaveStudyGroup(groupId, userId);
    }
}
