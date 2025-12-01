package com.wsu.crimsonconnect.controller;

import com.wsu.crimsonconnect.dto.CommentRequest;
import com.wsu.crimsonconnect.dto.CommentResponse;
import com.wsu.crimsonconnect.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/posts/{postId}/comments")
    public String createComment(
            @PathVariable Long postId,
            @RequestBody CommentRequest request,
            HttpServletRequest httpReq
    ) {
        Long userId = (Long) httpReq.getAttribute("userId");

        commentService.createComment(postId, userId, request);
        return "Comment added";
    }

    @GetMapping("/posts/{postId}/comments")
    public List<CommentResponse> getComments(@PathVariable Long postId) {
        return commentService.getComments(postId);
    }

    @DeleteMapping("/comments/{commentId}")
    public String deleteComment(
            @PathVariable Long commentId,
            HttpServletRequest httpReq
    ) {
        Long userId = (Long) httpReq.getAttribute("userId");

        commentService.deleteComment(commentId, userId);
        return "Comment deleted";
    }
}
