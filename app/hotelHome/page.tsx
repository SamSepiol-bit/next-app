"use client";

export default function HotelHomePage() {
  return (
    <main className="bg-[var(--color-light-bg-main)] text-[var(--color-light-text-100)]">
      {/* ================= HERO SECTION ================= */}
      <section
        className="relative h-[90vh] flex items-center justify-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1501117716987-c8e1ecb2102a?auto=format&fit=crop&w=1600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Experience Luxury & Comfort
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Discover world-class hospitality, breathtaking views, and unforgettable stays.
          </p>
          <button className="px-8 py-3 rounded-xl bg-[var(--color-primary-100)] text-white font-semibold hover:opacity-90 transition">
            Book Your Stay
          </button>
          
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="py-20 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80"
          alt="Hotel Interior"
          className="rounded-2xl shadow-lg"
        />
        <div>
          <h2 className="text-3xl font-bold mb-4">Welcome to Our Hotel</h2>
          <p className="text-[var(--color-light-text-200)] mb-6">
            Our hotel offers a perfect blend of elegance, comfort, and modern amenities.
            Whether you are traveling for business or leisure, we ensure a relaxing and
            memorable stay.
          </p>
          <ul className="space-y-3 text-[var(--color-light-text-200)]">
            <li>• Premium Rooms & Suites</li>
            <li>• Ocean & City Views</li>
            <li>• 24/7 Room Service</li>
            <li>• Free High-Speed Wi-Fi</li>
          </ul>
        </div>
      </section>

      {/* ================= ROOMS SECTION ================= */}
      <section className="py-20 bg-[var(--color-light-bg-surface)]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Rooms</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {["Deluxe Room", "Luxury Suite", "Family Room"].map((room, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src={
                    index === 0
                      ? "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80"
                      : index === 1
                      ? "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
                      : "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={room}
                  className="h-56 w-full object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{room}</h3>
                  <p className="text-[var(--color-light-text-200)] mb-4">
                    Spacious, elegant, and designed for your ultimate comfort.
                  </p>
                  <button className="text-[var(--color-primary-100)] font-semibold hover:underline">
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {["Spa & Wellness", "Fine Dining", "Swimming Pool", "Fitness Center"].map(
            (service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 text-center shadow hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="font-semibold text-lg mb-2">{service}</h3>
                <p className="text-[var(--color-light-text-200)] text-sm">
                  Premium services designed to make your stay exceptional.
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-20 bg-[var(--color-primary-100)] text-white text-center px-6">
        <h2 className="text-3xl font-bold mb-4">Ready to Book Your Stay?</h2>
        <p className="mb-8 text-white/90">
          Enjoy exclusive offers and unforgettable experiences.
        </p>
        <button className="px-10 py-3 rounded-xl bg-white text-[var(--color-primary-100)] font-semibold hover:opacity-90 transition">
          Reserve Now
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-10 text-center text-sm text-[var(--color-light-text-300)]">
        © {new Date().getFullYear()} Luxury Hotel. All rights reserved.
      </footer>
    </main>
  );
}
