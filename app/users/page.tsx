"use client";

import { useEffect, useState } from "react";
import { APP_URL } from "../config/constant";
import Image from "next/image";

interface Geo {
  lat: string;
  lng: string;
}

interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const endpoint = `${API_BASE_URL}/api/user`;

        console.log('📤 User Data fetch success:', endpoint);
        
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        });

        console.log('📥 Response status:', response.status);
        
        const responseText = await response.text();
        console.log('📥 Response body:', responseText);

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
        }

        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('❌ JSON parse error:', parseError);
          throw new Error('Invalid JSON response from server');
        }

        // Handle different response formats
        if (data.users) {
          setUsers(data.users);
        } else if (data.data) {
          setUsers(data.data);
        } else if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.warn('⚠️ Unexpected response format:', data);
          setUsers([]);
        }
      } catch (error: any) {
        console.error("❌ Error fetching users:", error);
        setError(error.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const retryFetch = () => {
    setLoading(true);
    setError(null);
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${APP_URL}/api/user`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.users) {
          setUsers(data.users);
        } else if (data.data) {
          setUsers(data.data);
        } else if (Array.isArray(data)) {
          setUsers(data);
        }
      } catch (error: any) {
        setError(error.message || "Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  };

  // Function to generate avatar URL
  const getAvatarUrl = (name: string, email: string) => {
    const avatarName = name || email.split('@')[0];
    const encodedName = encodeURIComponent(avatarName);
    const randomColor = Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    return `https://ui-avatars.com/api/?name=${encodedName}&color=ffffff&background=${randomColor}&size=512`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-semibold">Error Loading Users</h3>
            <p className="mt-2">{error}</p>
          </div>
          <button
            onClick={retryFetch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="text-sm text-gray-500">
          Total: {users.length} users
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Users Found</h3>
          <p className="text-gray-500">There are no users to display at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => {
            const avatarUrl = getAvatarUrl(user.name, user.email);
            
            return (
              <div
                key={user.id}
                className="rounded-xl bg-white p-5 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  {/* Fallback to initial if Image fails */}
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                        onError={(e) => {
                          // Fallback to initial if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = parent.querySelector('.avatar-fallback');
                            if (fallback) {
                              (fallback as HTMLElement).style.display = 'flex';
                            }
                          }
                        }}
                      />
                    ) : null}
                    <div className="avatar-fallback absolute inset-0 flex items-center justify-center" style={{ display: avatarUrl ? 'none' : 'flex' }}>
                      <span className="text-blue-600 font-bold">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="text-sm text-gray-600">@{user.username}</p>
                    <p className="text-sm text-blue-600 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Address</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p className="truncate">
                      {user.address.street}, {user.address.suite}
                    </p>
                    <p>
                      {user.address.city} - {user.address.zipcode}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-2">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>Lat: {user.address.geo.lat}, Lng: {user.address.geo.lng}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}