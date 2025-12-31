import { useState, useEffect } from 'react';
import { checkVerificationStatus } from '../lib/auth';

export function useVerificationStatus() {
    const [isVerified, setIsVerified] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                
                if (!token) {
                    setIsVerified(null);
                    return;
                }

                const data = await checkVerificationStatus();
                setIsVerified(data.isVerified);
            } catch (err: any) {
                console.error('Verification check error:', err);
                setError(err.message);
                setIsVerified(null);
            } finally {
                setLoading(false);
            }
        };

        checkStatus();
    }, []);

    const refetch = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const data = await checkVerificationStatus();
            setIsVerified(data.isVerified);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { isVerified, loading, error, refetch };
}