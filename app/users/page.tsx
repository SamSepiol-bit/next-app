"use client";

import { useEffect, useState } from "react";
import { APP_URL } from "../config/constant";

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(APP_URL + "users", {
          method: "GET",
           headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data: User[] = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-xl bg-white p-5 shadow-md"
            >
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-600">@{user.username}</p>
              <p className="text-sm text-blue-600">{user.email}</p>

              <div className="mt-3 text-sm text-gray-700">
                <p>
                  {user.address.street}, {user.address.suite}
                </p>
                <p>
                  {user.address.city} - {user.address.zipcode}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Lat: {user.address.geo.lat}, Lng:{" "}
                  {user.address.geo.lng}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
