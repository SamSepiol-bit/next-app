"use client";

import React, { useEffect, useRef } from "react";
import { Filter, X, DollarSign, MapPin, Check, Star } from "lucide-react";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRatings: number[];
  onRatingChange: (rating: number) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  selectedLocations: string[];
  onLocationChange: (location: string) => void;
  uniqueLocations: string[];
  onClearAllFilters: () => void;
}

export default function FilterSidebar({
  isOpen,
  onClose,
  selectedRatings,
  onRatingChange,
  priceRange,
  onPriceChange,
  selectedLocations,
  onLocationChange,
  uniqueLocations,
  onClearAllFilters,
}: FilterSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Check if any filter is active
  const isAnyFilterActive = 
    selectedRatings.length > 0 || 
    priceRange[0] > 0 || 
    priceRange[1] < 1000 || 
    selectedLocations.length > 0;

  // Close sidebar when clicking outside on desktop
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Only close on desktop when clicking outside
      if (window.innerWidth >= 1024 && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target as Node) &&
          isOpen) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay - Show on both mobile and desktop when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div 
            ref={sidebarRef}
                className={`
                /* Mobile & Desktop Common Styles */
                fixed left-0 top-0 h-full w-80 bg-[var(--color-dark-700)]
                border-r border-[var(--color-dark-600)]
                shadow-2xl z-50 transform transition-transform duration-300
                
                /* Mobile: Slide in/out from left */
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                
                /* Desktop: Slide in/out from left */
                lg:${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-[var(--color-dark-600)]">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Filter size={20} />
                Filters
                </h2>
                <button
                onClick={onClose}
                className="p-2 hover:bg-[var(--color-dark-600)] rounded-lg"
                >
                <X size={20} className="text-[var(--color-dark-text-200)]" />
                </button>
            </div>
            
            {isAnyFilterActive && (
                <button
                onClick={onClearAllFilters}
                className="mt-3 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                <X size={14} />
                Clear all filters
                </button>
            )}
            </div>

            {/* Sidebar Content */}
            <div className="p-4 overflow-y-auto h-[calc(100%-80px)]">
                {/* Rating Filter */}
                <div className="mb-6">
                    <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <Star size={16} />
                    Rating
                    </h3>
                    <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <button
                        key={star}
                        onClick={() => onRatingChange(star)}
                        className={`w-full flex items-center justify-between p-2 rounded-lg transition ${
                            selectedRatings.includes(star)
                            ? 'bg-blue-900/30 border border-blue-500'
                            : 'bg-[var(--color-dark-600)] hover:bg-[var(--color-dark-500)]'
                        }`}
                        >
                        <div className="flex items-center gap-2">
                            <span className={`w-4 h-4 flex items-center justify-center rounded border ${
                            selectedRatings.includes(star)
                                ? 'bg-blue-500 border-blue-500'
                                : 'border-[var(--color-dark-text-300)]'
                            }`}>
                            {selectedRatings.includes(star) && (
                                <Check size={12} className="text-white" />
                            )}
                            </span>
                            <span className="text-[var(--color-dark-text-100)]">
                            {star} Star{star > 1 ? 's' : ''}
                            </span>
                        </div>
                        <div className="text-[var(--color-dark-warning)]">
                            {"★".repeat(star)}
                        </div>
                        </button>
                    ))}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-semibold text-white mb-3 flex-items-center gap-2">
                        Prices Range
                    </h3>

                    <div className="px-2">
                        <div className="mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-[var(--color-dark-text-200)]">Min: Rs.{priceRange[0]}</span>
                                <span className="text-sm text-[var(--color-dark-text-200)]">Max: Rs.{priceRange[1]}</span>
                            </div>
                            <input type="range"
                                min={0}
                                max={1000}
                                value={priceRange[0]}
                                onChange={(e) => onPriceChange([parseInt(e.target.value), priceRange[1]])}
                                className="w-full h-2 bg-[var(--color-dark-600)] rounded-lg appearance-none cusore-pointer
                                    [&::-webkit-slider-thumb]:appearance-none 
                                    [&::-webkit-slider-thumb]:h-4 
                                    [&::-webkit-slider-thumb]:w-4 
                                    [&::-webkit-slider-thumb]:rounded-full 
                                    [&::-webkit-slider-thumb]:bg-blue-500"
                            />
                        </div>

                        <div>
                            <input type="range"
                                min={0}
                                max={1000}
                                value={priceRange[1]}
                                onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
                                className="w-full h-2 bg-[var(--color-dark-600)] rounded-lg appearance-none cursor-pointer
                                    [&::-webkit-slider-thumb]:appearance-none
                                    [&::-webkit-slider-thumb]:h-4
                                    [&::-webkit-slider-thumb]:w-4
                                    [&::-webkit-slider-thumb]:rounded-full
                                    [&::-webkit-slider-thumb]:bg-blue-500"
                            />
                        </div>
                    </div>
                </div>
               <div className="mb-6">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <MapPin size={16} />
              Location
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {uniqueLocations.map((location) => (
                <button
                  key={location}
                  onClick={() => onLocationChange(location)}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg transition ${
                    selectedLocations.includes(location)
                      ? 'bg-blue-900/30 border border-blue-500'
                      : 'bg-[var(--color-dark-600)] hover:bg-[var(--color-dark-500)]'
                  }`}
                >
                  <span className={`w-4 h-4 flex items-center justify-center rounded border ${
                    selectedLocations.includes(location)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-[var(--color-dark-text-300)]'
                  }`}>
                    {selectedLocations.includes(location) && (
                      <Check size={12} className="text-white" />
                    )}
                  </span>
                  <span className="text-[var(--color-dark-text-100)] text-left truncate">
                    {location}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {isAnyFilterActive && (
            <div className="mt-6 p-3 bg-[var(--color-dark-600)] rounded-lg">
              <h4 className="font-medium text-white mb-2">Active Filters:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRatings.map(rating => (
                  <span 
                    key={rating} 
                    className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-sm flex items-center gap-1"
                  >
                    {rating}★
                    <button 
                      onClick={() => onRatingChange(rating)}
                      className="hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                  <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-sm flex items-center gap-1">
                    ${priceRange[0]} - ${priceRange[1]}
                    <button 
                      onClick={() => onPriceChange([0, 1000])}
                      className="hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {selectedLocations.map(location => (
                  <span 
                    key={location} 
                    className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded text-sm flex items-center gap-1"
                  >
                    {location}
                    <button 
                      onClick={() => onLocationChange(location)}
                      className="hover:text-white"
                    >
                      <X size={12} />
                    </button>

                    
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}