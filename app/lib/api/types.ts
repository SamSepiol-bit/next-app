// User types
export interface User {
    id: number;
    uuid: string;
    role_id: string;
    username: string;
    first_name: string;
    last_name: string;
    name_with_initials: string;
    phone: string;
    whatsapp_number: string;
    country_id: string;
    image: string | null;
    provider: string | null;
    provider_id: string | null;
    email: string;
    email_verified_at: string | null;
    status: string;
    blacklisted: boolean;
    kyc_status: string;
    kyc_reason: string | null;
    referral_code: string;
    referred_by: string | null;
    free_jobs_used: string;
    free_job_count: string;
    user_referred_count: string;
    plan_id: string | null;
    subscription_id: string | null;
    is_cv_published: string;
    cv_updated_at: string | null;
    is_blocked: string;
    admin_verified: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    email_verification_sent_at: string | null;
    pending_email: string | null;
    created_by: string | null;
    created_at_human: string;
    updated_at_human: string;
    full_name: string;
    avatar: string;
    country_name: string;
    is_online: boolean;
    unread_messages_count: number;
    available_free_jobs_count: number;
    referral_count: number;
    country: Country;
    meta_data: unknown[];
}

export interface Country {
    id: number;
    name: string;
    code: string;
    currency_code: string;
    phone_code: string;
    flag: string;
    flag_url: string;
    timezone: string;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    created_at_human: string;
    updated_at_human: string;
    country_name: string;
}

// Login response types
export interface LoginResponse {
    message?: string;
    user: User;
    accessToken: string;
    isVerified: boolean;
}

// Verification response types
export interface VerificationResponse {
    message: string;
    success: boolean;
    data?: {
        accessToken?: string;
        user?: User;
    };
}

// API Error response
export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}