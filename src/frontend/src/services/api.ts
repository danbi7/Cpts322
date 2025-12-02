import axios from 'axios';

const API_BASE_URL = 'https://crimson-connect-production-9cee.up.railway.app/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Token management
export const tokenManager = {
    getToken: () => localStorage.getItem('authToken'),
    setToken: (token: string) => localStorage.setItem('authToken', token),
    removeToken: () => localStorage.removeItem('authToken'),
    isAuthenticated: () => !!localStorage.getItem('authToken'),
};

// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = tokenManager.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            tokenManager.removeToken();
            // Redirect to login page if not already there
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export interface SignupRequest {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    token: string;
    newPassword: string;
}

export interface ProfileResponse {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    nickname: string;
    bio: string;
    createdAt: Date;
    profileImageUrl: string;
}

export interface ProfileUpdateRequest {
    nickname: string;
    bio: string;
    profileImageUrl: string;
}

export interface StudyGroupRequest {
    name: string;
    description: string;
    fullDescription: string;
    tags: string[];
    maxMembers: number;
    'private': boolean;
}

export interface StudyGroupResponse {
    groupId: number;
    name: string;
    description: string;
    fullDescription: string;
    tags: string[];
    memberCount: number;
    maxMembers: number;
    'private': boolean;
    'member': boolean;
    hasPendingRequest: boolean;
    createdAt: string;
}

export interface StudyGroupListResponse {
    groups: StudyGroupResponse[];
    pagination: {
        page: number;
        size: number;
        totalPages: number;
        totalItems: number;
    };
}

export interface JoinRequestProfile {
    requestId: number;
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    nickname: string;
    profileImageUrl: string;
}

export interface PostCreateRequest {
    title: string;
    content: string;
}

export interface PostResponseDTO {
    postId: number;
    title: string;
    content: string;
    viewCount: number;
    likeCount: number;
    createdAt: string;
    updatedAt?: string;
    userId: number;
    username: string;
    userProfileImage?: string;
}


export const authAPI = {
    signup: async (data: SignupRequest) => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },
    
    login: async (data: LoginRequest) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
    
    verifyEmail: async (token: string) => {
        const response = await api.get(`/auth/verify?token=${token}`);
        return response.data;
    },
    
    resendVerification: async (email: string) => {
        const response = await api.post('/auth/resend-verification', { email });
        return response.data;
    },
    
    requestPasswordReset: async (email: string) => {
        const response = await api.post(`/auth/reset-password-request?email=${encodeURIComponent(email)}`);
        return response.data;
    },
    
    resetPassword: async (token: string, newPassword: string) => {
        const response = await api.post(`/auth/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`);
        return response.data;
    },
};

export const profileAPI = {
    getProfile: async (): Promise<ProfileResponse> => {
        const response = await api.get('/profile');
        return response.data;
    },
    
    createProfile: async (data: ProfileUpdateRequest): Promise<string> => {
        const response = await api.post('/profile', data);
        return response.data;
    },
    
    updateProfile: async (data: ProfileUpdateRequest): Promise<ProfileResponse> => {
        const response = await api.put('/profile', data);
        return response.data;
    },
    
    deleteProfile: async (): Promise<void> => {
        const response = await api.delete('/profile');
        return response.data;
    },
};

export const studyGroupAPI = {
    getStudyGroups: async (userId: number, search?: string, page: number = 1, size: number = 10, filter: string = 'popular'): Promise<StudyGroupListResponse> => {
        // Avoid backend ORDER BY alias issue by falling back to popular when requesting myGroup
        const normalizedFilter = filter === 'myGroup' ? 'popular' : filter?.toLowerCase?.() || 'popular';
        const params = new URLSearchParams({
            userId: userId.toString(),
            page: page.toString(),
            size: size.toString(),
            filter: normalizedFilter
        });
        if (search) {
            params.append('search', search);
        }
        const response = await api.get(`/study-groups?${params}`);
        return response.data;
    },
    
    getStudyGroup: async (groupId: number, userId: number): Promise<StudyGroupResponse> => {
        const response = await api.get(`/study-groups/${groupId}?userId=${userId}`);
        return response.data;
    },
    
    createStudyGroup: async (data: StudyGroupRequest, userId: number): Promise<StudyGroupResponse> => {
        const response = await api.post(`/study-groups?userId=${userId}`, data);
        return response.data;
    },
    
    updateStudyGroup: async (groupId: number, data: StudyGroupRequest, userId: number): Promise<string> => {
        const response = await api.put(`/study-groups/${groupId}?userId=${userId}`, data);
        return response.data;
    },
    
    deleteStudyGroup: async (groupId: number, userId: number): Promise<string> => {
        const response = await api.delete(`/study-groups/${groupId}?userId=${userId}`);
        return response.data;
    },
    
    joinStudyGroup: async (groupId: number, userId: number): Promise<string> => {
        const response = await api.post(`/study-groups/${groupId}/join?userId=${userId}`);
        return response.data;
    },

    isAdmin: async (groupId: number, userId: number): Promise<boolean> => {
        const response = await api.get(`/study-groups/${groupId}/isAdmin?userId=${userId}`);
        return response.data;
    },

    getJoinRequests: async (groupId: number, userId: number): Promise<JoinRequestProfile[]> => {
        const response = await api.get(`/study-groups/${groupId}/requests?userId=${userId}`);
        return response.data;
    },

    approveJoinRequest: async (groupId: number, requestId: number, userId: number): Promise<string> => {
        const response = await api.post(`/study-groups/${groupId}/requests/${requestId}/approve?userId=${userId}`);
        return response.data;
    },

    rejectJoinRequest: async (groupId: number, requestId: number, userId: number): Promise<string> => {
        const response = await api.post(`/study-groups/${groupId}/requests/${requestId}/reject?userId=${userId}`);
        return response.data;
    },

    leaveStudyGroup: async (groupId: number, userId: number): Promise<string> => {
        const response = await api.post(`/study-groups/${groupId}/leave?userId=${userId}`);
        return response.data;
    },
};

export interface CommentRequest {
    content: string;
    replyingToUserId?: number;
}

export interface CommentResponse {
    commentId: number;
    postId: number;
    content: string;
    createdAt: string;
    userId: number;
    username: string;
    userProfileImage?: string;
    replyingToUserId?: number;
    replyingToUsername?: string;
}

export const postAPI = {
    getPosts: async (groupId: number, userId: number, limit: number = 10, offset: number = 0): Promise<PostResponseDTO[]> => {
        const response = await api.get(`/study-groups/${groupId}/posts?userId=${userId}&limit=${limit}&offset=${offset}`);
        return response.data;
    },
    createPost: async (groupId: number, userId: number, data: PostCreateRequest): Promise<string> => {
        const response = await api.post(`/study-groups/${groupId}/posts?userId=${userId}`, data);
        return response.data;
    },
    updatePost: async (groupId: number, userId: number, postId: number, data: PostCreateRequest): Promise<string> => {
        const response = await api.patch(`/study-groups/${groupId}/posts/${postId}?userId=${userId}`, data);
        return response.data;
    },
    deletePost: async (groupId: number, userId: number, postId: number): Promise<string> => {
        const response = await api.delete(`/study-groups/${groupId}/posts/${postId}?userId=${userId}`);
        return response.data;
    },
};

export const commentAPI = {
    getComments: async (postId: number): Promise<CommentResponse[]> => {
        const response = await api.get(`/posts/${postId}/comments`);
        return response.data;
    },
    createComment: async (postId: number, data: CommentRequest): Promise<string> => {
        const response = await api.post(`/posts/${postId}/comments`, data);
        return response.data;
    },
    deleteComment: async (commentId: number): Promise<string> => {
        const response = await api.delete(`/comments/${commentId}`);
        return response.data;
    },
};

export default api;