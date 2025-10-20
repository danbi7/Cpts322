package com.wsu.crimsonconnect.controller;

import com.wsu.crimsonconnect.dto.ProfileResponse;
import com.wsu.crimsonconnect.dto.ProfileUpdateRequest;
import com.wsu.crimsonconnect.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(@RequestAttribute("userId") int userId) {
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    @PutMapping
    public ResponseEntity<String> updateProfile(@RequestBody ProfileUpdateRequest request, @RequestAttribute("userId") int userId) {
        profileService.updateProfile(userId, request);
        return ResponseEntity.ok().body("Profile updated successfully");
    }

    @DeleteMapping
    public ResponseEntity<String> deleteProfile(@RequestAttribute("userId") int userId) {
        profileService.deleteProfile(userId);
        return ResponseEntity.ok().body("Profile deleted successfully");
    }
}
