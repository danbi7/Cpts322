import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

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
    isPrivate: boolean;
}

export interface StudyGroupResponse {
    groupId: number;
    name: string;
    description: string;
    fullDescription: string;
    tags: string[];
    memberCount: number;
    maxMembers: number;
    isPrivate: boolean;
    isMember: boolean;
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
        const params = new URLSearchParams({
            userId: userId.toString(),
            page: page.toString(),
            size: size.toString(),
            filter: filter
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
};


export default api;