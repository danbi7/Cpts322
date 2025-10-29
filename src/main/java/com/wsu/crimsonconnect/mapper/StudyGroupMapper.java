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
        g.member_count AS memberCount,
        g.max_members AS maxMembers,
        g.is_private AS isPrivate,
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
        ) AS hasPendingRequest,
        g.created_at AS createdAt
    FROM study_groups g
    LEFT JOIN study_group_members m ON g.group_id = m.group_id
    WHERE 
        (#{search} IS NULL OR g.name LIKE CONCAT('%', #{search}, '%') OR g.description LIKE CONCAT('%', #{search}, '%'))
    GROUP BY g.group_id
    ORDER BY g.created_at DESC
    LIMIT #{limit} OFFSET #{offset}
    """)
    @Results(id = "StudyGroupResultMap", value = {
            @Result(property = "groupId", column = "groupId"),
            @Result(property = "name", column = "name"),
            @Result(property = "description", column = "description"),
            @Result(property = "fullDescription", column = "fullDescription"),
            @Result(property = "tags", column = "tags", typeHandler = com.wsu.crimsonconnect.config.JsonTypeHandler.class),
            @Result(property = "memberCount", column = "memberCount"),
            @Result(property = "maxMembers", column = "maxMembers"),
            @Result(property = "isPrivate", column = "isPrivate"),
            @Result(property = "isMember", column = "isMember"),
            @Result(property = "hasPendingRequest", column = "hasPendingRequest"),
            @Result(property = "createdAt", column = "createdAt")
    })
    List<StudyGroup> getStudyGroups(
            @Param("userId") Long userId,
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
        g.member_count AS memberCount,
        g.max_members AS maxMembers,
        g.is_private AS isPrivate,
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
        ) AS hasPendingRequest,
        g.created_at AS createdAt
    FROM study_groups g
    LEFT JOIN study_group_members m ON g.group_id = m.group_id
    WHERE g.group_id = #{groupId}
    GROUP BY g.group_id
    """)
    @ResultMap("StudyGroupResultMap")
    StudyGroup getStudyGroupById(@Param("groupId") Long groupId, @Param("userId") Long userId);

    @Insert("""
        INSERT INTO study_groups 
        (name, description, full_description, tags, max_members, is_private, created_by)
        VALUES (#{group.name}, #{group.description}, #{group.fullDescription}, #{group.tags, typeHandler=com.wsu.crimsonconnect.config.JsonTypeHandler},
                #{group.maxMembers}, #{group.isPrivate}, #{userId})
    """)
    @Options(useGeneratedKeys = true, keyProperty = "group.groupId")
    int createStudyGroup(@Param("group")StudyGroup group, @Param("userId") Long userId);

    @Update("""
        UPDATE study_groups
        SET name=#{group.name},
            description=#{group.description},
            full_description=#{group.fullDescription},
            tags=#{group.tags, typeHandler=com.wsu.crimsonconnect.config.JsonTypeHandler},
            max_members=#{group.maxMembers},
            is_private=#{group.isPrivate}
        WHERE group_id=#{group.groupId} AND created_by=#{userId}
    """)
    int updateStudyGroup(@Param("group")StudyGroup group, @Param("userId") Long userId);

    @Delete("""
        DELETE FROM study_groups
        WHERE group_id=#{groupId} AND created_by=#{userId}
    """)
    int deleteStudyGroup(@Param("groupId") Long groupId, @Param("userId") Long userId);

}