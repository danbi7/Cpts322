package com.wsu.crimsonconnect.mapper;

import com.wsu.crimsonconnect.domain.Profile;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ProfileMapper {
    int updateProfile(Profile profile);
}
