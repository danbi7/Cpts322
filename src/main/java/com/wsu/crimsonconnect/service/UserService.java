package com.wsu.crimsonconnect.service;

import com.wsu.crimsonconnect.domain.User;
import com.wsu.crimsonconnect.dto.LoginRequest;
import com.wsu.crimsonconnect.dto.LoginResponse;
import com.wsu.crimsonconnect.dto.SignupRequest;
import com.wsu.crimsonconnect.mapper.UserMapper;
import com.wsu.crimsonconnect.mapper.VerificationTokenMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenMapper verificationTokenMapper;
    private final EmailService emailService;
    private final JwtService jwtService;

    public void registerUser(SignupRequest request){
        if (userMapper.findByUsername(request.getUsername()) != null) {
            throw new IllegalArgumentException("User name already exists.");
        }

        if(userMapper.findByEmail(request.getEmail()) != null){
            throw new IllegalArgumentException("Email address already exists.");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .enabled(false)
                .build();

        userMapper.insertUser(user);

        String token = UUID.randomUUID().toString();
        verificationTokenMapper.insertToken(user.getUserId(), token, LocalDateTime.now().plusHours(24));

        emailService.sendEmail(user.getEmail(), token);
    }


    public void verifyEmail(String token){
        var verificationToken = verificationTokenMapper.findByToken(token);
        if(verificationToken == null || verificationToken.getExpiryDate().isBefore(LocalDateTime.now())){
            throw new IllegalArgumentException("Invalid or expired verification token.");
        }

        userMapper.enableUser(verificationToken.getUserId()); // changed to token
        verificationTokenMapper.deleteToken(token);

    }
    // request password reset
    public void requestPasswordReset(String email) {
        User user = userMapper.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("No account found with that email.");
        }

        String token = UUID.randomUUID().toString();
        verificationTokenMapper.insertToken(user.getUserId(), token, LocalDateTime.now().plusHours(1));
        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    // reset password
    public void resetPassword(String token, String newPassword) {
        var verificationToken = verificationTokenMapper.findByToken(token);
        if (verificationToken == null || verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Invalid or expired reset token.");
        }

        userMapper.updatePassword(verificationToken.getUserId(), passwordEncoder.encode(newPassword));
        verificationTokenMapper.deleteToken(token);
    }

    public LoginResponse login(LoginRequest request){
        User user = userMapper.findByEmail(request.getEmail());

        if(user == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())){
            throw new RuntimeException("Invalid or expired password.");
        }

        if(!user.getEnabled()){
            throw new RuntimeException("Email not verified.");
        }

        String token = jwtService.generateToken(user.getUsername());

        return new LoginResponse(token);
    }
}
