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
        String verificationUrl = "http://localhost:3000/verify-email?token=" + token;

        String message = "Welcome to Crimson Connect!\n\n" +
                        "Click the link below to verify your email:\n\n" +
                        verificationUrl + "\n\n" +
                        "This link expires in 24 hours.";

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(toEmail);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);
        mailSender.send(mailMessage);
    }
    // Password reset email
    public void sendPasswordResetEmail(String toEmail, String token) {
        String subject = "Password Reset - Crimson Connect";
        String resetUrl = "http://localhost:3000/reset-password?token=" + token;

        String message = "Click the link below to reset your password:\n\n" +
                        resetUrl + "\n\n" +
                        "This link expires in 1 hour.\n\n" +
                        "Didn't request this? Ignore this email.";

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(toEmail);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);
        mailSender.send(mailMessage);
    }
}
