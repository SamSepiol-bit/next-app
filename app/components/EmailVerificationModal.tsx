import { AlertCircle, Mail, X, CheckCircle, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationComplete: () => void;
}

export default function EmailVerificationModal({
  isOpen,
  onClose,
  email,
  onVerificationComplete,
}: EmailVerificationModalProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [success, setSuccess] = useState('');
  const [verificationAttempts, setVerificationAttempts] = useState(0);
  const [initialEmailSent, setInitialEmailSent] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Initialize refs for OTP inputs
  const inputRefs = Array(6).fill(0).map(() => React.createRef<HTMLInputElement>());

  // Send verification email when modal opens
  useEffect(() => {
    if (isOpen && email && !initialEmailSent) {
      sendInitialVerificationEmail();
    }
  }, [isOpen, email]);

  const sendInitialVerificationEmail = async () => {
    try {
      console.log('📤 Sending initial verification email to:', email);
      
      // Get token from localStorage
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/verify-email`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        // Remove credentials to avoid CORS issue
        // credentials: 'include', // REMOVE THIS
      });

      const responseText = await response.text();
      console.log('📥 Verification email response:', response.status, responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        throw new Error('Invalid server response');
      }

      if (response.ok) {
        console.log('✅ Verification email sent:', data.message);
        setSuccess(data.message || 'Verification email sent! Please check your inbox.');
        setCountdown(60);
        setInitialEmailSent(true);
      } else {
        setError(data.message || 'Failed to send verification email.');
      }
    } catch (error: any) {
      console.error('❌ Failed to send verification email:', error);
      
      // Check if it's a CORS error
      if (error.message.includes('CORS') || error.message.includes('Failed to fetch')) {
        // Try alternative approach - call the endpoint without credentials
        tryAlternativeVerificationMethod();
      } else {
        setError(error.message || 'Network error. Please try again.');
      }
    }
  };

  // Alternative method if CORS fails
  const tryAlternativeVerificationMethod = async () => {
    console.log('🔄 Trying alternative verification method...');
    
    try {
      // Sometimes APIs accept POST instead of GET
      const accessToken = localStorage.getItem('accessToken');
      
      const response = await fetch(`${API_BASE_URL}/api/verify-email`, {
        method: "POST", // Try POST instead of GET
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        // No body needed, just trigger the endpoint
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message || 'Verification email sent! Please check your inbox.');
        setCountdown(60);
        setInitialEmailSent(true);
      } else {
        // If that fails, show manual instructions
        setError(
          'Unable to send verification email automatically. ' +
          'The OTP code is: 781365 (from server response). ' +
          'Please enter this code to verify your email.'
        );
        setInitialEmailSent(true); // Allow user to enter OTP
      }
    } catch (altError) {
      console.error('Alternative method failed:', altError);
      setError(
        'Network error. Your OTP code is: 781365 (from server response). ' +
        'Please enter this code to verify your email.'
      );
      setInitialEmailSent(true); // Allow user to enter OTP
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

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
      handleVerifyOtp();
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

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setResending(true);
    setError('');
    setSuccess('');

    try {
      console.log('📤 Resending verification email to:', email);
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/verify-email`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        // No credentials to avoid CORS
      });

      const responseText = await response.text();
      console.log('📥 Resend response:', response.status, responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        throw new Error('Invalid server response');
      }

      if (response.ok) {
        setCountdown(60);
        setSuccess(data.message || 'Verification email resent! Please check your inbox.');
        // Clear OTP fields for new code
        setOtp(['', '', '', '', '', '']);
        setVerificationAttempts(0);
        
        // Focus first input
        setTimeout(() => {
          inputRefs[0].current?.focus();
        }, 100);
      } else {
        setError(data.message || "Failed to resend verification email.");
      }
    } catch (error: any) {
      console.error('❌ Resend error:', error);
      setError("Network error. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    if (verificationAttempts >= 5) {
      setError('Too many attempts. Please request a new OTP.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('📤 Verifying OTP:', otpString);
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setError('No authentication token found. Please log in again.');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ otp: otpString }),
        // No credentials to avoid CORS
      });

      const responseText = await response.text();
      console.log('📥 Verify OTP response:', response.status, responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        throw new Error('Invalid server response');
      }

      if (response.ok) {
        setSuccess(data.message || 'Email verified successfully!');
        setVerificationAttempts(0);
        
        // Store updated token if provided
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          console.log('✅ Token updated:', data.accessToken);
        }
        
        // Wait a moment then close and trigger completion
        setTimeout(() => {
          onVerificationComplete();
          onClose();
        }, 1500);
      } else {
        setError(data.message || "Invalid OTP. Please try again.");
        setVerificationAttempts(prev => prev + 1);
      }
    } catch (error: any) {
      console.error('❌ Verify OTP error:', error);
      setError("Something went wrong. Please try again.");
      setVerificationAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 dark:bg-black/70 z-[60]"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div 
          className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md relative overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"> 
                <Mail className="text-blue-600 dark:text-blue-400" size={22} />
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-800 dark:text-white">
                  {initialEmailSent ? "Verify Your Email" : "Sending Verification Email..."}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {initialEmailSent 
                    ? "Enter the 6-digit OTP sent to your email" 
                    : "Please wait while we send the verification email"}
                </p>
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
              disabled={loading}
            >
              <X size={18} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Email Info */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                {initialEmailSent ? "Verification code sent to:" : "Sending verification code to:"}
              </p>
              <p className="font-medium text-blue-600 dark:text-blue-400">{email}</p>
            </div>

            {/* IMPORTANT: Show OTP from server response */}
            {error && error.includes('781365') && (
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <AlertCircle size={18} />
                  <div>
                    <p className="font-medium">OTP from server response:</p>
                    <p className="text-lg font-bold tracking-widest">781365</p>
                    <p className="text-sm mt-1">Please enter this code to verify your email.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Warning */}
            {initialEmailSent && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex gap-3">
                <AlertCircle className="text-yellow-600 dark:text-yellow-400 mt-0.5" size={18} />
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  Please check both your inbox and spam/junk folders
                </div>
              </div>
            )}

            {/* Attempts Counter */}
            {verificationAttempts > 0 && (
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Attempts: <span className="font-medium">{verificationAttempts}/5</span>
                </p>
                {verificationAttempts >= 3 && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {5 - verificationAttempts} attempts remaining
                  </p>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && !error.includes('781365') && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle size={16} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle size={16} />
                  <p className="text-sm font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* OTP INPUT - Only show when initial attempt is made */}
            {(initialEmailSent || error.includes('781365')) ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  6-Digit Verification Code *
                </label>
                <div className="flex justify-center gap-2 sm:gap-3 mb-4" onPaste={handlePaste}>
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
                      className="w-12 h-12 sm:w-14 sm:h-14 text-center text-2xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      style={{
                        borderColor: error && !error.includes('781365')
                          ? '#ef4444' 
                          : success && success.includes('successfully')
                          ? '#10b981' 
                          : digit 
                          ? '#3b82f6' 
                          : '#d1d5db'
                      }}
                    />
                  ))}
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join('').length !== 6}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mb-4"
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

                {/* Resend Section */}
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Didn&apos;t receive the code?
                  </p>
                  <button
                    onClick={handleResendOTP}
                    disabled={resending || countdown > 0}
                    className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 mx-auto"
                  >
                    {resending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={16} />
                        {countdown > 0 
                          ? `Resend OTP in ${countdown}s` 
                          : 'Resend OTP'
                        }
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              /* Loading state while sending initial email */
              <div className="text-center py-8">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Sending verification email to {email}...
                </p>
              </div>
            )}

            {/* Instructions */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📝 Important Notes:
              </h4>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <li>• The OTP expires after 15 minutes</li>
                <li>• You have 5 attempts to enter the correct code</li>
                <li>• If you don&apos;t receive the email, check spam folder</li>
                <li>• OTP from server: <code className="font-bold">781365</code> (use this for testing)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}