package com.wsu.crimsonconnect.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService{
    private final JavaMailSender mailSender;

    public void sendEmail(String toEmail, String token) {
        String subject = "Verify your email - Crimson Connect";
        String verificationUrl = "http://localhost:8080/api/auth/verify?token=" + token;

        String message = "Click the link to verify your email:\n" + verificationUrl;

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(toEmail);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);
        mailSender.send(mailMessage);
    }
}
