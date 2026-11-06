'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?auto=format&fit=crop&w=1200&q=80';

interface SafeImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
  priority?: boolean;
  onStatusChange?: (status: 'loading' | 'success' | 'error') => void;
}

export default function SafeImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  alt,
  fill = false,
  width,
  height,
  className = '',
  style,
  sizes,
  priority = false,
  onStatusChange,
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (src && src.trim() !== '') {
      setCurrentSrc(src);
      setHasError(false);
      setIsLoading(true);
      onStatusChange?.('loading');
    } else {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(false);
      onStatusChange?.('success');
    }
  }, [src, fallbackSrc, onStatusChange]);

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
      setIsLoading(false);
      onStatusChange?.('error');
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    if (!hasError) {
      onStatusChange?.('success');
    }
  };

  return (
    <div
      className={`relative overflow-hidden ${fill ? 'w-full h-full' : ''}`}
      style={style}
    >
      {/* Native img with no-referrer for maximum compatibility and resilience */}
      <img
        src={currentSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${
          fill ? 'w-full h-full object-cover' : ''
        } transition-opacity duration-300 ${isLoading ? 'opacity-70' : 'opacity-100'}`}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          objectFit: 'cover',
        }}
      />
    </div>
  );
}
