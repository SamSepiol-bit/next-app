import { LogIn, Mail, User, X, Lock, EyeOff, Eye, Phone, Globe, MessageSquare, Key } from 'lucide-react';
import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { useRouter } from 'next/navigation';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (userData: any, token: string) => void;
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

export default function LoginModel({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const router = useRouter();
    
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
        role: "candidate"
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CandidateFormData, string>>>({});
    const [loginErrors, setLoginErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});

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
            
            // Auto-format phone numbers
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
        }
    };

    const handleRoleChange = (role: string) => {
        setLoginData(prev => ({ ...prev, role }));
        if (loginErrors.role) {
            setLoginErrors(prev => ({ ...prev, role: "" }));
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
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
                country_id: formData.country_id,
                whatsapp_number: formData.whatsapp_number.replace(/\D/g, ''),
                referral_code: formData.referral_code || null,
                password: formData.password,
                password_confirmation: formData.password_confirmation
            };

            console.log('📤 Sending registration to:', 'https://jobsformycv.enricharcane.info/api/register/candidate');
            console.log('📦 Payload:', { ...payload, password: '***' });

            const response = await fetch('https://jobsformycv.enricharcane.info/api/register/candidate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responseText = await response.text();
            console.log('📥 Response status:', response.status);
            console.log('📥 Response body:', responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (jsonError) {
                console.error('❌ JSON parse error:', jsonError);
                alert('Server returned invalid response. Please check console for details.');
                return;
            }

            if (!response.ok) {
                if (response.status === 422 && data.errors) {
                    // Handle validation errors
                    const backendErrors: any = {};
                    Object.keys(data.errors).forEach(key => {
                        backendErrors[key] = Array.isArray(data.errors[key]) 
                            ? data.errors[key].join(', ') 
                            : data.errors[key];
                    });
                    setErrors(backendErrors);
                    alert('Please fix the validation errors shown in the form.');
                    return;
                }
                alert(data.message || `Registration failed (${response.status})`);
                return;
            }

            // SUCCESS
            console.log('✅ Registration successful!', data);
            
            alert(`✅ Registration successful!\n\nWelcome ${data.candidate?.full_name || formData.first_name}!\nYour account has been created successfully.`);
            
            resetForms();
            onClose();
            
            // Auto-fill email for login
            setLoginData(prev => ({
                ...prev,
                email: formData.email,
                password: '',
                role: 'candidate'
            }));
            
            // Switch to login tab
            setIsLogin(true);
            
        } catch (error: any) {
            console.error("❌ Registration error:", error);
            alert(`Registration error: ${error.message || "Please check your internet connection and try again."}`);
        } finally {
            setLoading(false);
        }
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

            const response = await fetch('https://jobsformycv.enricharcane.info/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const responseText = await response.text();
            console.log('📥 Login response:', response.status, responseText);

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (jsonError) {
                console.error('JSON parse error:', jsonError);
                alert('Invalid server response');
                return;
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
                    alert('Please fix the validation errors shown in the form.');
                    return;
                }
                alert(data.message || 'Login failed');
                return;
            }

            // Login successful
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            onLoginSuccess(data.user, data.accessToken);
            alert('Login successful!');
            resetForms();
            onClose();
            router.push('/dashboard');
            
        } catch (error: any) {
            console.error("Login error:", error);
            alert(error.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        if (isLogin) {
            await handleLogin(e);
        } else {
            await handleRegister(e);
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

    const handleForgotPassword = () => {
        alert('Forgot password feature coming soon!');
    }

    const handleGoogleLogin = () => {
        alert('Google login feature coming soon!');
    }

    if (!isOpen) return null;

    return (
        <>
            <div className='fixed inset-0 bg-black/60 z-50' onClick={handleClose} />
            <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
                <div className='bg-white rounded-2xl w-full max-w-lg relative overflow-hidden shadow-2xl'
                     onClick={(e) => e.stopPropagation()}>
                    
                    <button onClick={onClose} className='absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition'>
                        <X size={20} className='text-gray-500' />
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
                        <button onClick={() => { setIsLogin(true); resetForms(); }}
                                className={`flex-1 py-3 text-center font-medium ${isLogin ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                            Sign In
                        </button>
                        <button onClick={() => { setIsLogin(false); resetForms(); }}
                                className={`flex-1 py-3 text-center font-medium ${!isLogin ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"}`}>
                            Sign Up
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className='p-6 space-y-4 max-h-[70vh] overflow-y-auto'>
                        {isLogin ? (
                            /* Login Form - Completed UI */
                            <>
                                {/* Email Field */}
                                <div>
                                    <div className='relative'>
                                        <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input 
                                            type='email'
                                            name='email'
                                            value={loginData.email}
                                            onChange={handleChange}
                                            placeholder='Enter your email address'
                                            required
                                            disabled={loading}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
                                                loginErrors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {loginErrors.email && (
                                        <p className='mt-1 text-sm text-red-500'>{loginErrors.email}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <div className='relative'>
                                        <Key className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input
                                            type={showLoginPassword ? "text" : "password"}
                                            name='password'
                                            value={loginData.password}
                                            onChange={handleChange}
                                            placeholder='Enter your password'
                                            required
                                            disabled={loading}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 ${
                                                loginErrors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowLoginPassword(!showLoginPassword)}
                                            disabled={loading}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                                        >
                                            {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {loginErrors.password && (
                                        <p className='mt-1 text-sm text-red-500'>{loginErrors.password}</p>
                                    )}
                                    <button 
                                        type='button' 
                                        onClick={handleForgotPassword}
                                        disabled={loading}
                                        className='text-sm text-blue-600 hover:text-blue-800 mt-1 disabled:opacity-50'
                                    >
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
                                            onClick={() => handleRoleChange('candidate')}
                                            disabled={loading}
                                            className={`py-3 px-4 border rounded-lg text-center font-medium transition disabled:opacity-50 ${
                                                loginData.role === 'candidate'
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            Candidate
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRoleChange('company')}
                                            disabled={loading}
                                            className={`py-3 px-4 border rounded-lg text-center font-medium transition disabled:opacity-50 ${
                                                loginData.role === 'company'
                                                ? 'border-blue-600 bg-blue-50 text-blue-600'
                                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            Company
                                        </button>
                                    </div>
                                    {loginErrors.role && (
                                        <p className='mt-1 text-sm text-red-500'>{loginErrors.role}</p>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Registration Form */
                            <>
                                {/* Name with Initials */}
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1 text-left'>Name with Initials *</label>
                                    <div className='relative'>
                                        <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input 
                                            type='text'
                                            name='name_with_initials'
                                            value={formData.name_with_initials}
                                            onChange={handleChange}
                                            placeholder='ex:- J. Doe or John D.'
                                            required
                                            disabled={loading}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.name_with_initials ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.name_with_initials && 
                                        <p className='mt-1 text-sm text-red-500'>{errors.name_with_initials}</p>}
                                </div>

                                {/* First and Last Name */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        
                                        <div className='relative'>
                                            <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                            <input 
                                                type='text'
                                                name='first_name'
                                                value={formData.first_name}
                                                onChange={handleChange}
                                                placeholder='first Name'
                                                required
                                                disabled={loading}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    errors.first_name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                        </div>
                                        {errors.first_name && <p className='mt-1 text-sm text-red-500'>{errors.first_name}</p>}
                                    </div>
                                    <div>
                                        
                                        <div className='relative'>
                                            <User className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                            <input 
                                                type='text'
                                                name='last_name'
                                                value={formData.last_name}
                                                onChange={handleChange}
                                                placeholder='last Name'
                                                required
                                                disabled={loading}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    errors.last_name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                        </div>
                                        {errors.last_name && <p className='mt-1 text-sm text-red-500'>{errors.last_name}</p>}
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                   
                                    <div className='relative'>
                                        <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input 
                                            type='email'
                                            name='email'
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder='ex:- email@address.com'
                                            required
                                            disabled={loading}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.email ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.email && <p className='mt-1 text-sm text-red-500'>{errors.email}</p>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <div className='relative'>
                                        <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input 
                                            type='tel'
                                            name='phone'
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder='Contact Number'
                                            required
                                            disabled={loading}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.phone ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.phone && <p className='mt-1 text-sm text-red-500'>{errors.phone}</p>}
                                </div>

                                {/* Country */}
                                <div>
                                    <div className='relative'>
                                        <Globe className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10' size={18} />
                                        <select
                                            name='country_id'
                                            value={formData.country_id}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none ${
                                                errors.country_id ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        >
                                            <option value="">Select Country</option>
                                            <option value="1">Sri Lanka</option>
                                            <option value="2">United States</option>
                                            <option value="3">United Kingdom</option>
                                            <option value="4">Australia</option>
                                            <option value="5">India</option>
                                            <option value="6">United Arab Emirates</option>
                                            <option value="7">Singapore</option>
                                            <option value="8">Malaysia</option>
                                        </select>
                                    </div>
                                    {errors.country_id && <p className='mt-1 text-sm text-red-500'>{errors.country_id}</p>}
                                </div>

                                {/* WhatsApp */}
                                <div>
                                    <div className='relative'>
                                        <MessageSquare className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input 
                                            type='tel'
                                            name='whatsapp_number'
                                            value={formData.whatsapp_number}
                                            onChange={handleChange}
                                            placeholder='whatsapp Number'
                                            required
                                            disabled={loading}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.whatsapp_number ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                    {errors.whatsapp_number && <p className='mt-1 text-sm text-red-500'>{errors.whatsapp_number}</p>}
                                </div>

                                {/* Password */}
                                <div>
                                    <div className='relative'>
                                        <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name='password'
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder='Enter your password'
                                            required
                                            disabled={loading}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.password ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={loading} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className='mt-1 text-sm text-red-500'>{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <div className='relative'>
                                        <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name='password_confirmation'
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                            placeholder='Confirm your password'
                                            required
                                            disabled={loading}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={loading} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50">
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && <p className='mt-1 text-sm text-red-500'>{errors.password_confirmation}</p>}
                                </div>

                                {/* Terms */}
                                <div className='flex items-start gap-2 pt-2'>
                                    <input type='checkbox' id='terms' required className='mt-1' disabled={loading} />
                                    <label htmlFor='terms' className='text-sm text-gray-600'>
                                        I agree to the Terms of service and Privacy Policy
                                    </label>
                                </div>
                            </>
                        )}

                        <button type='submit' disabled={loading}
                                className='w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition flex items-center justify-center gap-2'>
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
                            <div className='absolute inset-0 flex items-center'><div className='w-full border-t border-gray-300'></div></div>
                            <div className='relative flex justify-center text-sm'><span className='px-2 bg-white text-gray-500'>Or continue with</span></div>
                        </div>

                        <button 
                            type="button" 
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
                        >
                            <FcGoogle size={20} /> Continue with Google
                        </button>
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
                                disabled={loading}
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