package com.wsu.crimsonconnect.mapper;

import com.wsu.crimsonconnect.domain.VerificationToken;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;

@Mapper
public interface VerificationTokenMapper {
    @Insert("INSERT INTO email_verification_token(user_id, token, expiry_date) " +
            "VALUES(#{userId}, #{token}, #{expiryDate})")
    void insertToken(Long userId, String token, LocalDateTime expiryDate);

    @Select("SELECT * FROM email_verification_token WHERE token = #{token}")
    VerificationToken findByToken(String token);

    @Delete("DELETE FROM email_verification_token WHERE email_id = #{emailId}")
    void deleteToken(String email_id);
}
