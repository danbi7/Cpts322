import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface SignupRequest {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
}

export const authAPI = {
    signup: async (data: SignupRequest) => {
        const response = await api.post('/auth/signup', data);
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
};

export default api;