package com.wsu.crimsonconnect.controller;

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
}
