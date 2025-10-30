package com.wsu.crimsonconnect.mapper;

import com.wsu.crimsonconnect.domain.Post;
import com.wsu.crimsonconnect.dto.PostCreateRequest;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface PostMapper {
    @Select("""
        SELECT EXISTS(
            SELECT 1 FROM study_group_members 
            WHERE group_id = #{groupId} AND user_id = #{userId})
    """)
    boolean isGroupMember(@Param("groupId") Long groupId, @Param("userId") Long userId);

    @Select("""
        SELECT EXISTS(
            SELECT 1 FROM posts 
            WHERE user_id = #{userId} AND post_id = #{postId})
    """)
    boolean isAuthor(Long userId, Long postId);

    @Insert("""
        INSERT INTO posts (group_id, user_id, title, content)
        VALUES (#{groupId}, #{userId}, #{title}, #{content})
    """)
    @Options(useGeneratedKeys = true, keyProperty = "postId")
    void insertPost(Long groupId, Long userId, PostCreateRequest request);

    @Insert("""
        INSERT INTO post_images (post_id, image_url)
        VALUES (#{postId}, #{imageUrl})
    """)
    void insertPostImage(@Param("postId") Long postId, @Param("imageUrl") String imageUrl);

    @Select("""
        SELECT * FROM posts
        WHERE group_id = #{groupId}
        ORDER BY created_at DESC
        LIMIT #{limit} OFFSET #{offset}
    """)
    @Results(id = "postListResultMap", value = {
            @Result(property = "postId", column = "post_id"),
            @Result(property = "groupId", column = "group_id"),
            @Result(property = "userId", column = "user_id"),
            @Result(property = "createdAt", column = "created_at"),
            @Result(property = "updatedAt", column = "updated_at") })
    List<Post> getPosts(@Param("groupId") Long groupId,
                        @Param("limit") int limit,
                        @Param("offset") int offset);

    @Select("""
        SELECT * FROM posts WHERE post_id = #{postId}
    """)
    @Results(id = "postResultMap", value = {
            @Result(property = "postId", column = "post_id"),
            @Result(property = "groupId", column = "group_id"),
            @Result(property = "userId", column = "user_id"),
            @Result(property = "createdAt", column = "created_at"),
            @Result(property = "updatedAt", column = "updated_at") })
    Post getPostById(@Param("postId") Long postId);

    @Update("""
        UPDATE posts
        SET title = #{request.title}, content = #{request.content}, updated_at = CURRENT_TIMESTAMP
        WHERE post_id = #{postId} AND user_id = #{userId}
    """)
    int updatePost(@Param("postId") Long postId, @Param("userId") Long userId, @Param("request") PostCreateRequest request);

    @Delete("""
        DELETE FROM posts WHERE post_id = #{postId} AND user_id = #{userId}
    """)
    int deletePost(@Param("postId") Long postId, @Param("userId") Long userId);

    @Update("""
        UPDATE posts SET view_count = view_count + 1 WHERE post_id = #{postId}
    """)
    int incrementViewCount(@Param("postId") Long postId);

    @Update("""
        UPDATE posts SET like_count = like_count + #{delta} WHERE post_id = #{postId}
    """)
    int updateLikeCount(@Param("postId") Long postId, @Param("delta") int delta);
}
