package com.wsu.crimsonconnect.mapper;

import com.wsu.crimsonconnect.domain.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper {
    void insertUser(User user);
    User findByUsername(String username);
    User findByEmail(String email);
}
