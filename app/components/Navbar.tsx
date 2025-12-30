"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LoginModal from "./LoginModel";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Check if user is already logged in
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginSuccess = (userData: any, token: string) => {
    setIsLoggedIn(true);
    setUser(userData);
    setIsLoginModalOpen(false);
    // Optionally redirect to dashboard
    router.push('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-light-border-200)] border-b border-[var(--color-light-border-200)]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex items-center justify-between h-16 ">
          
          {/* LOGO */}
          <Link
            href="/"
            className="text-2xl font-bold text-[var(--color-light-text-100)]"
          >
            Luxury<span className="text-[var(--color-primary-100)]">Hotel`s</span>
          </Link>

          {/* DESKTOP MENU */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-[var(--color-light-text-200)] hover:text-[var(--color-primary-100)] transition"
            >
              Home
            </Link>
            <a
              href="#rooms"
              className="text-[var(--color-light-text-200)] hover:text-[var(--color-primary-100)] transition"
            >
              Rooms
            </a>
            <a
              href="#services"
              className="text-[var(--color-light-text-200)] hover:text-[var(--color-primary-100)] transition"
            >
              Services
            </a>
            <Link
              href=""
              className="text-[var(--color-light-text-200)] hover:text-[var(--color-primary-100)] transition"
            >
              Admin
            </Link>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-[var(--color-light-text-200)]">
                  Welcome, {user?.name || user?.email?.split('@')[0]}
                </span>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="ml-4 px-5 py-2 rounded-xl bg-[var(--color-primary-100)] text-white font-semibold hover:opacity-90 transition"
              >
                Login
              </button>
            )}

            {/* Login Modal */}
            <LoginModal 
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
              onLoginSuccess={handleLoginSuccess} // Added this prop
            />
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-3xl text-[var(--color-light-text-100)]"
          >
            ☰
          </button>
        </div>

        {/* MOBILE MENU */}
        {open && (
          <div className="md:hidden py-4 space-y-3 border-t border-[var(--color-light-border-200)]">
            <Link
              href="/"
              className="block text-[var(--color-light-text-200)] hover:text-[var(--color-primary-100)]"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            <a
              href="#rooms"
              className="block text-[var(--color-light-text-200)] hover:text-[var(--color-primary-100)]"
              onClick={() => setOpen(false)}
            >
              Rooms
            </a>
            <a
              href="#services"
              className="block text-[var(--color-light-text-200)] hover:text-[var(--color-primary-100)]"
              onClick={() => setOpen(false)}
            >
              Services
            </a>
            <Link
              href="/register"
              className="block text-[var(--color-light-text-200)] hover:text-[var(--color-primary-100)]"
              onClick={() => setOpen(false)}
            >
              Register
            </Link>

            {isLoggedIn ? (
              <div className="space-y-3">
                <div className="text-center text-[var(--color-light-text-200)]">
                  Welcome, {user?.name || user?.email?.split('@')[0]}
                </div>
                <Link
                  href="/dashboard"
                  className="block w-full px-4 py-2 text-center rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setOpen(false);
                }}
                className="w-full px-5 py-2 rounded-xl bg-[var(--color-primary-100)] text-white font-semibold hover:opacity-90 transition"
              >
                Login
              </button>
            )}

            {/* Login Modal */}
            <LoginModal 
              isOpen={isLoginModalOpen}
              onClose={() => setIsLoginModalOpen(false)}
              onLoginSuccess={handleLoginSuccess} // Added this prop
            />
          </div>
        )}
      </div>
    </header>
  );
}