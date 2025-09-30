package com.wsu.crimsonconnect.service;

import com.wsu.crimsonconnect.domain.User;
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

        userMapper.enableUser(verificationToken.getUserId());
        verificationTokenMapper.deleteToken(verificationToken.getEmailId());
    }
}
