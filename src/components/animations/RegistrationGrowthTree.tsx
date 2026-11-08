'use client';

import React from 'react';
import { Sparkles, CheckCircle2, Trees, Sun } from 'lucide-react';

interface RegistrationGrowthTreeProps {
  step: 1 | 2;
  isCompleted?: boolean;
}

export default function RegistrationGrowthTree({
  step,
  isCompleted = false,
}: RegistrationGrowthTreeProps) {
  return (
    <div className="relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 text-white overflow-hidden space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
            <Trees className="w-4 h-4 text-emerald-200" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              {isCompleted
                ? 'Tree of Action Fully Blossomed'
                : step === 1
                ? 'Step 1: Planting Your Civic Seed'
                : 'Step 2: Sprouting Community Roots'}
            </p>
            <p className="text-[11px] text-white/80">
              {isCompleted
                ? 'Your civic lantern is illuminated & fruit harvested!'
                : step === 1
                ? 'Fill details to nourish the seed in soil'
                : 'Choose causes to grow strong branches'}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/20 border border-white/30">
          {isCompleted ? '100% Grown ✨' : step === 1 ? '50% Sown' : '85% Sprouted'}
        </span>
      </div>

      {/* Dynamic Animated Tree & Lantern SVG */}
      <div className="relative w-full h-44 rounded-xl bg-black/20 border border-white/10 flex items-center justify-center overflow-hidden">
        {step === 1 && !isCompleted && (
          // Step 1: Seed in Soil
          <svg viewBox="0 0 320 180" className="w-full h-full">
            <path d="M 0 115 Q 160 108 320 115 L 320 180 L 0 180 Z" fill="#78350f" opacity="0.9" />
            <ellipse cx="160" cy="140" rx="14" ry="10" fill="#92400e" />
            <ellipse cx="160" cy="140" rx="10" ry="6" fill="#451a03" />
            <circle cx="158" cy="138" r="3" fill="#fde68a" />
            {/* Water droplets soaking seed */}
            <g className="animate-bounce" style={{ animationDuration: '1.6s' }}>
              <path d="M 160 50 Q 160 62 164 70 A 4 4 0 0 1 156 70 Q 160 62 160 50 Z" fill="#38bdf8" />
              <path d="M 120 40 Q 120 52 124 60 A 4 4 0 0 1 116 60 Q 120 52 120 40 Z" fill="#38bdf8" />
              <path d="M 200 45 Q 200 57 204 65 A 4 4 0 0 1 196 65 Q 200 57 200 45 Z" fill="#38bdf8" />
            </g>
            {/* Tiny sprouting root */}
            <path d="M 160 132 Q 160 112 158 102" stroke="#34d399" strokeWidth="2.5" strokeDasharray="3 2" />
          </svg>
        )}

        {step === 2 && !isCompleted && (
          // Step 2: Sprouting Trunk & Branching Leaves
          <svg viewBox="0 0 320 180" className="w-full h-full">
            <path d="M 0 125 Q 160 120 320 125 L 320 180 L 0 180 Z" fill="#78350f" opacity="0.9" />
            {/* Sprout Trunk */}
            <path d="M 160 130 Q 159 85 160 55" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
            {/* Branches and Leaves */}
            <path d="M 160 85 Q 135 70 120 80 Q 130 95 158 90" fill="#34d399" stroke="#059669" strokeWidth="1.5" />
            <path d="M 160 75 Q 185 60 200 70 Q 190 85 162 80" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
            <circle cx="160" cy="50" r="14" fill="#34d399" />
            {/* Gentle breeze animation */}
            <g className="animate-pulse">
              <text x="210" y="45" fontSize="16">✨</text>
              <text x="95" y="60" fontSize="16">🌿</text>
            </g>
          </svg>
        )}

        {isCompleted && (
          // Step 3 / Completed: Full Tree with Blossoms + Glowing Lantern Light
          <svg viewBox="0 0 320 180" className="w-full h-full">
            <path d="M 0 135 Q 160 130 320 135 L 320 180 L 0 180 Z" fill="#78350f" opacity="0.9" />
            {/* Mature Trunk */}
            <path d="M 156 140 Q 159 85 160 50" stroke="#713f12" strokeWidth="14" strokeLinecap="round" />
            {/* Full Canopy */}
            <g className="animate-tree-sway">
              <circle cx="120" cy="50" r="34" fill="#10b981" opacity="0.9" />
              <circle cx="200" cy="45" r="36" fill="#047857" opacity="0.9" />
              <circle cx="160" cy="30" r="42" fill="#059669" />
              {/* Glowing Golden Fruits */}
              <circle cx="130" cy="45" r="7" fill="#ef4444" stroke="#fef08a" strokeWidth="1.5" />
              <circle cx="190" cy="40" r="7" fill="#f59e0b" stroke="#fef08a" strokeWidth="1.5" />
              <circle cx="160" cy="22" r="7" fill="#ef4444" stroke="#fef08a" strokeWidth="1.5" />
            </g>
            {/* Hanging Lantern with Radiant Glow */}
            <g className="animate-fruit-glow">
              <line x1="185" y1="48" x2="185" y2="70" stroke="#b45309" strokeWidth="2" />
              <rect x="177" y="70" width="16" height="22" rx="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="185" cy="81" r="14" fill="#fef08a" opacity="0.5" filter="blur(3px)" />
              <circle cx="185" cy="81" r="5" fill="#ffffff" />
            </g>
            <text x="160" y="165" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#fde047">
              Light is Open &amp; Tree is Grown!
            </text>
          </svg>
        )}
      </div>

      {/* Step Pills */}
      <div className="grid grid-cols-2 gap-2 text-center text-xs font-semibold">
        <div
          className={`py-1.5 px-2 rounded-xl transition-all ${
            step >= 1
              ? 'bg-white/25 text-white font-bold border border-white/30'
              : 'bg-black/20 text-white/50'
          }`}
        >
          1. Seed Sown
        </div>
        <div
          className={`py-1.5 px-2 rounded-xl transition-all ${
            step >= 2
              ? 'bg-white/25 text-white font-bold border border-white/30'
              : 'bg-black/20 text-white/50'
          }`}
        >
          2. Tree &amp; Light Open
        </div>
      </div>
    </div>
  );
}
