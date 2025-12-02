package com.wsu.crimsonconnect.controller;

import com.wsu.crimsonconnect.domain.Post;
import com.wsu.crimsonconnect.dto.PostCreateRequest;
import com.wsu.crimsonconnect.dto.PostResponse;
import com.wsu.crimsonconnect.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-groups/{groupId}/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping
    public ResponseEntity<String> createPost(@PathVariable Long groupId, @RequestParam Long userId, @RequestBody PostCreateRequest request) {
        return ResponseEntity.ok(postService.createPost(groupId, userId, request));
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getPosts(@PathVariable Long groupId, @RequestParam Long userId, @RequestParam(defaultValue = "10") int limit, @RequestParam(defaultValue = "0") int offset) {
        return postService.getPosts(groupId, userId, limit, offset);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<Post> getPost(@PathVariable Long groupId, @PathVariable Long postId, @RequestParam Long userId) {
        return postService.getPost(groupId, userId, postId);
    }

    @PatchMapping("/{postId}")
    public ResponseEntity<String> updatePost(@PathVariable Long groupId, @RequestParam Long userId, @RequestBody PostCreateRequest request, @PathVariable Long postId){
        return ResponseEntity.ok(postService.updatePost(groupId, postId, userId, request));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable Long postId, @RequestParam Long userId, @PathVariable Long groupId) {
        return ResponseEntity.ok(postService.deletePost(groupId, postId, userId));
    }
}
