"use client";

import React, { useEffect, useState } from "react";

/* ===================== TYPES ===================== */
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

/* ================= IMAGE SLIDER ================== */
function ImageSlider({ images }: { images: File[] }) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="relative">
      <img
        src={URL.createObjectURL(images[index])}
        className="w-full h-48 object-cover rounded-xl"
        alt="Hotel"
      />

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 rounded"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 rounded"
      >
        ›
      </button>
    </div>
  );
}

/* ================= MAIN PAGE ===================== */
export default function Hotel() {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [hotelName, setHotelName] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState<File[]>([]);

  /* ============ LOAD FROM LOCAL STORAGE (NO IMAGES) ============ */
  useEffect(() => {
    const stored = localStorage.getItem("hotels");
    if (!stored) return;

    const parsed: StoredHotel[] = JSON.parse(stored);

    // restore hotels WITHOUT images
    setHotels(
      parsed.map((h) => ({
        ...h,
        images: [],
      }))
    );
  }, []);

  /* ============ SAVE ONLY TEXT DATA ============ */
  const saveToLocalStorage = (data: HotelData[]) => {
    const withoutImages: StoredHotel[] = data.map(
      ({ images, ...rest }) => rest
    );
    localStorage.setItem("hotels", JSON.stringify(withoutImages));
  };

  /* ============ IMAGE HANDLER ============ */
  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    if (files.length < 5) {
      alert("Upload at least 5 images");
      return;
    }
    setImages(files);
  };

  /* ============ SUBMIT ============ */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let updatedHotels: HotelData[];

    if (editId) {
      updatedHotels = hotels.map((h) =>
        h.id === editId
          ? { ...h, hotelName, location, contact, rating, images }
          : h
      );
    } else {
      updatedHotels = [
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
    }

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

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
          <h1 className="text-2xl font-bold">Hotels</h1>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Add Hotel
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-2xl p-4">
            {hotel.images.length > 0 && (
              <ImageSlider images={hotel.images} />
            )}

            <h3 className="mt-3 text-lg font-bold">{hotel.hotelName}</h3>
            <p className="text-sm text-gray-500">{hotel.location}</p>
            <p className="text-sm">📞 {hotel.contact}</p>

            <div className="text-yellow-400">
              {"★".repeat(hotel.rating)}
              {"☆".repeat(5 - hotel.rating)}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleEdit(hotel)}
                className="flex-1 border rounded-lg py-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(hotel.id)}
                className="flex-1 bg-red-600 text-white rounded-lg py-2"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">
              {editId ? "Update Hotel" : "Add Hotel"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Hotel Name"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                required
                className="w-full border px-4 py-2 rounded"
              />
              <input
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full border px-4 py-2 rounded"
              />
              <input
                placeholder="Contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                className="w-full border px-4 py-2 rounded"
              />

              <input type="file" multiple accept="image/*" onChange={handleImagesChange} />

              <div className="flex gap-2 text-2xl">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setRating(s)}
                    className={s <= rating ? "text-yellow-400" : "text-gray-400"}
                  >
                    ★
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
                <button className="bg-black text-white px-4 py-2 rounded">
                  {editId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
