'use client';

import React, { useState, useEffect } from 'react';
import { User as UserIcon } from 'lucide-react';

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: number; // size in pixels (e.g. 36, 40, 48, 96)
  className?: string;
  style?: React.CSSProperties;
}

// Generate consistent gradient colors based on string
function getAvatarGradient(str: string): string {
  const gradients = [
    'from-emerald-500 to-teal-600',
    'from-blue-500 to-indigo-600',
    'from-purple-500 to-pink-600',
    'from-amber-500 to-orange-600',
    'from-rose-500 to-red-600',
    'from-cyan-500 to-blue-600',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function UserAvatar({
  src,
  name = 'User',
  size = 40,
  className = '',
  style,
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const initials = getInitials(name);
  const gradient = getAvatarGradient(name || 'User');

  useEffect(() => {
    setImageError(false);
  }, [src]);

  const hasValidSrc = src && typeof src === 'string' && src.trim() !== '' && !imageError;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0 select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        ...style,
      }}
    >
      {hasValidSrc ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover rounded-full"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <div
          className={`w-full h-full rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white font-bold shadow-inner`}
          style={{
            fontSize: `${Math.max(10, Math.floor(size * 0.38))}px`,
            lineHeight: 1,
          }}
        >
          {initials || <UserIcon className="w-1/2 h-1/2 text-white" />}
        </div>
      )}
    </div>
  );
}
