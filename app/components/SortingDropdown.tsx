"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SortingDropdownProps {
  sortOption: "none" | "name" | "rating" | "price";
  sortDirection: "asc" | "desc";
  onSortChange: (option: "none" | "name" | "rating" | "price") => void;
}

export default function SortingDropdown({ sortOption, sortDirection, onSortChange }: SortingDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getSortDisplayText = () => {
    if (sortOption === "none") return "Sort by";
    if (sortOption === "name") return `Name ${sortDirection === "asc" ? "↑" : "↓"}`;
    if (sortOption === "rating") return `Rating ${sortDirection === "asc" ? "↑" : "↓"}`;
    if (sortOption === "price") return `Price ${sortDirection === "asc" ? "↑" : "↓"}`;
    return "Sort by";
  };

  const getSortIcon = () => {
    if (sortOption === "none") return <ChevronDown size={18} />;
    return sortDirection === "asc" ? <ChevronUp size={18} /> : <ChevronDown size={18} />;
  };

  const sortOptions = [
    { value: "none" as const, label: "None (Default)" },
    { value: "name" as const, label: "Name" },
    { value: "rating" as const, label: "Rating" },
    { value: "price" as const, label: "Price" },
  ];

  const handleOptionClick = (option: "none" | "name" | "rating" | "price") => {
    onSortChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main Button - Always clickable */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-[var(--color-dark-600)] text-white rounded-lg flex items-center gap-2 hover:bg-[var(--color-dark-700)] transition"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {getSortIcon()}
        <span>{getSortDisplayText()}</span>
      </button>
      
      {/* Dropdown Menu */}
      <div
        className={`
          absolute right-0 mt-2 w-48 bg-[var(--color-dark-700)] 
          rounded-lg shadow-lg border border-[var(--color-dark-600)] 
          transition-all duration-200 z-50
          ${isOpen 
            ? "opacity-100 visible translate-y-0" 
            : "opacity-0 invisible -translate-y-2"
          }
        `}
      >
        <div className="py-1">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`
                w-full text-left px-4 py-2 hover:bg-[var(--color-dark-600)] 
                flex items-center justify-between transition
                ${sortOption === option.value ? "text-blue-400" : "text-white"}
              `}
              role="menuitem"
            >
              <span>{option.label}</span>
              {sortOption === option.value && (
                <span className="text-xs">
                  {sortDirection === "asc" 
                    ? option.value === "name" ? "A → Z" : "Low → High"
                    : option.value === "name" ? "Z → A" : "High → Low"
                  }
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}