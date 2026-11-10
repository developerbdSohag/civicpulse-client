'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export type ButterflyState = 'flying' | 'resting' | 'success' | 'failed';

interface ButterflyLoginFormAnimationProps {
  state: ButterflyState;
  onReset?: () => void;
}

interface ButterflyConfig {
  id: string;
  name: string;
  colorTheme: 'emerald' | 'amber' | 'cyan';
  restPosition: {
    left: string;
    top: string;
    rotation: string;
  };
  flyPath: string; // keyframe name for success
  wingsGradient: {
    start: string;
    mid: string;
    end: string;
    accent: string;
  };
}

const BUTTERFLIES: ButterflyConfig[] = [
  {
    id: 'emerald-swallowtail',
    name: 'Emerald Swallowtail',
    colorTheme: 'emerald',
    restPosition: {
      left: '16%',
      top: '-18px',
      rotation: '-12deg',
    },
    flyPath: 'butterflyFlyAway1',
    wingsGradient: {
      start: '#34d399',
      mid: '#10b981',
      end: '#064e3b',
      accent: '#a7f3d0',
    },
  },
  {
    id: 'monarch-gold',
    name: 'Monarch Gold',
    colorTheme: 'amber',
    restPosition: {
      left: '80%',
      top: '-20px',
      rotation: '15deg',
    },
    flyPath: 'butterflyFlyAway2',
    wingsGradient: {
      start: '#fef08a',
      mid: '#f59e0b',
      end: '#9a3412',
      accent: '#fed7aa',
    },
  },
  {
    id: 'sapphire-azure',
    name: 'Sapphire Azure',
    colorTheme: 'cyan',
    restPosition: {
      left: '48%',
      top: '-28px',
      rotation: '2deg',
    },
    flyPath: 'butterflyFlyAway3',
    wingsGradient: {
      start: '#a5f3fc',
      mid: '#06b6d4',
      end: '#0e7490',
      accent: '#cffafe',
    },
  },
];

export default function ButterflyLoginFormAnimation({
  state,
  onReset,
}: ButterflyLoginFormAnimationProps) {
  // Local animation mode: starts flying around, then settles on top edge
  const [internalMode, setInternalMode] = useState<'initial-flight' | 'settled'>('initial-flight');
  const [isHovered, setIsHovered] = useState(false);

  // Initial flight sequence: fly around the box for 2.6s, then land on top edge
  useEffect(() => {
    const timer = setTimeout(() => {
      setInternalMode('settled');
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  // When state is 'failed', auto-respawn after 2.6 seconds so user can try again
  useEffect(() => {
    if (state === 'failed') {
      const timer = setTimeout(() => {
        if (onReset) onReset();
      }, 2600);
      return () => clearTimeout(timer);
    }
  }, [state, onReset]);

  // Determine current active animation state
  const isSuccess = state === 'success';
  const isFailed = state === 'failed';
  const isFlying =
    (state === 'flying' || internalMode === 'initial-flight' || isHovered) &&
    !isSuccess &&
    !isFailed;
  const isResting =
    (state === 'resting' || internalMode === 'settled') &&
    !isFlying &&
    !isSuccess &&
    !isFailed;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-30 overflow-visible"
      style={{ perspective: '800px' }}
      aria-hidden="true"
    >
      {BUTTERFLIES.map((bf, idx) => {
        // Dynamic positioning & styling based on state
        let containerStyle: React.CSSProperties = {
          position: 'absolute',
          left: bf.restPosition.left,
          top: bf.restPosition.top,
          transform: `rotate(${bf.restPosition.rotation})`,
          transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease',
          pointerEvents: 'auto',
          cursor: 'pointer',
        };

        let containerAnimationClass = '';

        if (isFlying) {
          // Flight mode: floating around smoothly before landing
          containerAnimationClass = 'animate-float-gentle';
          containerStyle.transform = `translate(${idx === 0 ? '-30px' : idx === 1 ? '30px' : '0px'}, ${
            idx === 2 ? '-40px' : '-20px'
          }) rotate(${idx === 0 ? '-22deg' : idx === 1 ? '24deg' : '6deg'}) scale(1.05)`;
        } else if (isResting) {
          // Resting mode: settled gently on the top edge of the card
          containerStyle.transform = `translate(0, 0) rotate(${bf.restPosition.rotation}) scale(1)`;
        } else if (isSuccess) {
          // Success: fly away off-screen gracefully!
          containerStyle.animation = `${bf.flyPath} 2.2s cubic-bezier(0.25, 1, 0.5, 1) forwards`;
          containerStyle.pointerEvents = 'none';
        } else if (isFailed) {
          // Failed: immediately vanish / dissolve!
          containerStyle.animation = 'butterflyDissolve 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards';
          containerStyle.pointerEvents = 'none';
        }

        return (
          <div
            key={bf.id}
            style={containerStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              // Flutter playfully on click
              setIsHovered(true);
              setTimeout(() => setIsHovered(false), 1200);
            }}
            title={`${bf.name} (Resting on top edge)`}
            className={`group select-none ${containerAnimationClass}`}
          >
            {/* 3D Butterfly Render Container */}
            <div
              className="relative w-12 h-10 flex items-center justify-center filter drop-shadow(0 4px 6px rgba(0,0,0,0.35))"
              style={{
                perspective: '350px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* LEFT WINGS (Forewing & Hindwing) */}
              <div
                className="absolute right-1/2 top-0 origin-right"
                style={{
                  transformStyle: 'preserve-3d',
                  animation:
                    isSuccess || isFlying
                      ? 'butterflyFlapLeft 0.16s ease-in-out infinite alternate'
                      : 'butterflyRestLeft 3.6s ease-in-out infinite',
                }}
              >
                <svg
                  width="26"
                  height="34"
                  viewBox="0 0 26 34"
                  fill="none"
                  className="overflow-visible"
                >
                  <defs>
                    <linearGradient id={`grad-left-${bf.id}`} x1="100%" y1="50%" x2="0%" y2="50%">
                      <stop offset="0%" stopColor={bf.wingsGradient.end} />
                      <stop offset="45%" stopColor={bf.wingsGradient.mid} />
                      <stop offset="85%" stopColor={bf.wingsGradient.start} />
                      <stop offset="100%" stopColor={bf.wingsGradient.accent} />
                    </linearGradient>
                  </defs>

                  {/* Forewing */}
                  <path
                    d="M 24 16 C 20 6, 8 1, 2 3 C -1 5, 1 14, 10 19 C 16 22, 22 19, 24 16 Z"
                    fill={`url(#grad-left-${bf.id})`}
                    stroke="#0f172a"
                    strokeWidth="1.2"
                  />
                  {/* Wing Vein Details */}
                  <path
                    d="M 23 16 Q 14 10 5 6"
                    stroke="rgba(15, 23, 42, 0.45)"
                    strokeWidth="0.8"
                    fill="none"
                  />
                  <path
                    d="M 20 17 Q 12 14 6 12"
                    stroke="rgba(15, 23, 42, 0.35)"
                    strokeWidth="0.6"
                    fill="none"
                  />
                  {/* Glowing Margin Dots */}
                  <circle cx="4" cy="5" r="0.9" fill="#ffffff" opacity="0.9" />
                  <circle cx="8" cy="3" r="0.8" fill="#ffffff" opacity="0.9" />
                  <circle cx="13" cy="4" r="0.8" fill="#ffffff" opacity="0.9" />

                  {/* Hindwing with Swallowtail Tail */}
                  <path
                    d="M 24 17 C 20 20, 12 21, 6 25 C 2 28, 4 33, 9 32 C 12 31, 14 34, 15 33 C 18 31, 22 25, 24 17 Z"
                    fill={`url(#grad-left-${bf.id})`}
                    stroke="#0f172a"
                    strokeWidth="1.1"
                  />
                  <circle cx="8" cy="30" r="0.9" fill="#ffffff" opacity="0.85" />
                </svg>
              </div>

              {/* RIGHT WINGS (Forewing & Hindwing) */}
              <div
                className="absolute left-1/2 top-0 origin-left"
                style={{
                  transformStyle: 'preserve-3d',
                  animation:
                    isSuccess || isFlying
                      ? 'butterflyFlapRight 0.16s ease-in-out infinite alternate'
                      : 'butterflyRestRight 3.6s ease-in-out infinite',
                }}
              >
                <svg
                  width="26"
                  height="34"
                  viewBox="0 0 26 34"
                  fill="none"
                  className="overflow-visible"
                >
                  <defs>
                    <linearGradient id={`grad-right-${bf.id}`} x1="0%" y1="50%" x2="100%" y2="50%">
                      <stop offset="0%" stopColor={bf.wingsGradient.end} />
                      <stop offset="45%" stopColor={bf.wingsGradient.mid} />
                      <stop offset="85%" stopColor={bf.wingsGradient.start} />
                      <stop offset="100%" stopColor={bf.wingsGradient.accent} />
                    </linearGradient>
                  </defs>

                  {/* Forewing */}
                  <path
                    d="M 2 16 C 6 6, 18 1, 24 3 C 27 5, 25 14, 16 19 C 10 22, 4 19, 2 16 Z"
                    fill={`url(#grad-right-${bf.id})`}
                    stroke="#0f172a"
                    strokeWidth="1.2"
                  />
                  {/* Wing Vein Details */}
                  <path
                    d="M 3 16 Q 12 10 21 6"
                    stroke="rgba(15, 23, 42, 0.45)"
                    strokeWidth="0.8"
                    fill="none"
                  />
                  <path
                    d="M 6 17 Q 14 14 20 12"
                    stroke="rgba(15, 23, 42, 0.35)"
                    strokeWidth="0.6"
                    fill="none"
                  />
                  {/* Glowing Margin Dots */}
                  <circle cx="22" cy="5" r="0.9" fill="#ffffff" opacity="0.9" />
                  <circle cx="18" cy="3" r="0.8" fill="#ffffff" opacity="0.9" />
                  <circle cx="13" cy="4" r="0.8" fill="#ffffff" opacity="0.9" />

                  {/* Hindwing with Swallowtail Tail */}
                  <path
                    d="M 2 17 C 6 20, 14 21, 20 25 C 24 28, 22 33, 17 32 C 14 31, 12 34, 11 33 C 8 31, 4 25, 2 17 Z"
                    fill={`url(#grad-right-${bf.id})`}
                    stroke="#0f172a"
                    strokeWidth="1.1"
                  />
                  <circle cx="18" cy="30" r="0.9" fill="#ffffff" opacity="0.85" />
                </svg>
              </div>

              {/* SLENDER BODY & CURVED ANTENNAE (Center axis) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                <svg width="14" height="34" viewBox="0 0 14 34" fill="none">
                  {/* Antennae */}
                  <path
                    d="M 7 9 Q 3 2 1 1 M 7 9 Q 11 2 13 1"
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="1" cy="1" r="0.75" fill="#f59e0b" />
                  <circle cx="13" cy="1" r="0.75" fill="#f59e0b" />

                  {/* Head */}
                  <circle cx="7" cy="11" r="1.8" fill="#0f172a" />
                  <circle cx="6.5" cy="10.8" r="0.5" fill="#ffffff" opacity="0.8" />

                  {/* Thorax & Abdomen */}
                  <ellipse cx="7" cy="16" rx="1.6" ry="3.5" fill="#1e293b" />
                  <ellipse cx="7" cy="23" rx="1.3" ry="4.5" fill="#0f172a" />
                  {/* Subtle golden rings on abdomen */}
                  <line x1="6" y1="21" x2="8" y2="21" stroke="#f59e0b" strokeWidth="0.5" opacity="0.7" />
                  <line x1="6" y1="23" x2="8" y2="23" stroke="#f59e0b" strokeWidth="0.5" opacity="0.7" />
                  <line x1="6" y1="25" x2="8" y2="25" stroke="#f59e0b" strokeWidth="0.5" opacity="0.7" />
                </svg>
              </div>

              {/* Resting Leg Contact Shadow on Top Edge */}
              {isResting && (
                <div
                  className="absolute bottom-1 w-6 h-1 rounded-full bg-black/40 blur-[1.5px] pointer-events-none"
                  style={{ transform: 'translateY(16px)' }}
                />
              )}
            </div>

            {/* Success Sparkle Particle Trail */}
            {isSuccess && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 animate-pulse pointer-events-none">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
            )}

            {/* Failed Dissolve Dust Poof */}
            {isFailed && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-8 h-8 rounded-full bg-red-500/30 blur-md animate-ping" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
