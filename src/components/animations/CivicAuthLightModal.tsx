'use client';

import React from 'react';
import { Sparkles, Moon, Sun, HeartHandshake } from 'lucide-react';

interface CivicAuthLightModalProps {
  isOpen: boolean;
  mode: 'login' | 'logout';
  userName?: string;
}

export default function CivicAuthLightModal({
  isOpen,
  mode,
  userName = 'Volunteer',
}: CivicAuthLightModalProps) {
  if (!isOpen) return null;

  const isLogout = mode === 'logout';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-8 border border-slate-800 text-center shadow-2xl overflow-hidden space-y-6">
        
        {/* Subtle Background Glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-all duration-1000 ${
            isLogout
              ? 'bg-amber-600/10'
              : 'bg-emerald-500/25'
          }`}
        />

        {/* Animated Lantern Artwork */}
        <div className="relative w-36 h-48 mx-auto flex items-center justify-center">
          <svg viewBox="0 0 160 200" className="w-full h-full">
            {/* Top hanging ring & cap */}
            <circle cx="80" cy="22" r="14" fill="none" stroke="#d97706" strokeWidth="4" />
            <path d="M 50 38 L 110 38 L 100 50 L 60 50 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
            <path d="M 40 50 L 120 50 L 115 65 L 45 65 Z" fill="#92400e" stroke="#78350f" strokeWidth="2" />

            {/* Glass Chamber */}
            <rect x="46" y="65" width="68" height="90" rx="8" fill="#1e293b" opacity="0.6" stroke="#b45309" strokeWidth="3" />
            
            {/* Brass Struts */}
            <line x1="56" y1="65" x2="56" y2="155" stroke="#78350f" strokeWidth="2" />
            <line x1="80" y1="65" x2="80" y2="155" stroke="#78350f" strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1="104" y1="65" x2="104" y2="155" stroke="#78350f" strokeWidth="2" />

            {/* Lantern Base */}
            <path d="M 40 155 L 120 155 L 125 175 L 35 175 Z" fill="#92400e" stroke="#78350f" strokeWidth="2" />
            <rect x="30" y="175" width="100" height="12" rx="4" fill="#b45309" />

            {/* Animated Flame / Light Core */}
            {isLogout ? (
              // Logout: Flame dims out (The light will be out)
              <g className="animate-light-dim">
                <circle cx="80" cy="115" r="32" fill="#f59e0b" opacity="0.3" filter="blur(6px)" />
                <path
                  d="M 80 85 Q 92 108 90 120 A 10 10 0 0 1 70 120 Q 68 108 80 85 Z"
                  fill="url(#logoutFlameGradient)"
                  className="animate-lantern-flame"
                />
              </g>
            ) : (
              // Login: Radiant Light ignites
              <g className="animate-light-ignite">
                <circle cx="80" cy="115" r="45" fill="#34d399" opacity="0.4" filter="blur(8px)" />
                <circle cx="80" cy="115" r="28" fill="#10b981" opacity="0.6" filter="blur(4px)" />
                <path
                  d="M 80 80 Q 94 105 92 120 A 12 12 0 0 1 68 120 Q 66 105 80 80 Z"
                  fill="url(#loginFlameGradient)"
                  className="animate-lantern-flame"
                />
                {/* Shining rays */}
                <line x1="80" y1="68" x2="80" y2="55" stroke="#6ee7b7" strokeWidth="3" strokeLinecap="round" />
                <line x1="100" y1="80" x2="115" y2="70" stroke="#6ee7b7" strokeWidth="3" strokeLinecap="round" />
                <line x1="60" y1="80" x2="45" y2="70" stroke="#6ee7b7" strokeWidth="3" strokeLinecap="round" />
              </g>
            )}

            {/* Gradients */}
            <defs>
              <linearGradient id="logoutFlameGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="loginFlameGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#6ee7b7" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Messaging */}
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
            {isLogout ? (
              <>
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span>Extinguishing Civic Light</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-emerald-400" />
                <span>Illuminating Community Presence</span>
              </>
            )}
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            {isLogout ? (
              <span>The Light Will Be Out</span>
            ) : (
              <span>Welcome Back, {userName}!</span>
            )}
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm mx-auto">
            {isLogout ? (
              <span>
                Thank you for your service and compassion today. Your civic light rests until you return.
              </span>
            ) : (
              <span>
                Your civic lantern has ignited. Ready to lead drives and support neighbors across Bangladesh.
              </span>
            )}
          </p>
        </div>

        {/* Animated Progress Indicator Bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full animate-pulse transition-all duration-1500 ${
              isLogout
                ? 'w-full bg-gradient-to-r from-amber-600 via-amber-400 to-slate-700'
                : 'w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
