package com.wsu.crimsonconnect.controller;

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

    @PutMapping
    public ResponseEntity<String> updateProfile(@RequestBody ProfileUpdateRequest request, @RequestAttribute("userId") int userId) {
        profileService.updateProfile(userId, request);
        return ResponseEntity.ok().body("Profile updated successfully");
    }
}
