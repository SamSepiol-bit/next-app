
const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://jobsformycv.enricharcane.info',
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10),
  
  ENDPOINTS: {
    PROFILE: '/api/candidate-profile',
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    VERIFY_EMAIL: '/api/verify-email',
    VERIFY_OTP: '/api/verify-otp',
  },
  
  getUrl: (endpoint: string) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  },
};

export default API_CONFIG;