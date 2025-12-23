"use client";

import { useSearch } from "../context/SearchContext";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RECENT_KEY = "recent_searches";

export default function HotelSearch() {
  const { search, setSearch } = useSearch();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState(search);
  const [recent, setRecent] = useState<string[]>([]);

  /* Load recent searches */
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) (JSON.parse(stored));
  }, []);

  /* Debounce search */
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(input);
    }, 300);

    return () => clearTimeout(timer);
  }, [input, setSearch]);

  /* ESC to close */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* Save recent search */
  const saveRecent = (value: string) => {
    if (!value.trim()) return;

    const updated = [
      value,
      ...recent.filter((r) => r !== value),
    ].slice(0, 5);

    setRecent(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  return (
    <div className="relative">
      {/* DESKTOP SEARCH */}
      <input
        type="text"
        placeholder="Search hotels..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onBlur={() => saveRecent(input)}
        className="hidden md:block px-4 py-2 w-64 rounded-lg
                   bg-[var(--color-dark-700)]
                   text-[var(--color-dark-text-100)]
                   border border-[var(--color-dark-600)]
                   focus:outline-none focus:ring-2
                   focus:ring-[var(--color-dark-primary)]"
      />

      {/* MOBILE ICON */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-lg
                   bg-[var(--color-dark-700)]
                   border border-[var(--color-dark-600)]
                   text-white"
      >
        <Search size={20} />
      </button>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60"
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              className="mt-24 mx-auto max-w-md px-4"
            >
              <div className="bg-[var(--color-dark-700)] p-4 rounded-xl">

                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onBlur={() => saveRecent(input)}
                    placeholder="Search hotel name or location"
                    className="flex-1 px-3 py-2 rounded-lg
                               bg-[var(--color-dark-800)]
                               text-white border border-[var(--color-dark-600)]
                               focus:outline-none focus:ring-2
                               focus:ring-[var(--color-dark-primary)]"
                  />

                  <button
                    onClick={() => {
                      setOpen(false);
                      setInput("");
                      setSearch("");
                    }}
                    className="px-3 py-2 bg-red-600 rounded-lg text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* RECENT SEARCHES */}
                {recent.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-400 mb-1">Recent</p>
                    <div className="flex flex-wrap gap-2">
                      {recent.map((r) => (
                        <button
                          key={r}
                          onClick={() => setInput(r)}
                          className="text-sm px-3 py-1 rounded-full
                                     bg-[var(--color-dark-600)]
                                     text-white"
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
