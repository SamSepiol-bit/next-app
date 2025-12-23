"use client";

import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";
import Image from "next/image";
import HotelSearch from "../components/SearchBar";
import { useSearch } from "../context/SearchContext";
import { Search, Star, ChevronDown, ChevronUp, icons   } from "lucide-react";


/*  TYPES  */
interface StoredHotel {
  id: number;
  hotelName: string;
  location: string;
  contact: string;
  rating: number;
}

interface HotelData extends StoredHotel {
  images: File[];
}

/*  IMAGE SLIDER  */
function ImageSlider({ images }: { images: File[] }) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="relative">
      <Image
        src={URL.createObjectURL(images[index])}
        alt="Hotel"
        className="w-full h-48 object-cover rounded-xl"
        width={250}
        height={200}
      />

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2
                   bg-[var(--color-dark-primary)]
                   text-[var(--color-dark-text-100)]
                   px-2 rounded"
      >
        ‹
      </button>

      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2
                   bg-[var(--color-dark-primary)]
                   text-[var(--color-dark-text-100)]
                   px-2 rounded"
      >
        ›
      </button>
    </div>
  );
}

/* MAIN PAGE  */
export default function Hotel() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [hotelName, setHotelName] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [hotels, setHotels] = useState<HotelData[]>([]);
  
  const [sortOption, setSortOption] = useState<"none" | "name" | "rating">("none");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Get search value from context
  const { search } = useSearch();

  /* LOAD HOTELS FROM LOCALSTORAGE */
  useEffect(() => {
    const stored = localStorage.getItem("hotels");
    if (!stored) return;

    const parsed: StoredHotel[] = JSON.parse(stored);

    setHotels(parsed.map((h) => ({ ...h, images: [] })));
  }, []);

  /* FILTER AND SORT HOTELS */
  const filteredHotels = [...hotels]
    .filter((hotel) =>
      hotel.hotelName.toLowerCase().includes(search.toLowerCase()) ||
      hotel.location.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "name") {
        const comparison = a.hotelName.localeCompare(b.hotelName);
        return sortDirection === "asc" ? comparison : -comparison;
      } 
      else if (sortOption === "rating") {
        const comparison = a.rating - b.rating;
        return sortDirection === "asc" ? comparison : -comparison;
      }
      return 0; // No sorting when sortOption is "none"
    });

  /*  SAVE  */
  const saveToLocalStorage = (data: HotelData[]) => {
    const withoutImages: StoredHotel[] = data.map(
      ({ images, ...rest }) => rest
    );
    localStorage.setItem("hotels", JSON.stringify(withoutImages));
  };

  /*  IMAGE HANDLER  */
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    if (files.length < 5) {
      setErrors((p) => ({ ...p, images: "Upload at least 5 images" }));
      return;
    }

    setImages(files);
    setErrors((p) => ({ ...p, images: "" }));
  };

  /*  VALIDATION  */
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!hotelName.trim() || hotelName.length < 3)
      newErrors.hotelName = "Hotel name must be at least 3 characters";

    if (!location.trim())
      newErrors.location = "Location is required";

    if (!/^[0-9]{9,10}$/.test(contact))
      newErrors.contact = "Contact must be 9-10 digits";

    if (rating < 1 || rating > 5)
      newErrors.rating = "Please select a rating";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /*  SUBMIT  */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedHotels = editId
      ? hotels.map((h) =>
          h.id === editId
            ? { ...h, hotelName, location, contact, rating, images }
            : h
        )
      : [
          ...hotels,
          {
            id: Date.now(),
            hotelName,
            location,
            contact,
            rating,
            images,
          },
        ];

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
    setImages([]);
    setErrors({});
  };

  const handleEdit = (hotel: HotelData) => {
    setEditId(hotel.id);
    setHotelName(hotel.hotelName);
    setLocation(hotel.location);
    setContact(hotel.contact);
    setRating(hotel.rating);
    setImages(hotel.images);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this hotel?")) return;
    const updated = hotels.filter((h) => h.id !== id);
    setHotels(updated);
    saveToLocalStorage(updated);
  };

  // Handle sort option change from dropdown
  const handleSortChange = (option: "none" | "name" | "rating") => {
    if (option === "none") {
      setSortOption("none");
      return;
    }
    
    if (sortOption === option) {
      // Toggle direction if same option clicked
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new option with default ascending direction
      setSortOption(option);
      setSortDirection("asc");
    }
  };

  // Get current sort display text
  const getSortDisplayText = () => {
    if (sortOption === "none") return "Sort by";
    if (sortOption === "name") return `Name ${sortDirection === "asc" ? "↑" : "↓"}`;
    if (sortOption === "rating") return `Rating ${sortDirection === "asc" ? "↑" : "↓"}`;
    return "Sort by";
  };

  // Get sort icon
  const getSortIcon = () => {
    if (sortOption === "none") return <ChevronDown size={18} />;
    return sortDirection === "asc" ? <ChevronUp size={18} /> : <ChevronDown size={18} />;
  };

  return (
    <main>
      {/* page hero */}
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
            <h1 className="text-2xl font-bold text-white">Hotels</h1>

            <div className="flex gap-4 items-center">
              <HotelSearch />
              
              {/* Single Sorting Dropdown */}
              <div className="relative group">
                <button className="px-4 py-2 bg-[var(--color-dark-600)] text-[var(--color-dark-text-100)] rounded-lg flex items-center gap-2 hover:bg-[var(--color-dark-700)] transition">
                  {getSortIcon()}
                  <span>{getSortDisplayText()}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-[var(--color-dark-700)] rounded-lg shadow-lg border border-[var(--color-dark-600)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => handleSortChange("none")}
                      className={`w-full text-left px-4 py-2 hover:bg-[var(--color-dark-600)] ${
                        sortOption === "none" 
                          ? "text-blue-400" 
                          : "text-[var(--color-dark-text-100)]"
                      }`}
                    >
                      None (Default)
                    </button>
                    
                    <button
                      onClick={() => handleSortChange("name")}
                      className={`w-full text-left px-4 py-2 hover:bg-[var(--color-dark-600)] flex items-center justify-between ${
                        sortOption === "name" 
                          ? "text-blue-400" 
                          : "text-[var(--color-dark-text-100)]"
                      }`}
                    >
                      <span>Name</span>
                      {sortOption === "name" && (
                        <span className="text-xs">
                          {sortDirection === "asc" ? "A → Z" : "Z → A"}
                        </span>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleSortChange("rating")}
                      className={`w-full text-left px-4 py-2 hover:bg-[var(--color-dark-600)] flex items-center justify-between ${
                        sortOption === "rating" 
                          ? "text-blue-400" 
                          : "text-[var(--color-dark-text-100)]"
                      }`}
                    >
                      <span>Rating</span>
                      {sortOption === "rating" && (
                        <span className="text-xs">
                          {sortDirection === "asc" ? "Low → High" : "High → Low"}
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-[var(--color-dark-primary)] text-white rounded-lg hover:opacity-90 transition"
              >
                Add Hotel
              </button>
            </div>
          </div>
        </header>

        {/* GRID */}
        <div className="max-w-6xl mx-auto px-6 py-10">
          {filteredHotels.length === 0 ? (
            /* NO RESULTS FOUND */
            <div className="text-center py-16">
              <div className="inline-block p-6 bg-[var(--color-dark-700)] rounded-2xl">
                <div className="text-6xl mb-4">
                   
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  No hotels found
                </h3>
                <p className="text-[var(--color-dark-text-200)] mb-6">
                  {search.trim() === "" 
                    ? "No hotels available. Add your first hotel!" 
                    : `No hotels found for "${search}". Try adjusting your search.`}
                </p>
                {search.trim() !== "" && (
                  <button
                    onClick={() => {
                      // You'll need to implement a way to clear search from context
                      // For now, just clear local search or refresh
                      window.location.reload();
                    }}
                    className="px-6 py-2 bg-[var(--color-dark-primary)] text-white rounded-lg hover:opacity-90 transition"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* HOTELS GRID */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-[var(--color-dark-700)]
                            border border-[var(--color-dark-600)]
                            rounded-2xl p-4"
                >
                  {hotel.images.length > 0 && <ImageSlider images={hotel.images} />}

                  <div className="flex justify-between items-start mt-3">
                    <h3 className="font-bold text-[var(--color-dark-text-100)]">
                      {hotel.hotelName}
                    </h3>
                    <div className="flex items-center gap-1 bg-[var(--color-dark-800)] px-2 py-1 rounded">
                      <Star size={14} className="text-[var(--color-dark-warning)]" />
                      <span className="text-sm font-bold text-white">{hotel.rating}</span>
                    </div>
                  </div>

                  <p className="text-sm text-[var(--color-dark-text-200)] mt-1">
                     {hotel.location}
                  </p>

                  <p className="text-sm text-[var(--color-dark-text-300)]">
                     {hotel.contact}
                  </p>

                  <div className="text-[var(--color-dark-warning)] mt-2">
                    {"★".repeat(hotel.rating)}
                    <span className="text-[var(--color-dark-text-300)]">
                      {"☆".repeat(5 - hotel.rating)}
                    </span>
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(hotel)}
                      className="flex-1 border border-[var(--color-dark-primary)]
                                text-[var(--color-dark-primary)] rounded-lg py-2 hover:bg-[var(--color-dark-primary)] hover:text-white transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(hotel.id)}
                      className="flex-1 bg-[var(--color-dark-primary)]
                                text-[var(--color-dark-text-100)] rounded-lg py-2 hover:opacity-90 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Sorting Indicator */}
          {filteredHotels.length > 0 && sortOption !== "none" && (
            <div className="mt-6 text-center">
              <p className="text-[var(--color-dark-text-200)] inline-flex items-center gap-2 bg-[var(--color-dark-700)] px-4 py-2 rounded-lg">
                <span>Sorted by: {sortOption === "name" ? "Hotel Name" : "Rating"}</span>
                <span>({sortDirection === "asc" ? "Ascending" : "Descending"})</span>
              </p>
            </div>
          )}
        </div>

        {/* MODAL */}
        {showForm && (
          
          <div className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center">
            <div className="bg-[var(--color-dark-700)] rounded-2xl p-6 w-full max-w-lg">
              <h1 className="text-3xl font-bold text-white mb-5 text-center">Hotel Management</h1>
              <form onSubmit={handleSubmit} className="space-y-3">
                {[
                  
                  {
                    value: hotelName,
                    set: setHotelName,
                    error: errors.hotelName,
                    placeholder: "Hotel Name",
                  },
                  {
                    value: location,
                    set: setLocation,
                    error: errors.location,
                    placeholder: "Location",
                  },
                  {
                    value: contact,
                    set: setContact,
                    error: errors.contact,
                    placeholder: "Contact",
                  },
                ].map((f, i) => (
                  <div key={i}>
                    <input
                      value={f.value}
                      placeholder={f.placeholder}
                      onChange={(e) => {
                        f.set(e.target.value);
                        setErrors((p) => ({ ...p, [f.placeholder]: "" }));
                      }}
                      className={`w-full px-4 py-2 rounded border
                        bg-[var(--color-dark-800)]
                        text-[var(--color-dark-text-100)]
                        ${
                          f.error
                            ? "border-red-500"
                            : "border-[var(--color-dark-600)]"
                        }`}
                    />
                    {f.error && (
                      <p className="text-red-400 text-sm">{f.error}</p>
                    )}
                  </div>
                ))}

                <div className="space-y-2">
                <input
                  type="file"
                  id="hotelImages"
                  multiple
                  accept="image/*"
                  onChange={handleImagesChange}
                  className="hidden"
                />

                <label
                  htmlFor="hotelImages"
                  className="
                    inline-flex items-center gap-2
                    cursor-pointer
                    px-4 py-2
                    rounded-lg
                    text-white
                    bg-gray-700
                    bg-[var(--gray-700)]
                    hover:bg-[var(--gray-600)]
                    text-[var(--gray-50)]
                    transition
                  "
                >
                  📁 Upload Images
                </label>

                {images.length > 0 && (
                  <p className="text-sm text-[var(--gray-300)]">
                    {images.length} image(s) selected
                  </p>
                )}

                {errors.images && (
                  <p className="text-red-400 text-sm">
                    {errors.images}
                  </p>
                )}
              </div>


                <div className="flex gap-2 text-2xl">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className={
                        s <= rating
                          ? "text-[var(--color-dark-warning)]"
                          : "text-[var(--color-dark-text-300)]"
                      }
                    >
                      ★
                    </button>
                  ))}
                </div>
                {errors.rating && (
                  <p className="text-red-400 text-sm">{errors.rating}</p>
                )}

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={resetForm} 
                    className="text-[var(--color-dark-text-100)]">
                    Cancel
                  </button>
                  <button
                    className="bg-[var(--color-dark-primary)]
                              text-[var(--color-dark-text-100)]
                              px-4 py-2 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}