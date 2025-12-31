// components/Profile/UserProfile.tsx
"use client";

import { useState, useEffect } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Shield,
  Edit, Globe, MessageCircle, Award, Briefcase, FileText,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import { format } from 'path';

interface UserProfileData {
  id: number;
  uuid: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  phone: string;
  whatsapp_number: string;
  status: string;
  blacklisted: boolean;
  kyc_status: string;
  referral_code: string;
  is_cv_published: boolean;
  cv_updated_at: string | null;
  created_at: string;
  updated_at: string;
  full_name: string;
  avatar: string;
  country_name: string;
  is_online: boolean;
  available_free_jobs_count: number;
  referral_count: number;
}

interface UserProfileProps {
  userId?: number;
}

export default function UserProfile({ userId }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        'https://jobsformycv.enricharcane.info/api/candidate-profile',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidate) {
        setProfile(data.candidate);
      } else {
        throw new Error('No profile data found');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load profile');
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Profile</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchProfile}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Profile Found</h3>
        <p className="text-gray-500">Please complete your profile setup</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-white">
                <Image
                  src={profile.avatar}
                  alt={profile.full_name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              {profile.is_online && (
                <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile.full_name}</h1>
              <p className="text-blue-100">@{profile.username}</p>
              <div className="flex items-center mt-2 space-x-2">
                <span className="bg-blue-500/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                  {profile.country_name}
                </span>
                {profile.is_online && (
                  <span className="bg-green-500/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Online
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition">
            <Edit className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Free Jobs Available</p>
                <p className="text-2xl font-bold text-blue-700">
                  {profile.available_free_jobs_count}
                </p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Referrals</p>
                <p className="text-2xl font-bold text-green-700">
                  {profile.referral_count}
                </p>
              </div>
              <Award className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">KYC Status</p>
                <div className="flex items-center space-x-2">
                  <span className={`text-lg font-bold ${
                    profile.kyc_status === 'approved' ? 'text-green-700' : 
                    profile.kyc_status === 'pending' ? 'text-yellow-700' : 
                    'text-red-700'
                  }`}>
                    {profile.kyc_status.charAt(0).toUpperCase() + profile.kyc_status.slice(1)}
                  </span>
                  {profile.kyc_status === 'approved' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <div className="flex items-center">
                      <p className="font-medium">{profile.email}</p>
                      {profile.email_verified_at ? (
                        <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-yellow-500 ml-2" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{profile.phone}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MessageCircle className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">WhatsApp</p>
                    <p className="font-medium">{profile.whatsapp_number}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{profile.country_name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Account Status
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email Verified</span>
                  {profile.email_verified_at ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center text-yellow-600">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Pending
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Blacklisted</span>
                  <span className={profile.blacklisted ? 'text-red-600' : 'text-green-600'}>
                    {profile.blacklisted ? 'Yes' : 'No'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">KYC Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.kyc_status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : profile.kyc_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {profile.kyc_status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* CV Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                CV Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">CV Published</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profile.is_cv_published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profile.is_cv_published ? 'Published' : 'Not Published'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">
                    {profile.cv_updated_at 
                      ? formatDate(profile.cv_updated_at)
                      : 'Never'
                    }
                  </span>
                </div>

                <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition flex items-center justify-center">
                  <FileText className="w-5 h-5 mr-2" />
                  {profile.is_cv_published ? 'Update CV' : 'Publish CV'}
                </button>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Account Information
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">{formatDate(profile.created_at)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">{formatDate(profile.updated_at)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">User ID</span>
                  <span className="font-mono text-sm">{profile.uuid}</span>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Referral Code</span>
                    <div className="flex items-center space-x-2">
                      <code className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-mono">
                        {profile.referral_code}
                      </code>
                      <button className="text-blue-600 hover:text-blue-800">
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <button className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex flex-col items-center">
                  <Edit className="w-5 h-5 text-blue-600 mb-2" />
                  <span className="text-sm font-medium">Edit Profile</span>
                </button>
                <button className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex flex-col items-center">
                  <Shield className="w-5 h-5 text-green-600 mb-2" />
                  <span className="text-sm font-medium">KYC Verify</span>
                </button>
                <button className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex flex-col items-center">
                  <Mail className="w-5 h-5 text-purple-600 mb-2" />
                  <span className="text-sm font-medium">Verify Email</span>
                </button>
                <button className="p-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition flex flex-col items-center">
                  <Globe className="w-5 h-5 text-orange-600 mb-2" />
                  <span className="text-sm font-medium">Share Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        {!profile.email_verified_at && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <p className="font-medium text-yellow-800">Email Verification Required</p>
                <p className="text-sm text-yellow-700">
                  Please verify your email address to access all features
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-medium">
              Verify Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}