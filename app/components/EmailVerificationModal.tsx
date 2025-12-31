'use client';

import React, { useState, useEffect } from 'react';
import { Mail, RefreshCw, CheckCircle, X, AlertCircle } from 'lucide-react';
import { verifyOTP } from '../lib/auth';
import { resendVerificationOTP } from '../lib/auth';

interface EmailVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    email: string;
    onVerificationSuccess: () => void;
}

export default function EmailVerificationModal({ 
    isOpen, 
    onClose, 
    email, 
    onVerificationSuccess 
}: EmailVerificationModalProps) {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [resendTimer, setResendTimer] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const maxAttempts = 5;

    // Input refs for OTP
    const inputRefs = Array(6).fill(0).map(() => React.createRef<HTMLInputElement>());

    // Handle OTP input change
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return; // Only allow numbers
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');
        setSuccess('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs[index + 1].current?.focus();
        }
        
        // Auto-submit when all digits are entered
        if (newOtp.every(digit => digit !== '') && index === 5) {
            handleSubmit();
        }
    };

    // Handle backspace
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs[index - 1].current?.focus();
        }
    };

    // Handle paste
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim();
        
        if (/^\d{6}$/.test(pastedData)) {
            const digits = pastedData.split('');
            const newOtp = [...otp];
            
            digits.forEach((digit, index) => {
                if (index < 6) {
                    newOtp[index] = digit;
                }
            });
            
            setOtp(newOtp);
            
            // Focus the last input
            setTimeout(() => {
                inputRefs[5].current?.focus();
            }, 0);
        }
    };

    // Submit OTP
    const handleSubmit = async () => {
        const otpString = otp.join('');
        
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        if (attempts >= maxAttempts) {
            setError('Too many attempts. Please request a new OTP.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await verifyOTP(otpString);
            
            if (response.success) {
                setSuccess(response.message || 'Email verified successfully!');
                
                // Store the new token if provided
                if (response.data?.accessToken) {
                    localStorage.setItem('accessToken', response.data.accessToken);
                }
                
                // Show success for 2 seconds then close
                setTimeout(() => {
                    onVerificationSuccess();
                    onClose();
                }, 2000);
            } else {
                setError(response.message || 'Invalid verification code');
                setAttempts(prev => prev + 1);
            }
        } catch (error: any) {
            console.error('Verification error:', error);
            setError(error.message || 'Verification failed. Please try again.');
            setAttempts(prev => prev + 1);
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOTP = async () => {
        if (resendTimer > 0) return;

        setResendLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await resendVerificationOTP(email);
            
            if (response.success) {
                setSuccess(response.message || 'New OTP sent to your email');
                
                // Start 60-second timer
                setResendTimer(60);
                
                // Reset attempts
                setAttempts(0);
                
                // Clear OTP fields
                setOtp(['', '', '', '', '', '']);
                inputRefs[0].current?.focus();
            } else {
                setError(response.message || 'Failed to resend OTP');
            }
        } catch (error: any) {
            console.error('Resend error:', error);
            setError(error.message || 'Failed to resend OTP');
        } finally {
            setResendLoading(false);
        }
    };

    // Countdown timer for resend
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => {
                setResendTimer(prev => prev - 1);
            }, 1000);
            
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    // Auto-resend timer when modal opens
    useEffect(() => {
        if (isOpen && !resendTimer) {
            setResendTimer(60);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-[60]" onClick={onClose} />
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                <div 
                    className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md relative overflow-hidden shadow-2xl dark:shadow-gray-800/20"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                                    <Mail className="text-primary-600 dark:text-primary-400" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                        Verify Your Email
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                        Enter the 6-digit code sent to your email
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                            >
                                <X size={20} className="text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <Mail className="text-blue-600 dark:text-blue-400 mt-0.5" size={18} />
                                <div>
                                    <p className="text-blue-800 dark:text-blue-300 font-medium">
                                        Verification code sent to:
                                    </p>
                                    <p className="text-blue-600 dark:text-blue-400 font-semibold">
                                        {email}
                                    </p>
                                    <p className="text-sm text-blue-600/80 dark:text-blue-400/80 mt-1">
                                        Please check your inbox and spam folder
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OTP Input Section */}
                    <div className="p-6">
                        {/* OTP Inputs */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                6-Digit Verification Code *
                            </label>
                            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={inputRefs[index]}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        disabled={loading}
                                        className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            borderColor: error 
                                                ? '#ef4444' 
                                                : success 
                                                ? '#10b981' 
                                                : digit 
                                                ? '#3b82f6' 
                                                : '#d1d5db'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Attempts counter */}
                        {attempts > 0 && (
                            <div className="mb-4">
                                <p className="text-sm text-amber-600 dark:text-amber-400">
                                    Attempts: {attempts}/{maxAttempts}
                                </p>
                                {attempts >= maxAttempts - 2 && (
                                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                        {maxAttempts - attempts} attempts remaining
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                                    <AlertCircle size={16} />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                    <CheckCircle size={16} />
                                    <p className="text-sm font-medium">{success}</p>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={loading || otp.join('').length !== 6}
                            className="w-full py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mb-4"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <CheckCircle size={18} />
                                    Verify Email
                                </>
                            )}
                        </button>

                        {/* Resend OTP Section */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                Didn`t receive the code?
                            </p>
                            <button
                                onClick={handleResendOTP}
                                disabled={resendLoading || resendTimer > 0}
                                className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-800 dark:hover:text-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mx-auto"
                            >
                                {resendLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw size={16} />
                                        {resendTimer > 0 
                                            ? `Resend OTP in ${resendTimer}s` 
                                            : 'Resend OTP'
                                        }
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Verification Instructions */}
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                📝 Important Notes:
                            </h4>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Check your spam/junk folder if you don`t see the email</li>
                                <li>• The code expires after 15 minutes</li>
                                <li>• You have {maxAttempts} attempts to enter the correct code</li>
                                <li>• Contact support if you`re having trouble receiving emails</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}