package com.wsu.crimsonconnect.controller;
import com.wsu.crimsonconnect.dto.StudyGroupRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.wsu.crimsonconnect.domain.User;
import com.wsu.crimsonconnect.dto.StudyGroupListResponse;
import com.wsu.crimsonconnect.dto.StudyGroupResponse;
import com.wsu.crimsonconnect.service.StudyGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/study-groups")
@RequiredArgsConstructor
public class StudyGroupController {
    private final StudyGroupService studyGroupService;

    @GetMapping
    public StudyGroupListResponse getStudyGroups(@RequestParam int userId, @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size){
        return studyGroupService.getStudyGroups(userId, search, page, size);
    }

    @GetMapping("/{groupId}")
    public StudyGroupResponse getStudyGroup(@PathVariable("groupId") int groupId, @RequestParam int userId){
        return studyGroupService.getStudyGroupById(groupId, userId);
    }
    @PostMapping
    public StudyGroupResponse createStudyGroup(@RequestBody StudyGroupRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        Long userId = user.getUserId();

        Long newGroupId = studyGroupService.createStudyGroup(request, userId);
        return StudyGroupResponse.builder()
                .groupId(newGroupId)
                .name(request.getName())
                .description(request.getDescription())
                .fullDescription(request.getFullDescription())
                .tags(request.getTags())
                .maxMembers(request.getMaxMembers())
                .isPrivate(request.isPrivate())
                .memberCount(0)
                .isMember(true)
                .hasPendingRequest(false)
                .createdAt(java.time.LocalDateTime.now())
                .build();
    }

    @PutMapping("/{id}")
    public String updateStudyGroup(@PathVariable Long id, @RequestBody StudyGroupRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        Long userId = user.getUserId();

        studyGroupService.updateStudyGroup(id, request, userId);
        return "Group updated successfully";
    }

    @DeleteMapping("/{id}")
    public String deleteStudyGroup(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        Long userId = user.getUserId();

        studyGroupService.deleteStudyGroup(id, userId);
        return "Group deleted successfully";
    }

}
