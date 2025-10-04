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

export default api;