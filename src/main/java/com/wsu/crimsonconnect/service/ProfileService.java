package com.wsu.crimsonconnect.service;

import com.wsu.crimsonconnect.domain.Profile;
import com.wsu.crimsonconnect.dto.ProfileResponse;
import com.wsu.crimsonconnect.dto.ProfileUpdateRequest;
import com.wsu.crimsonconnect.mapper.ProfileMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileMapper profileMapper;

    public ProfileResponse getProfile(int userId){
        return profileMapper.getProfile(userId);
    }

    public void createProfile(int userId, ProfileUpdateRequest profileUpdateRequest){
        Profile profile = Profile.builder()
                .userId(userId)
                .nickname(profileUpdateRequest.getNickname())
                .bio(profileUpdateRequest.getBio())
                .profileImageUrl(profileUpdateRequest.getProfileImageUrl())
                .build();

        profileMapper.createProfile(profile);
    }

    public void updateProfile(int userId, ProfileUpdateRequest profileUpdateRequest) {
        Profile profile = Profile.builder()
                .userId(userId)
                .nickname(profileUpdateRequest.getNickname())
                .bio(profileUpdateRequest.getBio())
                .profileImageUrl(profileUpdateRequest.getProfileImageUrl())
                .build();

        profileMapper.updateProfile(profile);
    }

    public void deleteProfile(int userId){
        profileMapper.deleteProfile(userId);
    }
}
