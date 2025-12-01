package com.wsu.crimsonconnect.service;

import com.wsu.crimsonconnect.domain.Post;
import com.wsu.crimsonconnect.dto.PostCreateRequest;
import com.wsu.crimsonconnect.dto.PostResponse;
import com.wsu.crimsonconnect.mapper.PostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostMapper postMapper;
    private final FileService fileService;

    public boolean isGroupMember(Long groupId, Long userId) {
        return postMapper.isGroupMember(groupId, userId);
    }

    public boolean isAuthor(Long userId, Long postId) {
        return postMapper.isAuthor(userId, postId);
    }

    @Transactional
    public String createPost(Long groupId, Long userId, PostCreateRequest request){
        boolean isMember = isGroupMember(groupId, userId);
        System.out.println("DEBUG: groupId=" + groupId + ", userId=" + userId + ", isMember=" + isMember);
        
        if(!isMember){
            return "You do not have permission to add this post";
        }

        postMapper.insertPost(groupId, userId, request);
        return "Post created";

//        if(request.getImages() != null && !request.getImages().isEmpty()){
//            for(MultipartFile image : request.getImages()){
//                String imageUrl = fileService.save(image);
//                postMapper.insertPostImage(post.getPostId(), imageUrl);
//            }
//        }
    }

    public ResponseEntity<List<PostResponse>> getPosts(Long groupId, Long userId, int limit, int offset){
        if(!isGroupMember(groupId, userId)){
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(
                postMapper.getPosts(groupId, limit, offset)
                        .stream()
                        .map(PostResponse::from)
                        .toList()
        );
    }

    @Transactional
    public ResponseEntity<Post> getPost(Long groupId, Long userId, Long postId){
        if(!isGroupMember(groupId, userId)){
            return ResponseEntity.badRequest().build();
        }

        postMapper.incrementViewCount(postId);
        return ResponseEntity.ok(postMapper.getPostById(postId));
    }

    @Transactional
    public String updatePost(Long groupId, Long postId, Long userId, PostCreateRequest request){
        if(!isGroupMember(groupId, userId)){
            return "You do not have permission to update this post";
        }

        if(!isAuthor(postId, userId)){
            return "You do not have permission to update this post";
        }

        postMapper.updatePost(postId, userId, request);
        return "Post updated";
    }

    @Transactional
    public String deletePost(Long groupId, Long postId, Long userId){
        if(!isGroupMember(groupId, userId)){
            return "You do not have permission to delete this post";
        }

        if(!isAuthor(userId, postId)){
            return "You do not have permission to delete this post";
        }

        postMapper.deletePost(postId, userId);
        return "Post deleted";
    }
}
