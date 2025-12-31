// lib/api.ts - API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchProfile = async (token: string) => {
  const response = await fetch(`${API_BASE_URL}/api/candidate-profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
};

// hooks/useProfile.ts - Custom hook
import { useState, useEffect } from 'react';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) throw new Error('No token found');
        
        const data = await fetchProfile(token);
        setProfile(data.candidate);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return { profile, loading, error, refetch: () => setLoading(true) };
};