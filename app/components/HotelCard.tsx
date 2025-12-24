"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";

interface HotelCardProps {
  hotel: {
    id: number;
    hotelName: string;
    location: string;
    contact: string;
    rating: number;
    price?: number;
    images: File[];
  };
  onEdit: (hotel: unknown) => void;
  onDelete: (id: number) => void;
}

/* IMAGE SLIDER COMPONENT */
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
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-[var(--color-dark-primary)] text-white px-2 rounded"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-[var(--color-dark-primary)] text-white px-2 rounded"
      >
        ›
      </button>
    </div>
  );
}

export default function HotelCard({ hotel, onEdit, onDelete }: HotelCardProps) {
  return (
    <div className="bg-[var(--color-dark-700)] border border-[var(--color-dark-600)] rounded-2xl p-4 hover:border-[var(--color-dark-primary)] hover:shadow-lg transition-all duration-300">
      {hotel.images.length > 0 && <ImageSlider images={hotel.images} />}

      <div className="flex justify-between items-start mt-3">
        <h3 className="font-bold text-white text-lg">{hotel.hotelName}</h3>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1 bg-[var(--color-dark-800)] px-2 py-1 rounded">
            <Star size={14} className="text-[var(--color-dark-warning)]" />
            <span className="text-sm font-bold text-white">{hotel.rating}</span>
          </div>
          {hotel.price && (
            <div className="text-green-400 font-bold">
              Rs.{hotel.price}
              <span className="text-[var(--color-dark-text-300)] text-sm"> Day/night</span>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-[var(--color-dark-text-200)] mt-1 flex items-center gap-1">
        <MapPin size={14} />
        {hotel.location}
      </p>

      <p className="text-sm text-[var(--color-dark-text-300)] mt-1">
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
          onClick={() => onEdit(hotel)}
          className="flex-1 border border-[var(--color-dark-primary)] text-[var(--color-dark-primary)] rounded-lg py-2 hover:bg-[var(--color-dark-primary)] hover:text-white transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(hotel.id)}
          className="flex-1 bg-[var(--color-dark-primary)] text-white rounded-lg py-2 hover:opacity-90 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}