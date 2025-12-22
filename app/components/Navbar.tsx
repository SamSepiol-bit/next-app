"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

            <button 
                className="ml-4 px-5 py-2 rounded-xl bg-[var(--color-primary-100)] text-white font-semibold hover:opacity-90 transition">
              Book Now
            </button>
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
              href="/hotel"
              className="block text-[var(--color-light-text-200)] hover:text-[var(--color-primary-100)]"
              onClick={() => setOpen(false)}
            >
              Admin
            </Link>

            <button className="w-full mt-2 px-5 py-2 rounded-xl bg-[var(--color-primary-100)] text-white font-semibold">
              Book Now
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
