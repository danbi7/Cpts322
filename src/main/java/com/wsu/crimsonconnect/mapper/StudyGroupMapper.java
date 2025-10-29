package com.wsu.crimsonconnect.mapper;

import com.wsu.crimsonconnect.domain.StudyGroup;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface StudyGroupMapper {

    @Select("""
        SELECT 
            g.group_id AS groupId,
            g.name AS name,
            g.description AS description,
            g.full_description AS fullDescription,
            g.tags AS tags,
            g.max_members AS maxMembers,
            g.is_private AS isPrivate,
            g.created_at AS createdAt,
            COUNT(m.user_id) AS memberCount,
            EXISTS (
                SELECT 1 FROM study_group_members 
                WHERE user_id = #{userId} AND group_id = g.group_id
            ) AS isMember,
            EXISTS (
                SELECT 1 FROM study_group_requests 
                WHERE user_id = #{userId} 
                AND group_id = g.group_id 
                AND status = 'pending'
            ) AS hasPendingRequest
        FROM study_groups g
        LEFT JOIN study_group_members m ON g.group_id = m.group_id
        WHERE 
            (#{search} IS NULL OR g.name LIKE CONCAT('%', #{search}, '%') OR g.description LIKE CONCAT('%', #{search}, '%'))
        GROUP BY g.group_id
        ORDER BY g.created_at DESC
        LIMIT #{limit} OFFSET #{offset}
    """)
    List<StudyGroup> getStudyGroups(
            @Param("userId") int userId,
            @Param("search") String search,
            @Param("offset") int offset,
            @Param("limit") int limit
    );

    @Select("""
        SELECT COUNT(*) 
        FROM study_groups g
        WHERE 
            (#{search} IS NULL OR g.name LIKE CONCAT('%', #{search}, '%') OR g.description LIKE CONCAT('%', #{search}, '%'))
    """)
    int countStudyGroups(@Param("search") String search);

    @Select("""
        SELECT 
            g.group_id AS groupId,
            g.name AS name,
            g.description AS description,
            g.full_description AS fullDescription,
            g.tags AS tags,
            g.max_members AS maxMembers,
            g.is_private AS isPrivate,
            g.created_at AS createdAt,
            COUNT(m.user_id) AS memberCount,
            EXISTS (
                SELECT 1 FROM study_group_members 
                WHERE user_id = #{userId} AND group_id = g.group_id
            ) AS isMember,
            EXISTS (
                SELECT 1 FROM study_group_requests 
                WHERE user_id = #{userId} 
                AND group_id = g.group_id 
                AND status = 'pending'
            ) AS hasPendingRequest
        FROM study_groups g
        LEFT JOIN study_group_members m ON g.group_id = m.group_id
        WHERE g.group_id = #{groupId}
        GROUP BY g.group_id
    """)
    StudyGroup getStudyGroupById(@Param("groupId") int groupId, @Param("userId") int userId);
    @Insert("""
        INSERT INTO study_groups 
        (name, description, full_description, tags, max_members, is_private, created_by)
        VALUES (#{name}, #{description}, #{fullDescription},   #{tags, typeHandler=com.wsu.crimsonconnect.config.JsonTypeHandler},
                #{maxMembers}, #{isPrivate}, #{createdBy})
    """)
    @Options(useGeneratedKeys = true, keyProperty = "groupId")
    int createStudyGroup(StudyGroup group);

    @Update("""
        UPDATE study_groups
        SET name=#{name},
            description=#{description},
            full_description=#{fullDescription},
            tags=#{tags, typeHandler=com.wsu.crimsonconnect.config.JsonTypeHandler},
            max_members=#{maxMembers},
            is_private=#{isPrivate}
        WHERE group_id=#{groupId} AND created_by=#{createdBy}
    """)
    int updateStudyGroup(StudyGroup group);

    @Delete("""
        DELETE FROM study_groups
        WHERE group_id=#{groupId} AND created_by=#{createdBy}
    """)
    int deleteStudyGroup(@Param("groupId") Long groupId, @Param("createdBy") Long createdBy);

}