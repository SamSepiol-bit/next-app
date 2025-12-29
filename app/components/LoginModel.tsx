import { LogIn, Mail, User, X, Lock, EyeOff, Eye, Phone, Globe, MessageSquare } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import { FcGoogle } from "react-icons/fc";
import { useRouter } from 'next/navigation'; // Changed from react-router-dom

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (userData: any, token: string) => void;
}

interface Country {
    id: number;
    name: string;
    code: string;
}

interface CandidateFormData {
    name_with_initials: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    country_id: string;
    whatsapp_number: string;
    referral_code: string;
    password: string;
    password_confirmation: string;
}

interface LoginFormData {
    email: string;
    password: string;
    role: string;
}

// Mock API - updated with login functionality
const mockApi = {
    // Registration mock
    registerCandidate: async (data: any) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const errors: any = {};
        
        if (!data.name_with_initials) {
            errors.name_with_initials = ['Name with initials is required'];
        }
        
        if (!data.first_name) {
            errors.first_name = ['First name is required'];
        }
        
        if (!data.last_name) {
            errors.last_name = ['Last name is required'];
        }
        
        if (!data.email) {
            errors.email = ['Email is required'];
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = ['Email must be a valid email'];
        }
        
        if (!data.phone) {
            errors.phone = ['Phone number is required'];
        } else {
            const phoneDigits = data.phone.replace(/\D/g, '');
            if (phoneDigits.length < 10 || phoneDigits.length > 15) {
                errors.phone = ['Phone number must contain 10 to 15 digits'];
            }
        }
        
        if (!data.whatsapp_number) {
            errors.whatsapp_number = ['WhatsApp number is required'];
        } else {
            const whatsappDigits = data.whatsapp_number.replace(/\D/g, '');
            if (whatsappDigits.length < 10 || whatsappDigits.length > 15) {
                errors.whatsapp_number = ['Whatsapp number must contain 10 to 15 digits'];
            }
        }
        
        if (!data.country_id) {
            errors.country_id = ['Country is required'];
        } else if (isNaN(parseInt(data.country_id))) {
            errors.country_id = ['Invalid country selected'];
        }
        
        if (!data.password) {
            errors.password = ['Password is required'];
        } else {
            const passwordErrors = [];
            if (data.password.length < 8) passwordErrors.push('Password must be at least 8 characters');
            if (!/(?=.*[a-z])/.test(data.password)) passwordErrors.push('Must contain lowercase letter');
            if (!/(?=.*[A-Z])/.test(data.password)) passwordErrors.push('Must contain uppercase letter');
            if (!/(?=.*\d)/.test(data.password)) passwordErrors.push('Must contain number');
            if (!/(?=.*[!@#$%^&*])/.test(data.password)) passwordErrors.push('Must contain special character');
            
            if (passwordErrors.length > 0) {
                errors.password = passwordErrors;
            }
        }
        
        if (data.password !== data.password_confirmation) {
            if (errors.password) {
                errors.password.push('Password confirmation does not match');
            } else {
                errors.password = ['Password confirmation does not match'];
            }
        }
        
        if (Object.keys(errors).length > 0) {
            return {
                success: false,
                status: 422,
                errors
            };
        }
        
        return {
            success: true,
            status: 201,
            message: 'Registration successful!',
            data: {
                id: Math.floor(Math.random() * 1000),
                ...data,
                password: undefined,
                password_confirmation: undefined,
                created_at: new Date().toISOString()
            }
        };
    },
    
    // Login mock
    login: async (data: LoginFormData) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const errors: any = {};
        
        if (!data.email) {
            errors.email = ['Email is required'];
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = ['Email must be a valid email'];
        }
        
        if (!data.password) {
            errors.password = ['Password is required'];
        }
        
        if (!data.role) {
            errors.role = ['Role is required'];
        } else if (!['candidate', 'company'].includes(data.role)) {
            errors.role = ['Role must be either candidate or company'];
        }
        
        if (Object.keys(errors).length > 0) {
            return {
                success: false,
                status: 422,
                errors
            };
        }
        
        // Mock successful login
        return {
            success: true,
            status: 200,
            message: 'Login successful!',
            data: {
                user: {
                    id: 1,
                    email: data.email,
                    name: data.email.split('@')[0],
                    role: data.role,
                    isVerified: true,
                    created_at: new Date().toISOString()
                },
                accessToken: 'mock-jwt-token-' + Math.random().toString(36).substr(2),
                isVerified: true
            }
        };
    },
    
    // Mock countries data
    getCountries: async (): Promise<Country[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return [
            { id: 1, name: 'United States', code: 'US' },
            { id: 2, name: 'United Kingdom', code: 'GB' },
            { id: 3, name: 'Canada', code: 'CA' },
            { id: 4, name: 'Australia', code: 'AU' },
            { id: 5, name: 'India', code: 'IN' },
            { id: 6, name: 'Germany', code: 'DE' },
            { id: 7, name: 'France', code: 'FR' },
            { id: 8, name: 'Japan', code: 'JP' },
            { id: 9, name: 'Singapore', code: 'SG' },
            { id: 10, name: 'United Arab Emirates', code: 'AE' }
        ];
    }
};

export default function LoginModel({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [useMockApi, setUseMockApi] = useState(true);
    const [countries, setCountries] = useState<Country[]>([]);
    const [loadingCountries, setLoadingCountries] = useState(false);
    const router = useRouter(); // Changed to useRouter for Next.js
    
    // Registration form state
    const [formData, setFormData] = useState<CandidateFormData>({
        name_with_initials: "",
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        country_id: "",
        whatsapp_number: "",
        referral_code: "",
        password: "",
        password_confirmation: ""
    });

    // Login form state
    const [loginData, setLoginData] = useState<LoginFormData>({
        email: "",
        password: "",
        role: "candidate" // Default role
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CandidateFormData, string>>>({});
    const [loginErrors, setLoginErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

    // Load countries when modal opens for registration
    useEffect(() => {
        if (isOpen && !isLogin && countries.length === 0) {
            loadCountries();
        }
    }, [isOpen, isLogin]);

    const loadCountries = async () => {
        setLoadingCountries(true);
        try {
            if (useMockApi) {
                const mockCountries = await mockApi.getCountries();
                setCountries(mockCountries);
            } else {
                try {
                    const response = await fetch('/api/countries', {
                        method: 'GET',
                        headers: { 'Accept': 'application/json' },
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (Array.isArray(data)) {
                            setCountries(data);
                        } else if (data.data && Array.isArray(data.data)) {
                            setCountries(data.data);
                        }
                    } else {
                        const mockCountries = await mockApi.getCountries();
                        setCountries(mockCountries);
                    }
                } catch (error) {
                    console.log('Failed to fetch countries:', error);
                    const mockCountries = await mockApi.getCountries();
                    setCountries(mockCountries);
                }
            }
        } catch (error) {
            console.error('Error loading countries:', error);
        } finally {
            setLoadingCountries(false);
        }
    };

    // Registration validation
    const validateField = (name: keyof CandidateFormData, value: string): string => {
        switch (name) {
            case 'name_with_initials':
            case 'first_name':
            case 'last_name':
                if (!value.trim()) return "This field is required";
                if (value.length > 35) return "Maximum 35 characters allowed";
                return "";
            
            case 'email':
                if (!value) return "Email is required";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email must be a valid email";
                return "";
            
            case 'phone':
            case 'whatsapp_number':
                if (!value) return "This field is required";
                const digits = value.replace(/\D/g, '');
                if (digits.length < 10 || digits.length > 15) {
                    return "Must contain 10 to 15 digits";
                }
                return "";
            
            case 'country_id':
                if (!value) return "Country is required";
                if (isNaN(parseInt(value))) return "Invalid country selected";
                return "";
            
            case 'password':
                if (!value) return "Password is required";
                if (value.length < 8) return "Password must be at least 8 characters";
                if (!/(?=.*[a-z])/.test(value)) return "Must contain at least one lowercase letter";
                if (!/(?=.*[A-Z])/.test(value)) return "Must contain at least one uppercase letter";
                if (!/(?=.*\d)/.test(value)) return "Must contain at least one number";
                if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value)) return "Must contain at least one special character";
                if (formData.password_confirmation && value !== formData.password_confirmation) {
                    return "Password confirmation does not match";
                }
                return "";
            
            case 'password_confirmation':
                if (!value) return "Please confirm your password";
                if (value !== formData.password) return "Password confirmation does not match";
                return "";
            
            default:
                return "";
        }
    };

    // Login validation
    const validateLoginField = (name: keyof LoginFormData, value: string): string => {
        switch (name) {
            case 'email':
                if (!value) return "Email is required";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email must be a valid email";
                return "";
            
            case 'password':
                if (!value) return "Password is required";
                return "";
            
            case 'role':
                if (!value) return "Please select a role";
                if (!['candidate', 'company'].includes(value)) return "Role must be candidate or company";
                return "";
            
            default:
                return "";
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (isLogin) {
            setLoginData(prev => ({ ...prev, [name]: value }));
            
            if (loginErrors[name as keyof LoginFormData]) {
                setLoginErrors(prev => ({ ...prev, [name]: "" }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
            
            if (errors[name as keyof CandidateFormData]) {
                setErrors(prev => ({ ...prev, [name]: "" }));
            }

            if (name === 'password' || name === 'password_confirmation') {
                const otherField = name === 'password' ? 'password_confirmation' : 'password';
                if (formData[otherField] && value !== formData[otherField]) {
                    setErrors(prev => ({
                        ...prev,
                        [name]: "Password confirmation does not match",
                        [otherField]: "Password confirmation does not match"
                    }));
                } else if (errors[name as keyof CandidateFormData]?.includes("does not match")) {
                    setErrors(prev => ({
                        ...prev,
                        [name]: "",
                        [otherField]: ""
                    }));
                }
            }
            
            if (name === 'phone' || name === 'whatsapp_number') {
                const digits = value.replace(/\D/g, '');
                if (digits.length <= 15) {
                    let formatted = digits;
                    if (digits.length > 0 && !value.startsWith('+')) {
                        formatted = '+' + digits;
                        setTimeout(() => {
                            setFormData(prev => ({
                                ...prev,
                                [name]: formatted
                            }));
                        }, 0);
                    }
                }
            }
            
            if (name === 'phone' && !formData.whatsapp_number && value) {
                setTimeout(() => {
                    setFormData(prev => ({
                        ...prev,
                        whatsapp_number: value
                    }));
                }, 0);
            }
        }
    };

    const validateRegistrationForm = (): boolean => {
        const newErrors: Partial<Record<keyof CandidateFormData, string>> = {};
        let isValid = true;

        (Object.keys(formData) as Array<keyof CandidateFormData>).forEach(key => {
            if (key === 'referral_code') return;
            
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const validateLoginForm = (): boolean => {
        const newErrors: Partial<Record<keyof LoginFormData, string>> = {};
        let isValid = true;

        (Object.keys(loginData) as Array<keyof LoginFormData>).forEach(key => {
            const error = validateLoginField(key, loginData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setLoginErrors(newErrors);
        return isValid;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateLoginForm()) {
            alert('Please correct the errors before submitting.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                email: loginData.email,
                password: loginData.password,
                role: loginData.role
            };

            console.log('📤 Login payload:', payload);

            if (useMockApi) {
                const result = await mockApi.login(payload);
                
                if (!result.success) {
                    if (result.errors) {
                        const backendErrors: any = {};
                        Object.keys(result.errors).forEach(key => {
                            backendErrors[key] = Array.isArray(result.errors[key]) 
                                ? result.errors[key].join(', ') 
                                : result.errors[key];
                        });
                        setLoginErrors(backendErrors);
                        throw new Error('Login failed. Please check your credentials.');
                    }
                    throw new Error('Login failed');
                }

                console.log('✅ Mock login successful:', result.data);
                
                // Store token and user data
                localStorage.setItem('accessToken', result.data.accessToken);
                localStorage.setItem('user', JSON.stringify(result.data.user));
                
                // Call parent callback
                onLoginSuccess(result.data.user, result.data.accessToken);
                
                alert(`✅ ${result.message}`);
                resetForms();
                onClose();
                
                // Redirect to dashboard in Next.js
                router.push('/dashboard');
                
            } else {
                try {
                    const response = await fetch('/api/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });

                    const responseText = await response.text();
                    console.log('📥 Login response:', {
                        status: response.status,
                        body: responseText.substring(0, 500)
                    });

                    let data;
                    try {
                        data = JSON.parse(responseText);
                    } catch (jsonError) {
                        console.error('JSON parse error:', jsonError);
                        throw new Error('Invalid response from server');
                    }

                    if (!response.ok) {
                        if (response.status === 422 && data.errors) {
                            const backendErrors: any = {};
                            Object.keys(data.errors).forEach(key => {
                                backendErrors[key] = Array.isArray(data.errors[key]) 
                                    ? data.errors[key].join(', ') 
                                    : data.errors[key];
                            });
                            setLoginErrors(backendErrors);
                            throw new Error('Login failed. Please check your credentials.');
                        }
                        throw new Error(data.message || `Login failed (${response.status})`);
                    }

                    console.log('✅ Real login successful:', data);
                    
                    // Store token and user data
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    // Call parent callback
                    onLoginSuccess(data.user, data.accessToken);
                    
                    alert(`✅ ${data.message || 'Login successful!'}`);
                    resetForms();
                    onClose();
                    
                    // Redirect to dashboard in Next.js
                    router.push('/dashboard');
                    
                } catch (fetchError: any) {
                    console.error('Login fetch error:', fetchError);
                    
                    if (confirm(`${fetchError.message}\n\nSwitch to Mock API for testing?`)) {
                        setUseMockApi(true);
                        const mockResult = await mockApi.login(payload);
                        if (mockResult.success) {
                            localStorage.setItem('accessToken', mockResult.data.accessToken);
                            localStorage.setItem('user', JSON.stringify(mockResult.data.user));
                            onLoginSuccess(mockResult.data.user, mockResult.data.accessToken);
                            alert(`✅ ${mockResult.message} (Mock API)`);
                            resetForms();
                            onClose();
                            router.push('/dashboard');
                        }
                    } else {
                        throw fetchError;
                    }
                }
            }
            
        } catch (error: any) {
            console.error("Login error:", error);
            if (!error.message?.includes('Mock API')) {
                alert(error.message || "Login failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isLogin) {
            await handleLogin(e);
            return;
        }

        // Registration logic
        if (!validateRegistrationForm()) {
            alert('Please correct the errors before submitting.');
            return;
        }

        setLoading(true);

        try {
            const payload = {
                name_with_initials: formData.name_with_initials,
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone.replace(/\D/g, ''),
                country_id: parseInt(formData.country_id),
                whatsapp_number: formData.whatsapp_number.replace(/\D/g, ''),
                referral_code: formData.referral_code || undefined,
                password: formData.password,
                password_confirmation: formData.password_confirmation
            };

            console.log('📤 Registration payload:', payload);

            if (useMockApi) {
                const result = await mockApi.registerCandidate(payload);
                
                if (!result.success) {
                    if (result.errors) {
                        const backendErrors: any = {};
                        Object.keys(result.errors).forEach(key => {
                            backendErrors[key] = Array.isArray(result.errors[key]) 
                                ? result.errors[key].join(', ') 
                                : result.errors[key];
                        });
                        setErrors(backendErrors);
                        throw new Error('Validation failed. Please check the form.');
                    }
                    throw new Error('Registration failed');
                }

                alert(`✅ ${result.message}`);
                resetForms();
                onClose();
                
                // After registration, suggest login
                setTimeout(() => {
                    if (confirm('Registration successful! Would you like to login now?')) {
                        setIsLogin(true);
                        setLoginData(prev => ({
                            ...prev,
                            email: formData.email,
                            password: '',
                            role: 'candidate'
                        }));
                    }
                }, 500);
                
            } else {
                try {
                    const response = await fetch('/api/register/candidate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });

                    const responseText = await response.text();
                    console.log('📥 Registration response:', {
                        status: response.status,
                        body: responseText.substring(0, 500)
                    });

                    let data;
                    try {
                        data = JSON.parse(responseText);
                    } catch (jsonError) {
                        console.error('JSON parse error:', jsonError);
                        if (responseText.includes('<!DOCTYPE')) {
                            throw new Error('Server returned HTML page. Check API endpoint.');
                        }
                        throw new Error('Invalid response from server');
                    }

                    if (!response.ok) {
                        if (response.status === 422 && data.errors) {
                            const backendErrors: any = {};
                            Object.keys(data.errors).forEach(key => {
                                backendErrors[key] = Array.isArray(data.errors[key]) 
                                    ? data.errors[key].join(', ') 
                                    : data.errors[key];
                            });
                            setErrors(backendErrors);
                            throw new Error('Validation failed. Please check the form.');
                        }
                        throw new Error(data.message || `Registration failed (${response.status})`);
                    }

                    alert(`✅ ${data.message || 'Registration successful!'}`);
                    resetForms();
                    onClose();
                    
                    // After registration, suggest login
                    setTimeout(() => {
                        if (confirm('Registration successful! Would you like to login now?')) {
                            setIsLogin(true);
                            setLoginData(prev => ({
                                ...prev,
                                email: formData.email,
                                password: '',
                                role: 'candidate'
                            }));
                        }
                    }, 500);
                    
                } catch (fetchError: any) {
                    console.error('Registration fetch error:', fetchError);
                    
                    if (confirm(`${fetchError.message}\n\nSwitch to Mock API for testing?`)) {
                        setUseMockApi(true);
                        const mockResult = await mockApi.registerCandidate(payload);
                        if (mockResult.success) {
                            alert(`✅ ${mockResult.message} (Mock API)`);
                            resetForms();
                            onClose();
                        }
                    } else {
                        throw fetchError;
                    }
                }
            }
            
        } catch (error: any) {
            console.error("Registration error:", error);
            if (!error.message?.includes('Mock API')) {
                alert(error.message || "Registration failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    const resetForms = () => {
        setFormData({
            name_with_initials: "",
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            country_id: "",
            whatsapp_number: "",
            referral_code: "",
            password: "",
            password_confirmation: ""
        });
        setLoginData({
            email: "",
            password: "",
            role: "candidate"
        });
        setErrors({});
        setLoginErrors({});
    };

    const handleClose = () => {
        resetForms();
        onClose();
    }

    if (!isOpen) return null;

    return (
        <>
            <div 
                className='fixed inset-0 bg-black/60 z-50'
                onClick={handleClose}
            />

            <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                <div
                    className='bg-white rounded-2xl w-full max-w-lg relative overflow-hidden shadow-2xl'
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose} 
                        className='absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition'
                    >
                        <X size={20} className='text-gray-500 fixed' />
                    </button>

                    <div className='p-6 border-b'>
                        <div className='flex items-center gap-3 mb-2'>
                            <div className='p-2 bg-blue-100 rounded-lg'>
                                <LogIn className='text-blue-600' size={24} />
                            </div>
                            <div>
                                <h2 className='text-gray-600'>
                                    {isLogin ? "Welcome Back" : "Create Account"}
                                </h2>
                                <p className='text-2xl font-bold text-gray-800'>
                                    {isLogin ? "Sign in to your account" : "Join our community"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='flex border-b'>
                        <button
                            onClick={() => {
                                setIsLogin(true);
                                resetForms();
                            }}
                            className={`flex-1 py-3 text-center font-medium ${
                                isLogin
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => {
                                setIsLogin(false);
                                resetForms();
                            }}
                            className={`flex-1 py-3 text-center font-medium ${
                                !isLogin
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {!isLogin && (
                        <div className="px-6 pt-4">
                            <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                                <span className="text-sm text-gray-600">API Mode:</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setUseMockApi(false)}
                                        className={`px-3 py-1 text-sm rounded ${
                                            !useMockApi 
                                            ? 'bg-blue-600 text-white' 
                                            : 'bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        Real API
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setUseMockApi(true)}
                                        className={`px-3 py-1 text-sm rounded ${
                                            useMockApi 
                                            ? 'bg-green-600 text-white' 
                                            : 'bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        Mock API
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {useMockApi 
                                    ? "✅ Using mock API - Backend validation simulated" 
                                    : "⚠️ Using real API - Ensure backend is running"}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='p-6 space-y-4 max-h-[70vh] overflow-y-auto'>
                        {isLogin ? (
                            <>
                                {/* Login Form */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Email *
                                    </label>
                                    <div className='relative'>
                                        <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input 
                                            type='email'
                                            name='email'
                                            value={loginData.email}
                                            onChange={handleChange}
                                            placeholder='Enter your email'
                                            required
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                loginErrors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {loginErrors.email && (
                                        <p className='mt-1 text-sm text-red-500'>{loginErrors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Password *
                                    </label>
                                    <div className='relative'>
                                        <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name='password'
                                            value={loginData.password}
                                            onChange={handleChange}
                                            placeholder='Enter your password'
                                            required
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                loginErrors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {loginErrors.password && (
                                        <p className='mt-1 text-sm text-red-500'>{loginErrors.password}</p>
                                    )}
                                    <button type='button' className='text-sm text-blue-600 hover:text-blue-800 mt-1'>
                                        Forgot Password?
                                    </button>
                                </div>

                                {/* Role Selection */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        I am a *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setLoginData(prev => ({ ...prev, role: 'candidate' }))}
                                            className={`py-3 px-4 border rounded-lg text-center font-medium transition ${
                                                loginData.role === 'candidate'
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            Candidate
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setLoginData(prev => ({ ...prev, role: 'company' }))}
                                            className={`py-3 px-4 border rounded-lg text-center font-medium transition ${
                                                loginData.role === 'company'
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            Company
                                        </button>
                                    </div>
                                    <input
                                        type="hidden"
                                        name="role"
                                        value={loginData.role}
                                        onChange={handleChange}
                                    />
                                    {loginErrors.role && (
                                        <p className='mt-1 text-sm text-red-500'>{loginErrors.role}</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Registration Form */}
                                {/* Name with Initials */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Name with Initials *
                                    </label>
                                    <div className='relative'>
                                        <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input 
                                            type='text'
                                            name='name_with_initials'
                                            value={formData.name_with_initials}
                                            onChange={handleChange}
                                            placeholder='J. Doe or John D.'
                                            required
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.name_with_initials ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.name_with_initials && (
                                        <p className='mt-1 text-sm text-red-500'>{errors.name_with_initials}</p>
                                    )}
                                    <p className='mt-1 text-sm text-gray-500'>
                                        Format: First initial + last name (e.g., J. Doe) or full first name + last initial (e.g., John D.)
                                    </p>
                                </div>

                                {/* First and Last Name */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            First Name *
                                        </label>
                                        <div className='relative'>
                                            <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                            <input 
                                                type='text'
                                                name='first_name'
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                placeholder='John'
                                                required
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    errors.first_name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                        </div>
                                        {errors.first_name && (
                                            <p className='mt-1 text-sm text-red-500'>{errors.first_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                                            Last Name *
                                        </label>
                                        <div className='relative'>
                                            <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                            <input 
                                                type='text'
                                                name='last_name'
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                placeholder='Doe'
                                                required
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    errors.last_name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                        </div>
                                        {errors.last_name && (
                                            <p className='mt-1 text-sm text-red-500'>{errors.last_name}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Email field */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Email *
                                    </label>
                                    <div className='relative'>
                                        <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input 
                                            type='email'
                                            name='email'
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder='john@example.com'
                                            required
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className='mt-1 text-sm text-red-500'>{errors.email}</p>
                                    )}
                                </div>

                                {/* Phone field */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Phone Number *
                                        <span className="text-gray-500 text-xs ml-1">(10-15 digits)</span>
                                    </label>
                                    <div className='relative'>
                                        <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input 
                                            type='tel'
                                            name='phone'
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder='+1234567890'
                                            required
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className='mt-1 text-sm text-red-500'>{errors.phone}</p>
                                    )}
                                    <div className="flex items-center mt-1">
                                        <div className={`h-2 flex-1 rounded-full mr-2 ${
                                            formData.phone.replace(/\D/g, '').length >= 10 && 
                                            formData.phone.replace(/\D/g, '').length <= 15 ? 'bg-green-500' : 'bg-gray-300'
                                        }`}></div>
                                        <span className="text-xs text-gray-500">
                                            {formData.phone.replace(/\D/g, '').length}/10-15 digits
                                        </span>
                                    </div>
                                </div>

                                {/* Country selection */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Country *
                                    </label>
                                    <div className='relative'>
                                        <Globe className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10' size={18} />
                                        {loadingCountries ? (
                                            <div className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                                                <div className="flex items-center">
                                                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                                                    <span className="text-gray-500">Loading countries...</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <select
                                                name='country_id'
                                                value={formData.country_id}
                                                onChange={handleChange}
                                                required
                                                disabled={countries.length === 0}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                                                    errors.country_id ? 'border-red-500' : 'border-gray-300'
                                                } ${countries.length === 0 ? 'bg-gray-50' : ''}`}
                                            >
                                                <option value="">Select Country</option>
                                                {countries.map(country => (
                                                    <option key={country.id} value={country.id}>
                                                        {country.name} ({country.code})
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </div>
                                    {errors.country_id && (
                                        <p className='mt-1 text-sm text-red-500'>{errors.country_id}</p>
                                    )}
                                    {countries.length === 0 && !loadingCountries && (
                                        <p className='mt-1 text-sm text-yellow-600'>
                                            No countries loaded. Please check the countries API endpoint.
                                        </p>
                                    )}
                                </div>

                                {/* WhatsApp Number */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        WhatsApp Number *
                                        <span className="text-gray-500 text-xs ml-1">(10-15 digits)</span>
                                    </label>
                                    <div className='relative'>
                                        <MessageSquare className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input 
                                            type='tel'
                                            name='whatsapp_number'
                                            value={formData.whatsapp_number}
                                            onChange={handleChange}
                                            placeholder='+1234567890'
                                            required
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.whatsapp_number ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.whatsapp_number && (
                                        <p className='mt-1 text-sm text-red-500'>{errors.whatsapp_number}</p>
                                    )}
                                    <div className="flex items-center mt-1">
                                        <div className={`h-2 flex-1 rounded-full mr-2 ${
                                            formData.whatsapp_number.replace(/\D/g, '').length >= 10 && 
                                            formData.whatsapp_number.replace(/\D/g, '').length <= 15 ? 'bg-green-500' : 'bg-gray-300'
                                        }`}></div>
                                        <span className="text-xs text-gray-500">
                                            {formData.whatsapp_number.replace(/\D/g, '').length}/10-15 digits
                                        </span>
                                    </div>
                                    <p className='mt-1 text-sm text-gray-500'>
                                        We`ll use this for WhatsApp notifications
                                    </p>
                                </div>

                                {/* Referral Code */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Referral Code (Optional)
                                    </label>
                                    <div className='relative'>
                                        <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input 
                                            type='text'
                                            name='referral_code'
                                            value={formData.referral_code}
                                            onChange={handleChange}
                                            placeholder='Enter referral code if any'
                                            className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Password *
                                    </label>
                                    <div className='relative'>
                                        <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name='password'
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder='Enter your password'
                                            required
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className='mt-1 text-sm text-red-500'>{errors.password}</p>
                                    )}
                                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                        <div className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className="mr-1">{formData.password.length >= 8 ? '✓' : '○'}</span>
                                            <span>8+ characters</span>
                                        </div>
                                        <div className={`flex items-center ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className="mr-1">{/(?=.*[a-z])/.test(formData.password) ? '✓' : '○'}</span>
                                            <span>Lowercase letter</span>
                                        </div>
                                        <div className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className="mr-1">{/(?=.*[A-Z])/.test(formData.password) ? '✓' : '○'}</span>
                                            <span>Uppercase letter</span>
                                        </div>
                                        <div className={`flex items-center ${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className="mr-1">{/(?=.*\d)/.test(formData.password) ? '✓' : '○'}</span>
                                            <span>Number</span>
                                        </div>
                                        <div className={`flex items-center ${/(?=.*[!@#$%^&*])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                            <span className="mr-1">{/(?=.*[!@#$%^&*])/.test(formData.password) ? '✓' : '○'}</span>
                                            <span>Special character</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Confirm Password *
                                    </label>
                                    <div className='relative'>
                                        <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name='password_confirmation'
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                            placeholder='Confirm your password'
                                            required
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <p className='mt-1 text-sm text-red-500'>{errors.password_confirmation}</p>
                                    )}
                                    {formData.password && formData.password_confirmation && 
                                     formData.password === formData.password_confirmation && (
                                        <p className='mt-1 text-sm text-green-600'>✓ Passwords match</p>
                                    )}
                                </div>

                                {/* Terms */}
                                <div className='flex items-start gap-2 pt-2'>
                                    <input  
                                        type='checkbox'
                                        id='terms'
                                        required
                                        className='mt-1'
                                    />
                                    <label htmlFor='terms' className='text-sm text-gray-600'>
                                        I agree to the {""} 
                                        <button type='button' className='text-blue-600 hover:underline'>
                                            Terms of service
                                        </button>{" "}
                                        and {" "}
                                        <button type='button' className='text-blue-600 hover:underline'>
                                            Privacy Policy
                                        </button>
                                    </label>
                                </div>
                            </>
                        )}

                        <button 
                            type='submit'
                            disabled={loading || (!isLogin && countries.length === 0 && !loadingCountries)}
                            className='w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition flex items-center justify-center gap-2'
                        >
                            {loading ? (
                                <>
                                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                    {isLogin ? "Signing In..." : "Creating Account..."}
                                </>
                            ) : (
                                <>
                                    <LogIn size={18} />
                                    {isLogin ? "Sign In" : "Create Account"}
                                </>
                            )}
                        </button>

                        <div className='relative'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-gray-300'></div>
                            </div>
                            <div className='relative flex justify-center text-sm'>
                                <span className='px-2 bg-white text-gray-500'>Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                className="col-span-3 flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <FcGoogle size={20} />
                                Continue with Google
                            </button>
                        </div>
                    </form>

                    <div className='px-6 py-4 bg-gray-50 border-t'>
                        <p className='text-center text-gray-600'>
                            {isLogin ? "Don't have an account?" : "Already have an account? "}
                            <button
                                type='button'
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    resetForms();
                                }}
                                className='text-blue-600 font-medium hover:underline'
                            >
                                {isLogin ? "Sign Up" : "Sign in"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}