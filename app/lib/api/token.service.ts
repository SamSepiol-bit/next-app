interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    role?: string;
}

class TokenService {
    private static readonly ACCESS_TOKEN_KEY = 'accessToken';
    private static readonly USER_KEY = 'user';

    //Get access token
    static getAccessToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    // setAccess token
    static setAccessToken(token: string): void {
        if (typeof window === 'undefined') return;
        return localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }

    // Remove Access token
    static removeAccessToken(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    }

    // get user data
    static getUser(): User | null {
        if (typeof window) return null;
        const userStr = localStorage.getItem(this.USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }

    //set user data
    static setUser(user: User): void {
        if (typeof window) return;
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    //remove user data
    static removeUser(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.USER_KEY);
    }

    // clear all user data
    static clearAuth(): void {
        this.removeAccessToken();
        this.removeUser();
    }

    //check if user is athenticated
    static isAuthenticated(): boolean {
        return !!this.getAccessToken();
    }

    //get auth headers for API requests
    static getAuthHeaders(): Record<string, string> {
        const token = this.getAccessToken();
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }

    //Get headers for GET requests (without Content-Type)
    static getAuthHeadersForGet(): Record<string, string> {
        const token = this.getAccessToken();
        const headers: Record<string, string> = {
            'Accept': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    }
}

export default TokenService;