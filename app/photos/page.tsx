"use client";

import { useState, useEffect } from "react";
import { APP_URL } from "../config/constant";

interface Photo {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export default function Photos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(APP_URL + "photos", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) {
            console.log('Responce Error : ', response.status);
            return;
        }

        const responseJson: Photo[] =await response.json();
        setPhotos(responseJson)
        
        
        // const data: Photo[] = await response.json();
        // setPhotos(data);
        // console.log(data);
        
      } catch (error) {
        console.error("Error Fetching Data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, []);

  return (
    <div>
      <main className="min-h-screen bg-gray-100 dark:bg-slate-950 transition-colors">
        <header className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gallery
            </h1>
          </div>
        </header>

        <section className="max-w-6xl mx-auto px-6 py-10">
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Images Loading...
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-lg transition"
                >
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />

                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {photo.title}
                  </h2>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Album #{photo.albumId}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
