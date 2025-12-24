"use client";

import React from "react";
import { Filter } from "lucide-react";

interface FilterButtonProps {
  onClick: () => void;
  filterCount: number;
}

export default function FilterButton({ onClick, filterCount }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-[var(--color-dark-600)] text-white rounded-lg flex items-center gap-2 hover:bg-[var(--color-dark-700)] transition relative"
    >
      <Filter size={18} />
      <span className="hidden sm:inline">Filters</span>
      {filterCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
          {filterCount}
        </span>
      )}
    </button>
  );
}