"use client";

import { useState, useEffect } from "react";
import { Mail, MapPin, Briefcase, CheckCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import API_CONFIG from "@/app/api/config";

interface ProfileCardProps {
  className?: string;
}

interface CandidateProfile {
  id: number;
  full_name: string;
  username: string;
  email: string;
  email_verified_at: string | null;
  avatar: string | null;
  country_name: string;
  available_free_jobs_count: number;
  referral_count: number;
  status: "active" | "inactive";
  kyc_status: "approved" | "pending" | "rejected";
  is_online?: boolean;
}

export default function ProfileCard({ className = "" }: ProfileCardProps) {

  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        console.warn("No auth token found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.PROFILE),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();

      // adjust to actual backend response
      const candidate: CandidateProfile =
        data.candidate || data.data || data;

      setProfile(candidate);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-2 border-blue-100 overflow-hidden">
            <Image
              src={profile.avatar || "/default-avatar.png"}
              alt={profile.full_name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>

          {profile.is_online && (
            <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-gray-800">
                {profile.full_name}
              </h3>
              <p className="text-sm text-gray-600">@{profile.username}</p>
            </div>

            <span
              className={`px-2 py-1 text-xs rounded-full ${
                profile.kyc_status === "approved"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {profile.kyc_status}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <span>{profile.email}</span>

              {profile.email_verified_at ? (
                <CheckCircle className="w-4 h-4 text-green-500 ml-2" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500 ml-2" />
              )}
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{profile.country_name}</span>
            </div>

            <div className="flex items-center text-sm text-gray-600">
              <Briefcase className="w-4 h-4 mr-2" />
              <span>
                {profile.available_free_jobs_count} free jobs available
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-gray-500">Referrals:</span>
            <span className="font-medium ml-2">
              {profile.referral_count}
            </span>
          </div>

          <div>
            <span className="text-gray-500">Status:</span>
            <span
              className={`font-medium ml-2 ${
                profile.status === "active"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {profile.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
