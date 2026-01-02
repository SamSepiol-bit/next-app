import { API_CONFIG } from '@/app/utils/constants';
import apiService from './api.service';
import TokenService from './token.service';

export interface LoginCredentials {
    email: string;
    password: string;
    role: string;
}

export interface RegisterCandidateData {
    name_with_initials: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    country_id: string;
    whatsapp_number: string;
    referral_code?: string;
    password: string;
    password_confirmation: string;
}

export interface LoginResponse {
    message?: string;
    user: any;
    accessToken: string;
    isVerified: boolean;
}

export interface VerificationResponse {
    message: string;
    success: boolean;
    data?: {
        accessToken?: string;
        user?: any;
    };
}

class AuthService {
    // Login user
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await apiService.post<LoginResponse>(
            API_CONFIG.ENDPOINTS.LOGIN,
            credentials
        );

        // Store token and user if login successful
        if (response.accessToken) {
            TokenService.setAccessToken(response.accessToken);
            TokenService.setUser(response.user);
        }

        return response;
    }

    // Register candidate
    async registerCandidate(data: RegisterCandidateData): Promise<LoginResponse> {
        // Format phone numbers
        const payload = {
            ...data,
            phone: data.phone.replace(/\D/g, ''),
            whatsapp_number: data.whatsapp_number.replace(/\D/g, ''),
            referral_code: data.referral_code || null,
        };

        const response = await apiService.post<LoginResponse>(
            API_CONFIG.ENDPOINTS.REGISTER_CANDIDATE,
            payload
        );

        // Store token and user if registration successful
        if (response.accessToken) {
            TokenService.setAccessToken(response.accessToken);
            TokenService.setUser(response.candidate);
        }

        return response;
    }

    // Send verification email
    async sendVerificationEmail(): Promise<VerificationResponse> {
        return await apiService.get<VerificationResponse>(
            API_CONFIG.ENDPOINTS.VERIFY_EMAIL
        );
    }

    // Verify OTP
    async verifyOTP(otp: string): Promise<VerificationResponse> {
        const response = await apiService.post<VerificationResponse>(
            API_CONFIG.ENDPOINTS.VERIFY_OTP,
            { otp }
        );

        // Update token if new one provided
        if (response.data?.accessToken) {
            TokenService.setAccessToken(response.data.accessToken);
        }

        // Update user data if provided
        if (response.data?.user) {
            TokenService.setUser(response.data.user);
        }

        return response;
    }

    // Resend verification OTP
    async resendVerificationOTP(): Promise<VerificationResponse> {
        return await apiService.post<VerificationResponse>(
            API_CONFIG.ENDPOINTS.RESEND_VERIFICATION,
            {}
        );
    }

    // Check verification status
    async checkVerificationStatus(): Promise<{ isVerified: boolean }> {
        return await apiService.get<{ isVerified: boolean }>(
            API_CONFIG.ENDPOINTS.VERIFICATION_STATUS
        );
    }

    // Forgot password
    async forgotPassword(email: string): Promise<{ message: string }> {
        return await apiService.post<{ message: string }>(
            API_CONFIG.ENDPOINTS.FORGOT_PASSWORD,
            { email }
        );
    }

    // Reset password
    async resetPassword(
        token: string, 
        email: string, 
        password: string, 
        password_confirmation: string
    ): Promise<{ message: string }> {
        return await apiService.post<{ message: string }>(
            API_CONFIG.ENDPOINTS.RESET_PASSWORD,
            { token, email, password, password_confirmation }
        );
    }

    // Logout
    async logout(): Promise<void> {
        try {
            // Call backend logout if endpoint exists
            await apiService.post('/api/logout');
        } catch (error) {
            console.log('Logout API call failed, clearing local storage');
        } finally {
            // Always clear local storage
            TokenService.clearAuth();
        }
    }

    // Get current user
    getCurrentUser(): any | null {
        return TokenService.getUser();
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        return TokenService.isAuthenticated();
    }

    // Get access token
    getAccessToken(): string | null {
        return TokenService.getAccessToken();
    }
}

// Create singleton instance
export const authService = new AuthService();
export default authService;