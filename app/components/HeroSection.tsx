"use client";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  backgroundImage: string;
}

export default function HeroSection({
  title,
  subtitle,
  buttonText,
  backgroundImage,
}: HeroSectionProps) {
  return (
    <section
      className="relative flex h-[65vh] items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          {title}
        </h1>

        <p className="text-lg md:text-xl text-gray-200 mb-8">
          {subtitle}
        </p>

        <button className="px-8 py-3 rounded-xl bg-[var(--color-primary-100)] text-white font-semibold">
          {buttonText}
        </button>
      </div>
    </section>
  );
}
