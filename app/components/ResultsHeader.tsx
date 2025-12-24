"use client";

interface ResultsHeaderProps {
  filteredCount: number;
  totalCount: number;
  isAnyFilterActive: boolean;
  selectedRatings: number[];
  selectedLocations: string[];
  priceRange: [number, number];
  onClearFilters: () => void;
}

export default function ResultsHeader({
  filteredCount,
  totalCount,
  isAnyFilterActive,
  selectedRatings,
  selectedLocations,
  priceRange,
  onClearFilters,
}: ResultsHeaderProps) {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div>
        <p className="text-[var(--color-dark-text-200)]">
          Showing <span className="font-bold text-white">{filteredCount}</span> of{" "}
          <span className="font-bold text-white">{totalCount}</span> hotels
        </p>
        {isAnyFilterActive && (
          <p className="text-sm text-[var(--color-dark-text-300)] mt-1">
            {selectedRatings.length > 0 && `${selectedRatings.length} rating filter(s) `}
            {selectedLocations.length > 0 && `${selectedLocations.length} location filter(s) `}
            {priceRange[0] > 0 && `Price: Rs.${priceRange[0]}+ `}
            {priceRange[1] < 1000 && `Price: up to Rs.${priceRange[1]}`}
          </p>
        )}
      </div>
      {isAnyFilterActive && (
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}