import axios from 'axios';
import { baseURL } from '../../../environment';
import { ForgotPasswordRequest, LoginRequest, RegisterRequest, ResetPasswordRequest, Token } from './AuthTypes';


const AuthService = {
    register: async (data: RegisterRequest) => {
        const response = await axios.post(`${baseURL}auth/register`, data);
        return response.data;
    },

    login: async (data: LoginRequest) => {
        const response = await axios.post<Token>(`${baseURL}auth/login`, data);
        return response.data;
    },

    forgotPassword: async (data: ForgotPasswordRequest) => {
        const response = await axios.post(`${baseURL}auth/forgot-password`, data);
        return response.data;
    },

    resetPassword: async (data: ResetPasswordRequest) => {
        const response = await axios.post(`${baseURL}auth/reset-password`, data);
        return response.data;
    },

    checkTokenValidity: async (token: string) => {
        const response = await axios.get(`${baseURL}auth/check-token`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    verifyToken: async (data: { email: string; token: string }) => {
        const response = await axios.post(`${baseURL}auth/verify-token`, data);
        return response.data;
    },
};

export default AuthService;