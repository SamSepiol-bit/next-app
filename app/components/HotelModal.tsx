"use client";

import React from "react";

interface HotelModalProps {
  isOpen: boolean;
  onClose: () => void;
  editId: number | null;
  hotelName: string;
  setHotelName: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  contact: string;
  setContact: (value: string) => void;
  price: number;
  setPrice: (value: number) => void;
  rating: number;
  setRating: (value: number) => void;
  images: File[];
  setImages: (files: File[]) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function HotelModal({
  isOpen,
  onClose,
  editId,
  hotelName,
  setHotelName,
  location,
  setLocation,
  contact,
  setContact,
  price,
  setPrice,
  rating,
  setRating,
  images,
  setImages,
  errors,
  setErrors,
  onSubmit,
}: HotelModalProps) {
  if (!isOpen) return null;

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (files.length < 5) {
      setErrors({ ...errors, images: "Upload at least 5 images" });
      return;
    }
    setImages(files);
    setErrors({ ...errors, images: "" });
  };

  const formFields = [
    { value: hotelName, set: setHotelName, error: errors.hotelName, placeholder: "Hotel Name" },
    { value: location, set: setLocation, error: errors.location, placeholder: "Location" },
    { value: contact, set: setContact, error: errors.contact, placeholder: "Contact" },
  ];

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center">
      <div className="bg-[var(--color-dark-700)] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h1 className="text-3xl font-bold text-white mb-5 text-center">
          {editId ? "Edit Hotel" : "Add New Hotel"}
        </h1>
        <form onSubmit={onSubmit} className="space-y-3">
          {formFields.map((f, i) => (
            <div key={i}>
              <input
                value={f.value}
                placeholder={f.placeholder}
                onChange={(e) => {
                  f.set(e.target.value);
                  setErrors({ ...errors, [f.placeholder.toLowerCase().replace(' ', '')]: "" });
                }}
                className={`w-full px-4 py-2 rounded border bg-[var(--color-dark-800)] text-white ${
                  f.error ? "border-red-500" : "border-[var(--color-dark-600)]"
                }`}
              />
              {f.error && <p className="text-red-400 text-sm">{f.error}</p>}
            </div>
          ))}

          <input
            type="number"
            value={price}
            placeholder="Price per night (Rs)"
            onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2 rounded border bg-[var(--color-dark-800)] text-white border-[var(--color-dark-600)]"
          />

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
              className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg text-white bg-[var(--gray-700)] hover:bg-[var(--gray-600)] transition"
            >
              📁 Upload Images (Min 5)
            </label>
            {images.length > 0 && (
              <p className="text-sm text-[var(--gray-300)]">{images.length} image(s) selected</p>
            )}
            {errors.images && <p className="text-red-400 text-sm">{errors.images}</p>}
          </div>

          <div className="flex gap-2 text-2xl">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className={s <= rating ? "text-[var(--color-dark-warning)]" : "text-[var(--color-dark-text-300)]"}
              >
                ★
              </button>
            ))}
          </div>
          {errors.rating && <p className="text-red-400 text-sm">{errors.rating}</p>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-white hover:bg-[var(--color-dark-600)] rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-[var(--color-dark-primary)] text-white rounded-lg hover:opacity-90">
              {editId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}