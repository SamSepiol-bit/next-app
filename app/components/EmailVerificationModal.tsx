// components/EmailVerificationModal.tsx
import React, { useState, useEffect } from 'react';
import { Mail, X, ExternalLink, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  accessToken: string;
  userId: number;
  onVerificationSuccess: () => void;
  onVerificationComplete: () => void;
}

export default function EmailVerificationModal({
  isOpen,
  onClose,
  email,
  accessToken,
  userId,
  onVerificationSuccess,
  onVerificationComplete,
}: EmailVerificationModalProps) {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationChecked, setVerificationChecked] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-check verification status periodically
  useEffect(() => {
    if (!isOpen || !accessToken) return;

    const checkVerificationStatus = async () => {
      try {
        // Try to get user data to check if email_verified_at is now set
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const endpoint = `${API_BASE_URL}/api/user`;
        
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          
          // Check if email is now verified
          if (userData.email_verified_at !== null) {
            setVerificationChecked(true);
            alert('✅ Your email has been verified! You can now log in.');
            onVerificationComplete();
            onClose();
          }
        }
      } catch (error) {
        console.error('Status check error:', error);
      }
    };

    // Check every 10 seconds if user is still on the modal
    const interval = setInterval(checkVerificationStatus, 10000);
    
    // Initial check
    checkVerificationStatus();
    
    return () => clearInterval(interval);
  }, [isOpen, accessToken, onVerificationComplete, onClose]);

  const handleResendVerification = async () => {
    if (countdown > 0) return;
    
    setResending(true);
    setResendSuccess(false);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const endpoint = `${API_BASE_URL}/api/verify-email`;
      
      console.log('📤 Resending verification email to:', email);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setResendSuccess(true);
        setCountdown(60); // 60 seconds countdown
        alert('✅ Verification email resent! Please check your inbox.');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to resend verification email.');
      }
    } catch (error: any) {
      console.error('Resend error:', error);
      alert('Failed to resend verification email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleCheckNow = async () => {
    setLoading(true);
    
    try {
      // Try to login again to see if verification is complete
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const loginEndpoint = `${API_BASE_URL}/api/login`;
      
      // We need the user's password to check - you might want to store this temporarily
      // Or use a different endpoint that checks verification status
      
      // For now, we'll use the user info endpoint
      const userEndpoint = `${API_BASE_URL}/api/user`;
      
      const response = await fetch(userEndpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const userData = await response.json();
        
        if (userData.email_verified_at !== null) {
          setVerificationChecked(true);
          alert('✅ Your email has been verified! You can now log in.');
          onVerificationComplete();
          onClose();
        } else {
          alert('⏳ Email not verified yet. Please click the link in the email we sent you.');
        }
      }
    } catch (error) {
      console.error('Check error:', error);
      alert('Unable to check verification status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl w-full max-w-md relative overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Verify Your Email</h2>
                  <p className="text-gray-600">We sent a verification link to your email</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Email Display */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-gray-600 mb-1">Verification link sent to:</p>
              <p className="font-medium text-gray-800 text-lg">{email}</p>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <AlertCircle className="text-yellow-600 mt-0.5 flex-shrink-0" size={20} />
                <div className="space-y-2">
                  <p className="font-medium text-yellow-800">Important:</p>
                  <ul className="text-sm text-yellow-700 space-y-1 list-disc pl-4">
                    <li>Check your inbox and spam folder</li>
                    <li>Click the verification link in the email</li>
                    <li>The link will expire after a certain time</li>
                    <li>After clicking, return here to continue</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                <CheckCircle className="text-green-600 mt-0.5 flex-shrink-0" size={20} />
                <div>
                  <p className="font-medium text-green-800">What happens next?</p>
                  <p className="text-sm text-green-700 mt-1">
                    Once you click the verification link, your email will be confirmed and you can log in to your account.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-2">
              <button
                type="button"
                onClick={handleCheckNow}
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <RefreshCw size={18} />
                    I`ve Verified My Email - Continue
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resending || countdown > 0}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:text-blue-400 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
                  {resending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend Verification Email'}
                </button>
                
                <a
                  href={`https://mail.google.com/mail/u/0/#search/from%3A${encodeURIComponent('noreply@enricharcane.info')}+is%3Aunread`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <ExternalLink size={14} />
                  Open Gmail
                </a>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Verification Status:</span>
                <span className={`font-medium ${verificationChecked ? 'text-green-600' : 'text-yellow-600'}`}>
                  {verificationChecked ? 'Verified ✓' : 'Pending...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}