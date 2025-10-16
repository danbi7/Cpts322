package com.wsu.crimsonconnect.service;

import com.wsu.crimsonconnect.domain.Profile;
import com.wsu.crimsonconnect.dto.ProfileUpdateRequest;
import com.wsu.crimsonconnect.mapper.ProfileMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileMapper profileMapper;

    public void updateProfile(int userId, ProfileUpdateRequest profileUpdateRequest) {
        Profile profile = Profile.builder()
                .userId(userId)
                .nickname(profileUpdateRequest.getNickname())
                .bio(profileUpdateRequest.getBio())
                .profileImageUrl(profileUpdateRequest.getBio())
                .build();

        profileMapper.updateProfile(profile);
    }
}
