// components/UI/ProfileImage.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';

interface ProfileImageProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackToInitials?: boolean;
}

const sizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

export default function ProfileImage({
  src, 
  alt, 
  size = 'lg', 
  className = '', 
  fallbackToInitials = true 
}: ProfileImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getInitials = () => {
    if (!alt) return '?';
    return alt
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getColorClass = () => {
    if (!alt) return 'bg-blue-600';
    const colors = [
      'bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-red-600',
      'bg-yellow-600', 'bg-pink-600', 'bg-indigo-600', 'bg-teal-600'
    ];
    const hash = alt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length]; // Fixed: changed & to %
  };

  // If no src or image failed to load
  if (!src || imageError) {
    if (fallbackToInitials) {
      return (
        <div 
          className={`${sizeClasses[size]} ${getColorClass()} rounded-full flex items-center justify-center ${className}`}
        >
          <span className="text-white font-bold">
            {size === 'sm' ? getInitials().slice(0, 1) : getInitials()}
          </span>
        </div>
      );
    }
    
    return (
      <div 
        className={`${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center ${className}`}
      >
        <User className="w-1/2 h-1/2 text-gray-400 dark:text-gray-500" />
      </div>
    );
  }

  // Try to use Next.js Image for optimization
  return (
    <div className={`${sizeClasses[size]} relative rounded-full overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={`${size === 'sm' ? '48px' : size === 'md' ? '64px' : size === 'lg' ? '96px' : '128px'}`}
        onError={() => setImageError(true)}
        onLoad={() => setImageLoaded(true)}
        priority={size === 'lg' || size === 'xl'}
      />
      {/* Loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
    </div>
  );
}