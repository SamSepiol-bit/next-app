"use client";

import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import HotelSearch from "../components/SearchBar";
import { useSearch } from "../context/SearchContext";
import HotelCard from "../components/HotelCard";
import HotelModal from "../components/HotelModal";
import SortingDropdown from "../components/SortingDropdown";
import ResultsHeader from "../components/ResultsHeader";
import NoResults from "../components/NoResults";
import FilterSidebar from "../components/FilterSidebar";
import FilterButton from "../components/FilterButton";
import { Star } from "lucide-react";

/* TYPES */
interface StoredHotel {
  id: number;
  hotelName: string;
  location: string;
  contact: string;
  rating: number;
  price?: number;
}

interface HotelData extends StoredHotel {
  images: File[];
}

/* MAIN PAGE */
export default function Hotel() {
  // State Management
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [hotels, setHotels] = useState<HotelData[]>([]);
  
  // Form State
  const [hotelName, setHotelName] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [rating, setRating] = useState(0);
  const [price, setPrice] = useState<number>(0);
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Sorting State
  const [sortOption, setSortOption] = useState<"none" | "name" | "rating" | "price">("none");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Filter State
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const { search } = useSearch();

  /* LOAD HOTELS */
  useEffect(() => {
    const stored = localStorage.getItem("hotels");
    if (!stored) return;
    const parsed: StoredHotel[] = JSON.parse(stored);
    setHotels(parsed.map((h) => ({
      ...h,
      images: [],
      price: h.price || Math.floor(Math.random() * 500) + 50
    })));
  }, []);

  /* GET UNIQUE LOCATIONS */
  const uniqueLocations = Array.from(new Set(hotels.map(h => h.location)));

  /* FILTER AND SORT HOTELS */
  const filteredHotels = [...hotels]
    .filter((hotel) =>
      hotel.hotelName.toLowerCase().includes(search.toLowerCase()) ||
      hotel.location.toLowerCase().includes(search.toLowerCase())
    )
    .filter((hotel) => {
      if (selectedRatings.length > 0 && !selectedRatings.includes(hotel.rating)) 
        return false;
      if (hotel.price && (hotel.price < priceRange[0] || hotel.price > priceRange[1])) 
        return false;
      if (selectedLocations.length > 0 && !selectedLocations.includes(hotel.location))
         return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "name") {
        const comparison = a.hotelName.localeCompare(b.hotelName);
        return sortDirection === "asc" ? comparison : -comparison;
      } else if (sortOption === "rating") {
        const comparison = a.rating - b.rating;
        return sortDirection === "asc" ? comparison : -comparison;
      } else if (sortOption === "price") {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        const comparison = priceA - priceB;
        return sortDirection === "asc" ? comparison : -comparison;
      }
      return 0;
    });

  /* SAVE TO LOCALSTORAGE */
  const saveToLocalStorage = (data: HotelData[]) => {
    const withoutImages: StoredHotel[] = data.map(({ images, ...rest }) => rest);
    localStorage.setItem("hotels", JSON.stringify(withoutImages));
  };

  /* VALIDATION */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!hotelName.trim() || hotelName.length < 3) newErrors.hotelName = "Hotel name must be at least 3 characters";
    if (!location.trim()) newErrors.location = "Location is required";
    if (!/^[0-9]{9,10}$/.test(contact)) newErrors.contact = "Contact must be 9-10 digits";
    if (rating < 1 || rating > 5) newErrors.rating = "Please select a rating";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* FORM SUBMIT */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedHotels = editId
      ? hotels.map((h) => h.id === editId ? { ...h, hotelName, location, contact, rating, price, images } : h)
      : [...hotels, {
          id: Date.now(),
          hotelName,
          location,
          contact,
          rating,
          price: price || Math.floor(Math.random() * 500) + 50,
          images,
        }];

    setHotels(updatedHotels);
    saveToLocalStorage(updatedHotels);
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditId(null);
    setHotelName("");
    setLocation("");
    setContact("");
    setRating(0);
    setPrice(0);
    setImages([]);
    setErrors({});
  };

  const handleEdit = (hotel: HotelData) => {
    setEditId(hotel.id);
    setHotelName(hotel.hotelName);
    setLocation(hotel.location);
    setContact(hotel.contact);
    setRating(hotel.rating);
    setPrice(hotel.price || 0);
    setImages(hotel.images);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this hotel?")) return;
    const updated = hotels.filter((h) => h.id !== id);
    setHotels(updated);
    saveToLocalStorage(updated);
  };

  /* SORTING HANDLER */
  const handleSortChange = (option: "none" | "name" | "rating" | "price") => {
    if (option === "none") {
      setSortOption("none");
      return;
    }
    if (sortOption === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortOption(option);
      setSortDirection("asc");
    }
  };

  /* FILTER HANDLERS */
  const toggleRatingFilter = (rating: number) => {
    setSelectedRatings(prev => prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]);
  };

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range);
  };

  const toggleLocationFilter = (location: string) => {
    setSelectedLocations(prev => prev.includes(location) ? prev.filter(l => l !== location) : [...prev, location]);
  };

  const clearAllFilters = () => {
    setSelectedRatings([]);
    setPriceRange([0, 1000]);
    setSelectedLocations([]);
  };

  const isAnyFilterActive = selectedRatings.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000 || selectedLocations.length > 0;
  const filterCount = selectedRatings.length + selectedLocations.length + (priceRange[0] > 0 ? 1 : 0) + (priceRange[1] < 1000 ? 1 : 0);

  return (
    <main className="relative">
      <HeroSection
        backgroundImage="https://images.unsplash.com/photo-1720681272611-5739d0690d58?q=80&w=1170&auto=format&fit=crop"
        title="Manage Your Hotels"
        subtitle="Add, edit, and manage hotel listings with ease."
        buttonText="Add New Hotel"
      />

      <div className="min-h-screen bg-[var(--color-dark-800)]">
        {/* HEADER */}
        <header className="bg-[var(--color-dark-500)] border-b border-[var(--color-dark-600)]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <FilterButton onClick={() => setShowFilterSidebar(true)} filterCount={filterCount} />
              <h1 className="text-2xl font-bold text-white"></h1>
            </div>
            <div className="flex gap-4 items-center">
              <HotelSearch />
              <SortingDropdown
                sortOption={sortOption}
                sortDirection={sortDirection}
                onSortChange={handleSortChange}
              />
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-[var(--color-dark-primary)] text-white rounded-lg hover:opacity-90 transition"
              >
                Add Hotel
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="max-w-6xl mx-auto px-6 py-10 lg:flex lg:gap-6">
          <FilterSidebar
            isOpen={showFilterSidebar}
            onClose={() => setShowFilterSidebar(false)}
            selectedRatings={selectedRatings}
            onRatingChange={toggleRatingFilter}
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            selectedLocations={selectedLocations}
            onLocationChange={toggleLocationFilter}
            uniqueLocations={uniqueLocations}
            onClearAllFilters={clearAllFilters}
          />

          <div className="flex-1">
            <ResultsHeader
              filteredCount={filteredHotels.length}
              totalCount={hotels.length}
              isAnyFilterActive={isAnyFilterActive}
              selectedRatings={selectedRatings}
              selectedLocations={selectedLocations}
              priceRange={priceRange}
              onClearFilters={clearAllFilters}
            />

            {filteredHotels.length === 0 ? (
              <NoResults
                search={search}
                isAnyFilterActive={isAnyFilterActive}
                onClearFilters={clearAllFilters}
              />
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}

            {filteredHotels.length > 0 && sortOption !== "none" && (
              <div className="mt-6 text-center">
                <p className="text-[var(--color-dark-text-200)] inline-flex items-center gap-2 bg-[var(--color-dark-700)] px-4 py-2 rounded-lg">
                  <span>Sorted by: {sortOption === "name" ? "Hotel Name" : sortOption === "rating" ? "Rating" : "Price"}</span>
                  <span>({sortDirection === "asc" ? "Ascending" : "Descending"})</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* MODAL */}
        <HotelModal
          isOpen={showForm}
          onClose={resetForm}
          editId={editId}
          hotelName={hotelName}
          setHotelName={setHotelName}
          location={location}
          setLocation={setLocation}
          contact={contact}
          setContact={setContact}
          price={price}
          setPrice={setPrice}
          rating={rating}
          setRating={setRating}
          images={images}
          setImages={setImages}
          errors={errors}
          setErrors={setErrors}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  );
}