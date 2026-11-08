'use client';

import React, { useState, useEffect } from 'react';
import { X, Play, RotateCcw, Sparkles, Trees, Droplets, Sun, Wind, Heart, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TreeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExplorePlantations?: () => void;
}

export type TreeStage = 1 | 2 | 3 | 4 | 5;

const STAGES = [
  { stage: 1, label: 'Seed in Soil', icon: '🌱', desc: 'Planting local indigenous fruit & shade saplings into fertile soil' },
  { stage: 2, label: 'Sprout', icon: '🌿', desc: 'First roots take hold; tender shoot breaks through the ground' },
  { stage: 3, label: 'Sapling', icon: '🪴', desc: 'Wooden stem thickens, absorbing rain & urban sunlight' },
  { stage: 4, label: 'Flourishing Canopy', icon: '🌳', desc: 'Lush green foliage spreads, purifying air & providing shade' },
  { stage: 5, label: 'Bountiful Harvest', icon: '🍎', desc: 'Blooms & sweet fruits for local communities and wildlife' },
];

export default function TreePlantationGrowthModal({
  isOpen,
  onClose,
  onExplorePlantations,
}: TreeModalProps) {
  const [currentStage, setCurrentStage] = useState<TreeStage>(1);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto-progress stages when modal is open and playing
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= 5) {
          try {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#10b981', '#059669', '#34d399', '#f59e0b'],
            });
          } catch (_) {}
          setIsPlaying(false);
          return 5;
        }
        return (prev + 1) as TreeStage;
      });
    }, 2200);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  const handleRestart = () => {
    setCurrentStage(1);
    setIsPlaying(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0b1320] border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-emerald-50/50 dark:bg-emerald-950/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Tree Plantation: Seed to Harvest</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  Interactive Impact
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Witness the lifecycle of a community-planted tree in Bangladesh
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Animation Stage Canvas */}
        <div className="relative h-72 sm:h-80 w-full overflow-hidden flex items-end justify-center bg-gradient-to-b from-sky-100 via-emerald-50/40 to-emerald-100/60 dark:from-[#0a1829] dark:via-[#091f24] dark:to-[#07241d] p-6 select-none">
          
          {/* Ambient Sun & Sky Elements */}
          <div className="absolute top-4 left-6 flex items-center gap-2 text-amber-500 dark:text-amber-400 animate-pulse">
            <Sun className="w-8 h-8 drop-shadow-md" />
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-300 hidden sm:inline">
              Solar Energy: 100% Clean
            </span>
          </div>

          {/* Gentle Wind Cloud */}
          <div className="absolute top-6 right-8 flex items-center gap-1.5 text-emerald-600/70 dark:text-emerald-400/60 animate-bounce duration-1000">
            <Wind className="w-5 h-5" />
            <span className="text-[11px] font-medium hidden sm:inline">CO2 Absorption Active</span>
          </div>

          {/* Soil Ground */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#452714] to-[#6d3e1d] dark:from-[#1b1008] dark:to-[#2e1a0d] border-t-4 border-emerald-600/80 z-10 flex items-center justify-center">
            <div className="text-[11px] font-bold text-amber-200/90 tracking-wider uppercase flex items-center gap-1.5">
              <span>Fertile Soil of Bangladesh</span>
              <span>•</span>
              <span>pH 6.8 Verified</span>
            </div>
          </div>

          {/* =============================================================
              DYNAMIC SVG STAGE ANIMATIONS: 1 to 5
             ============================================================= */}
          <div className="relative z-20 flex flex-col items-center justify-end mb-14 w-full max-w-sm">

            {/* STAGE 1: Seed in Soil with Water Droplets */}
            {currentStage === 1 && (
              <div className="flex flex-col items-center animate-in zoom-in-75 duration-500">
                {/* Falling Water Droplets */}
                <div className="flex gap-4 mb-3 animate-bounce">
                  <Droplets className="w-5 h-5 text-sky-500 animate-pulse" />
                  <Droplets className="w-4 h-4 text-sky-400 animate-pulse delay-100" />
                </div>
                {/* Seed */}
                <div className="w-7 h-9 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-b from-amber-800 to-amber-950 border-2 border-amber-600 shadow-lg shadow-amber-950/40 relative">
                  <div className="absolute top-1 left-1.5 w-1.5 h-3 rounded-full bg-amber-400/40" />
                </div>
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 mt-2 bg-white/70 dark:bg-black/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Neem / Mahogany Seed Planted
                </span>
              </div>
            )}

            {/* STAGE 2: Sprout Breaking Ground */}
            {currentStage === 2 && (
              <div className="flex flex-col items-center animate-in slide-in-from-bottom duration-500">
                <svg width="80" height="90" viewBox="0 0 80 90" fill="none">
                  {/* Stem */}
                  <path d="M40 90 Q38 55 40 40" stroke="#059669" strokeWidth="5" strokeLinecap="round" />
                  {/* Left leaf */}
                  <path d="M40 45 C25 40 20 20 40 30" fill="#10b981" stroke="#047857" strokeWidth="2" />
                  {/* Right leaf */}
                  <path d="M40 40 C55 35 60 15 40 25" fill="#34d399" stroke="#047857" strokeWidth="2" />
                </svg>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 mt-1 bg-white/80 dark:bg-black/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Day 14: First Sprout Emerges
                </span>
              </div>
            )}

            {/* STAGE 3: Growing Sapling */}
            {currentStage === 3 && (
              <div className="flex flex-col items-center animate-in slide-in-from-bottom duration-600">
                <svg width="120" height="150" viewBox="0 0 120 150" fill="none">
                  {/* Trunk */}
                  <path d="M60 150 L60 70" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
                  {/* Left branch */}
                  <path d="M60 100 Q45 85 30 80" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
                  <ellipse cx="25" cy="75" rx="16" ry="10" fill="#10b981" />
                  {/* Right branch */}
                  <path d="M60 85 Q75 70 90 65" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
                  <ellipse cx="95" cy="60" rx="16" ry="10" fill="#059669" />
                  {/* Center top leaves */}
                  <circle cx="60" cy="55" r="22" fill="#34d399" />
                </svg>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-200 mt-1 bg-white/80 dark:bg-black/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  Month 3: Strong Sapling Rooted
                </span>
              </div>
            )}

            {/* STAGE 4: Full Lush Tree Canopy (Swaying with Wind) */}
            {currentStage === 4 && (
              <div className="flex flex-col items-center animate-in zoom-in-90 duration-700 animate-tree-sway">
                <svg width="220" height="210" viewBox="0 0 220 210" fill="none">
                  {/* Main Trunk */}
                  <path d="M110 210 Q105 150 110 110" stroke="#5c2e0b" strokeWidth="16" strokeLinecap="round" />
                  <path d="M110 140 Q80 120 60 105" stroke="#5c2e0b" strokeWidth="9" strokeLinecap="round" />
                  <path d="M110 130 Q140 115 160 95" stroke="#5c2e0b" strokeWidth="9" strokeLinecap="round" />
                  
                  {/* Canopy Foliage Clusters */}
                  <circle cx="110" cy="80" r="48" fill="#047857" />
                  <circle cx="80" cy="90" r="40" fill="#059669" />
                  <circle cx="140" cy="85" r="40" fill="#10b981" />
                  <circle cx="110" cy="55" r="38" fill="#34d399" />
                  <circle cx="75" cy="65" r="30" fill="#10b981" />
                  <circle cx="145" cy="65" r="30" fill="#059669" />
                </svg>
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-100 bg-white/80 dark:bg-black/70 px-3 py-1 rounded-full border border-emerald-500/40 shadow-xs">
                  Year 1: 48kg Annual CO2 Offset
                </span>
              </div>
            )}

            {/* STAGE 5: Bountiful Harvest with Fruit & Blossoms */}
            {currentStage === 5 && (
              <div className="flex flex-col items-center animate-in zoom-in duration-700 animate-tree-sway">
                <svg width="240" height="220" viewBox="0 0 240 220" fill="none">
                  {/* Trunk */}
                  <path d="M120 220 Q115 150 120 115" stroke="#5c2e0b" strokeWidth="18" strokeLinecap="round" />
                  <path d="M120 145 Q85 125 65 110" stroke="#5c2e0b" strokeWidth="10" strokeLinecap="round" />
                  <path d="M120 135 Q155 120 175 100" stroke="#5c2e0b" strokeWidth="10" strokeLinecap="round" />
                  
                  {/* Canopy */}
                  <circle cx="120" cy="85" r="52" fill="#047857" />
                  <circle cx="85" cy="95" r="44" fill="#059669" />
                  <circle cx="155" cy="90" r="44" fill="#10b981" />
                  <circle cx="120" cy="55" r="42" fill="#34d399" />
                  <circle cx="80" cy="68" r="34" fill="#10b981" />
                  <circle cx="160" cy="68" r="34" fill="#059669" />

                  {/* Golden & Red Fruits */}
                  <circle cx="95" cy="80" r="7" fill="#ef4444" className="animate-fruit-glow" />
                  <circle cx="145" cy="75" r="7" fill="#f59e0b" className="animate-fruit-glow" />
                  <circle cx="120" cy="60" r="8" fill="#ef4444" className="animate-fruit-glow" />
                  <circle cx="75" cy="105" r="6.5" fill="#f59e0b" className="animate-fruit-glow" />
                  <circle cx="160" cy="105" r="7" fill="#ef4444" className="animate-fruit-glow" />
                  <circle cx="130" cy="100" r="6" fill="#f59e0b" className="animate-fruit-glow" />
                </svg>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold shadow-md mt-1 animate-bounce">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Harvest Ready: Feeds & Shields Community</span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Stage Timeline Stepper */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#070f1a] border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-5 gap-2">
            {STAGES.map((s) => {
              const isActive = s.stage === currentStage;
              const isPast = s.stage < currentStage;

              return (
                <button
                  key={s.stage}
                  onClick={() => {
                    setCurrentStage(s.stage as TreeStage);
                    setIsPlaying(false);
                  }}
                  className={`p-2.5 rounded-2xl flex flex-col items-center gap-1 text-center transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : isPast
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-[11px] font-bold truncate w-full">{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Description of current stage */}
          <div className="mt-4 p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <span className="font-medium">
              <strong className="text-emerald-700 dark:text-emerald-400">Stage {currentStage}:</strong>{' '}
              {STAGES[currentStage - 1].desc}
            </span>
            <span className="text-[11px] text-slate-400 shrink-0 ml-2">
              {currentStage}/5
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Plant from Seed</span>
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isPlaying ? 'Pause Growth' : 'Auto Play'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onExplorePlantations && (
              <button
                onClick={() => {
                  onClose();
                  onExplorePlantations();
                }}
                className="btn-magnetic btn-steel-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>Join Tree Plantation Drives</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
