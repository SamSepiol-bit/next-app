// app/profile/page.tsx
"use client";

import { useState, useEffect } from 'react'; // Add useEffect
import UserProfile from '../userProfile/page';
import ProfileCard from '../components/Profile/ProfileCard';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [refreshing, setRefreshing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null); // Add state for profile data

  // Add useEffect to fetch profile data if needed
  useEffect(() => {
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Compact Profile Card */}
            <ProfileCard />
            
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Completion</span>
                  <span className="font-bold text-blue-600">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
                </div>
              </div>
            </div>
            
            {/* Navigation */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Profile Sections</h3>
              <nav className="space-y-2">
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 text-blue-600 font-medium">
                  Personal Information
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                  CV & Documents
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                  Security Settings
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                  Notifications
                </button>
                <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                  Account History
                </button>
              </nav>
            </div>
          </div>

          {/* Main Profile */}
          <div className="lg:col-span-3">
            <UserProfile />
            
            {/* Remove this section or fix it */}
            {/* If you want to show experiences, let UserProfile handle it */}
            {/* Or create a separate Experiences component */}
          </div>
        </div>
      </div>
    </div>
  );
}