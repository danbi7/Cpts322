package com.wsu.crimsonconnect.mapper;

import com.wsu.crimsonconnect.domain.Profile;
import com.wsu.crimsonconnect.dto.ProfileResponse;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface ProfileMapper {
    @Select("""
        SELECT 
            u.username AS username,
            u.first_name AS firstName,
            u.last_name AS lastName,
            u.email AS email,
            p.nickname AS nickname,
            p.bio AS bio,
            p.created_at AS createdAt,
            p.profile_image_url AS profileImageUrl
        FROM users u
        LEFT JOIN user_profile p ON u.user_id = p.user_id
        WHERE u.user_id = #{userId}
    """)
    ProfileResponse getProfile(int userId);

    @Update("""
        UPDATE user_profile 
        SET nickname = #{nickname}, 
            bio = #{bio}, 
            profile_image_url = #{profileImageUrl},
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = #{userId}
    """)
    int updateProfile(Profile profile);

    @Delete("DELETE FROM users WHERE user_id = #{userId}")
    int deleteProfile(int userId);
}
