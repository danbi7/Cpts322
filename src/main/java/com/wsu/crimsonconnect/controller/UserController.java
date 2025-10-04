package com.wsu.crimsonconnect.controller;

import com.wsu.crimsonconnect.dto.SignupRequest;
import com.wsu.crimsonconnect.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupRequest request) {
        userService.registerUser(request);
        return ResponseEntity.ok("Singup Successful! Please check your email for verification.");
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verify(@RequestParam String token) {
        userService.verifyEmail(token);
        return ResponseEntity.ok("Email verified successfully!");
    }

    // Request password reset (send email)
    @PostMapping("/reset-password-request")
    public ResponseEntity<String> requestPasswordReset(@RequestParam String email) {
        userService.requestPasswordReset(email);
        return ResponseEntity.ok("Password reset email sent (if the account exists).");
    }

    //  Reset password
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestParam String token,
                                                @RequestParam String newPassword) {
        userService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Password has been reset successfully.");
    }

}
