
import { LoginResponse } from '../types/auth';
import { VerificationResponse } from './api/types';
import { ApiError } from 'next/dist/server/api-utils'; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
    const responseText = await response.text();
    
    if (!responseText) {
        throw new Error('Empty response from server');
    }

    try {
        const data = JSON.parse(responseText);
        
        if (!response.ok) {
            const error: ApiError = {
                message: data.message || `Request failed with status ${response.status}`,
                errors: data.errors
            };
            throw error;
        }
        
        return data;
    } catch (jsonError) {
        console.error('JSON parse error:', jsonError, 'Response:', responseText);
        throw new Error('Invalid JSON response from server');
    }
}

// Login API
export async function login(email: string, password: string, role: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
    });

    return handleResponse<LoginResponse>(response);
}

// Send verification email API
export async function sendVerificationEmail(): Promise<VerificationResponse> {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/verify-email`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    return handleResponse<VerificationResponse>(response);
}

// Resend verification OTP API
export async function resendVerificationOTP(email: string): Promise<VerificationResponse> {
    const response = await fetch(`${API_BASE_URL}/api/resend-verification`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    return handleResponse<VerificationResponse>(response);
}

// Verify OTP API
export async function verifyOTP(otp: string): Promise<VerificationResponse> {
    const token = localStorage.getItem('accessToken');
    
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/api/verify-otp`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ otp }),
    });

    return handleResponse<VerificationResponse>(response);
}

// Check if user is verified
export async function checkVerificationStatus(): Promise<{ isVerified: boolean }> {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
        throw new Error('No authentication token found');
    }

    const response = await fetch(`${API_BASE_URL}/api/verification-status`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    return handleResponse<{ isVerified: boolean }>(response);
}

// Registration API
export async function registerCandidate(formData: any): Promise<LoginResponse> {
    const payload = {
        name_with_initials: formData.name_with_initials,
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone.replace(/\D/g, ''),
        country_id: formData.country_id,
        whatsapp_number: formData.whatsapp_number.replace(/\D/g, ''),
        referral_code: formData.referral_code || null,
        password: formData.password,
        password_confirmation: formData.password_confirmation
    };

    const response = await fetch(`${API_BASE_URL}/api/register/candidate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    return handleResponse<LoginResponse>(response);
}