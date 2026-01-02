export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://jobsformycv.enricharcane.info',

    ENDPOINTS: {
        
        REGISTER_CANDIDATE: '/api/register/candidate',
        REGISTER_COMPANT: '/api/register/company',
        LOGIN: '/api/login',
        SOCIAL_LOGIN: '/api/auth/{provider}/redirect',
        SOCIAL_LOGIN_NEW: '/api/social-login',
        SOCIAL_LOGIN_APPLE: '/api/apple-social-login',
        SOCIAL_LOGIN_CALLBACK_COMPANY: '/api/auth/{provider}/callback/company',
        SOCIAL_LOGIN_CALLBACK_CANDIDATE: '/api/auth/{provider}/callback/candidate',
        FORGOT_PASSWORD: '/api/forgot-password',
        VERIFY_RESET_PASSWORD_OTP: '/api/auth/verify-otp',
        REST_PASSWORD: '/api/reset-password',
        VERIFY_EMAIL: '/api/verify-email',
        VERIFY_OTP: '/api/verify-otp',
        LOGOUT: '/api/logout'
    }
}