package com.wsu.crimsonconnect.service;

import com.wsu.crimsonconnect.domain.User;
import com.wsu.crimsonconnect.dto.SignupRequest;
import com.wsu.crimsonconnect.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public void registerUser(SignupRequest request){
        if (userMapper.findByUsername(request.getUsername()) != null) {
            throw new IllegalArgumentException("User name already exists.");
        }

        if(userMapper.findByEmail(request.getEmail()) != null){
            throw new IllegalArgumentException("Email address already exists.");
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));

        userMapper.insertUser(user);
    }
}
