"use client";

import React from "react";

interface NoResultsProps {
  search: string;
  isAnyFilterActive: boolean;
  onClearFilters: () => void;
}

export default function NoResults({ search, isAnyFilterActive, onClearFilters }: NoResultsProps) {
  return (
    <div className="text-center py-16">
      <div className="inline-block p-6 bg-[var(--color-dark-700)] rounded-2xl">
        <div className="text-6xl mb-4">🏨</div>
        <h3 className="text-2xl font-bold text-white mb-2">No hotels found</h3>
        <p className="text-[var(--color-dark-text-200)] mb-6">
          {search.trim() === "" && !isAnyFilterActive
            ? "No hotels available. Add your first hotel!"
            : `No hotels match your ${search.trim() ? "search and " : ""}filters.`}
        </p>
        {(search.trim() !== "" || isAnyFilterActive) && (
          <button
            onClick={onClearFilters}
            className="px-6 py-2 bg-[var(--color-dark-primary)] text-white rounded-lg hover:opacity-90 transition"
          >
            Clear Search & Filters
          </button>
        )}
      </div>
    </div>
  );
}