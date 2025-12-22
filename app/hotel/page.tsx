"use client";

import { main } from "framer-motion/client";
import React, { useEffect, useState } from "react";
import HeroSection from "../components/HeroSection";

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
      <img
        src={URL.createObjectURL(images[index])}
        alt="Hotel"
        className="w-full h-48 object-cover rounded-xl"
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
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [hotelName, setHotelName] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /*LOAD */
  useEffect(() => {
    const stored = localStorage.getItem("hotels");
    if (!stored) return;

    const parsed: StoredHotel[] = JSON.parse(stored);
    setHotels(parsed.map((h) => ({ ...h, images: [] })));
  }, []);

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

    if (!/^[0-9]{10,15}$/.test(contact))
      newErrors.contact = "Contact must be 10–15 digits";

    if (rating < 1 || rating > 5)
      newErrors.rating = "Please select a rating";

    if (images.length < 5)
      newErrors.images = "Upload at least 5 images";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // const validateForm = () => {
  //   const newErrors: Record<string, string> = {};

  //   const isHotelNameValid = 
  //     hotelName.trim().length >= 3 && hotelName.trim().length <= 50;
  //       if(!isHotelNameValid) {
  //       newErrors.hotelName = "Hotel name must be at least 3 characters";
  //       }

  //       const isContactValid =
  //        /^[0-9]{10,15}$/.test(contact);
  //          if (!isContactValid) {
  //           newErrors.contact = "Contact must be 10–15 digits";
  //         }

  //         const isLocationValid = 
  //           location.trim().length > 0;
  //           if (!isLocationValid) {
  //             newErrors.location = "Location is Required";
  //           }

  //           const isRatingValid =
  //             rating >= 1 && rating <=5;
  //             if (!isRatingValid) {
  //               newErrors.rating = "Please select some rate"
  //             }

  //             const isImagesValid =
  //               images.length >= 5;
  //                 if (!isImagesValid) {
  //                   newErrors.images = "Upload at least 5 images";
  //                 }

  //                 setErrors(newErrors);
  //                   return Object.keys(newErrors).length === 0;
  //                 };

  // }

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
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
            <h1 className="text-2xl font-bold text-[var(--color-dark-text-100)]">
              Hotels
            </h1>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-[var(--color-dark-primary)]
                        text-[var(--color-dark-text-100)] rounded-lg"
            >
              Add Hotel
            </button>
          </div>
        </header>

        {/* GRID */}
        <div className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-[var(--color-dark-700)]
                        border border-[var(--color-dark-600)]
                        rounded-2xl p-4"
            >
              {hotel.images.length > 0 && <ImageSlider images={hotel.images} />}

              <h3 className="mt-3 font-bold text-[var(--color-dark-text-100)]">
                {hotel.hotelName}
              </h3>

              <p className="text-sm text-[var(--color-dark-text-200)]">
                {hotel.location}
              </p>

              <p className="text-sm text-[var(--color-dark-text-300)]">
                {hotel.contact}
              </p>

              <div className="text-[var(--color-dark-warning)]">
                {"★".repeat(hotel.rating)}
                <span className="text-[var(--color-dark-text-300)]">
                  {"☆".repeat(5 - hotel.rating)}
                </span>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleEdit(hotel)}
                  className="flex-1 border border-[var(--color-dark-primary)]
                            text-[var(--color-dark-primary)] rounded-lg py-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(hotel.id)}
                  className="flex-1 bg-[var(--color-dark-primary)]
                            text-[var(--color-dark-text-100)] rounded-lg py-2"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
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
