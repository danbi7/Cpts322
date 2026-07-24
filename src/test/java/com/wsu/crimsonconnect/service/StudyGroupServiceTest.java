package com.wsu.crimsonconnect.service;

import com.wsu.crimsonconnect.mapper.StudyGroupMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class StudyGroupServiceTest {
    @InjectMocks
    private StudyGroupService studyGroupService;

    @Mock
    private StudyGroupMapper studyGroupMapper;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void joinStudyGroup_alreadyMember(){
        Long studyGroupId = 1L;
        Long userId = 1L;

        when(studyGroupMapper.isUserInGroup(studyGroupId, userId)).thenReturn(true);
        String result = studyGroupService.joinStudyGroup(studyGroupId, userId);

        assertEquals("Already a member of this group.", result);
        verify(studyGroupMapper, never()).addMember(anyLong(), anyLong());
    }

    @Test
    void joinStudyGroup_privateGroup_createRequest(){
        Long studyGroupId = 1L;
        Long userId = 1L;

        when(studyGroupMapper.isUserInGroup(studyGroupId, userId)).thenReturn(false);
        when(studyGroupMapper.isGroupPrivate(studyGroupId)).thenReturn(true);
        when(studyGroupMapper.hasPendingRequest(studyGroupId, userId)).thenReturn(false);
        String result = studyGroupService.joinStudyGroup(studyGroupId, userId);

        assertEquals("Join request submitted (pending approval).", result);
        verify(studyGroupMapper, times(1)).createJoinRequest(anyLong(), anyLong());
    }

    @Test
    void joinStudyGroup_publicGroup_full(){
        Long studyGroupId = 1L;
        Long userId = 1L;

        when(studyGroupMapper.isUserInGroup(studyGroupId, userId)).thenReturn(false);
        when(studyGroupMapper.isGroupPrivate(studyGroupId)).thenReturn(false);
        when(studyGroupMapper.getMemberCount(studyGroupId)).thenReturn(10);
        when(studyGroupMapper.getMaxMembers(studyGroupId)).thenReturn(10);
        String result = studyGroupService.joinStudyGroup(studyGroupId, userId);

        assertEquals("Group is full.", result);
        verify(studyGroupMapper, never()).addMember(any(), any());
    }

    @Test
    void joinStudyGroup_publicGroup_success(){
        Long studyGroupId = 1L;
        Long userId = 1L;

        when(studyGroupMapper.isUserInGroup(studyGroupId, userId)).thenReturn(false);
        when(studyGroupMapper.isGroupPrivate(studyGroupId)).thenReturn(false);
        when(studyGroupMapper.getMemberCount(studyGroupId)).thenReturn(5);
        when(studyGroupMapper.getMaxMembers(studyGroupId)).thenReturn(10);
        String result = studyGroupService.joinStudyGroup(studyGroupId, userId);

        assertEquals("Joined study group successfully.", result);
        verify(studyGroupMapper, times(1)).addMember(studyGroupId, userId);
        verify(studyGroupMapper, times(1)).incrementMemberCount(studyGroupId);
    }
}
