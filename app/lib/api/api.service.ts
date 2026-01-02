import { API_CONFIG } from '@/app/utils/constants';
import TokenService from './token.service';

interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
}

interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
}

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
    }

    // Generic request method
    private async request<T>(
        endpoint: string,
        method: string = 'GET',
        body?: any,
        headers?: Record<string, string>,
        isFormData: boolean = false
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        
        // Default headers
        const defaultHeaders: Record<string, string> = {
            'Accept': 'application/json',
        };

        // Add auth headers if token exists
        const authHeaders = method === 'GET' 
            ? TokenService.getAuthHeadersForGet()
            : TokenService.getAuthHeaders();

        // Merge headers
        const requestHeaders = {
            ...defaultHeaders,
            ...authHeaders,
            ...headers,
        };

        // Remove Content-Type for FormData
        if (isFormData && requestHeaders['Content-Type']) {
            delete requestHeaders['Content-Type'];
        }

        // Prepare request config
        const config: RequestInit = {
            method,
            headers: requestHeaders,
            // credentials: 'include', // Include cookies if needed
        };

        // Add body if present
        if (body) {
            if (isFormData) {
                config.body = body;
            } else {
                config.body = JSON.stringify(body);
                if (!requestHeaders['Content-Type']) {
                    requestHeaders['Content-Type'] = 'application/json';
                }
            }
        }

        console.log(`📤 API Request: ${method} ${url}`);
        console.log('📤 Headers:', requestHeaders);
        if (body && !isFormData) {
            console.log('📤 Body:', body);
        }

        try {
            const response = await fetch(url, config);
            const responseText = await response.text();
            
            console.log(`📥 API Response: ${response.status} ${url}`);
            console.log('📥 Response:', responseText);

            let data: any;
            try {
                data = responseText ? JSON.parse(responseText) : {};
            } catch (error) {
                console.error('❌ JSON Parse Error:', error);
                throw {
                    message: 'Invalid server response',
                    status: response.status,
                } as ApiError;
            }

            // Handle non-OK responses
            if (!response.ok) {
                const error: ApiError = {
                    message: data.message || `Request failed with status ${response.status}`,
                    status: response.status,
                    errors: data.errors,
                };
                
                // Handle 401 Unauthorized (token expired)
                if (response.status === 401) {
                    TokenService.clearAuth();
                    // You might want to redirect to login here
                    window.location.href = '/login';
                }
                
                throw error;
            }

            return data as T;

        } catch (error: any) {
            console.error('❌ API Request Error:', error);
            
            // Re-throw API errors
            if (error.status) {
                throw error;
            }
            
            // Handle network errors
            throw {
                message: error.message || 'Network error. Please check your connection.',
                status: 0,
            } as ApiError;
        }
    }

    // GET request
    async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, 'GET', undefined, headers);
    }

    // POST request
    async post<T>(endpoint: string, body?: any, headers?: Record<string, string>, isFormData: boolean = false): Promise<T> {
        return this.request<T>(endpoint, 'POST', body, headers, isFormData);
    }

    // PUT request
    async put<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, 'PUT', body, headers);
    }

    // PATCH request
    async patch<T>(endpoint: string, body?: any, headers?: Record<string, string>): Promise<T> {
        return this.request<T>(endpoint, 'PATCH', body, headers);
    }

    // DELETE request
    
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService;