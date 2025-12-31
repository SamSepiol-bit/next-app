export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
}

export const saveAuthData = (token: string, user: User) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

export const getAuthToken = (): string | null => {
    return localStorage.getItem(`accessToken`) || localStorage.getItem(`auth_token`);
};

export const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
};

export const verifyEmailCode = async (email: string, code: string, token: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verify-email`,
         {
            method: 'POST'
         })
}