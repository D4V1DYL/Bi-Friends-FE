export interface RegisterRequest {
    username: string;
    nim: string;
    email: string;
    password: string;
    gender: string;
    profile_picture?: string;
}

export interface LoginRequest {
    nim: string;
    password: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    token: string;
    new_password: string;
    confirm_password: string;
}

export interface Token {
    access_token: string;
    token_type: string;
}