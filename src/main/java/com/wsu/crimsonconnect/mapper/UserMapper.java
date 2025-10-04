package com.wsu.crimsonconnect.mapper;

import com.wsu.crimsonconnect.domain.User;
import org.apache.ibatis.annotations.*;

@Mapper
public interface UserMapper {
    @Insert("INSERT INTO users (first_name, last_name, username, email, password_hash, enabled) " +
            "VALUES (#{firstName}, #{lastName}, #{username}, #{email}, #{passwordHash}, #{enabled})")
    @Options(useGeneratedKeys = true, keyProperty = "userId")
    void insertUser(User user);

    @Select("SELECT * FROM users WHERE username = #{username}")
    User findByUsername(String username);

    @Select("SELECT * FROM users WHERE email = #{email}")
    User findByEmail(String email);

    @Update("UPDATE users SET enabled = true WHERE user_id = #{userId}")
    void enableUser(Long userId);
    @Update("UPDATE users SET password_hash = #{passwordHash} WHERE user_id = #{userId}")
    void updatePassword(Long userId, String passwordHash);
}
