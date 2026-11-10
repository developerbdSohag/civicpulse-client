'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Heart,
  Trash2,
  Stethoscope,
  BookOpen,
  LifeBuoy,
  Trees,
  CheckCircle2,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export type CivicCategoryKey =
  | 'Plantation'
  | 'Donation'
  | 'Cleanup'
  | 'Healthcare'
  | 'Education'
  | 'Relief Aid';

export function mapEventTypeToCategory(eventType?: string): CivicCategoryKey {
  if (!eventType) return 'Plantation';
  const lower = eventType.toLowerCase();
  if (lower.includes('plant') || lower.includes('tree') || lower.includes('sapling')) return 'Plantation';
  if (lower.includes('donat') || lower.includes('cloth') || lower.includes('blanket') || lower.includes('winter')) return 'Donation';
  if (lower.includes('clean') || lower.includes('waste') || lower.includes('lake') || lower.includes('park')) return 'Cleanup';
  if (lower.includes('health') || lower.includes('medic') || lower.includes('doctor') || lower.includes('eye')) return 'Healthcare';
  if (lower.includes('educat') || lower.includes('school') || lower.includes('book') || lower.includes('literacy')) return 'Education';
  if (lower.includes('relief') || lower.includes('flood') || lower.includes('food') || lower.includes('aid')) return 'Relief Aid';
  return 'Donation';
}

export interface EventContextInfo {
  _id: string;
  title: string;
  location: string;
  eventDate: string;
  thumbnail?: string;
  eventType?: string;
}

interface CivicCategoryAnimationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: CivicCategoryKey;
  eventContext?: EventContextInfo | null;
  onExploreCategory?: (category: CivicCategoryKey) => void;
}

interface CategoryConfig {
  key: CivicCategoryKey;
  label: string;
  badge: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  accentGradient: string;
  stages: {
    stage: number;
    title: string;
    timeline: string;
    description: string;
    impactFact: string;
    renderIllustration: () => React.ReactNode;
  }[];
}

export default function CivicCategoryAnimationModal({
  isOpen,
  onClose,
  initialCategory = 'Plantation',
  eventContext,
  onExploreCategory,
}: CivicCategoryAnimationModalProps) {
  const getEffectiveCategory = () => {
    if (eventContext?.eventType) {
      return mapEventTypeToCategory(eventContext.eventType);
    }
    return initialCategory;
  };

  const [activeCategory, setActiveCategory] = useState<CivicCategoryKey>(getEffectiveCategory());
  const [currentStage, setCurrentStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Sync category on open or eventContext change
  useEffect(() => {
    if (isOpen) {
      const cat = eventContext?.eventType
        ? mapEventTypeToCategory(eventContext.eventType)
        : initialCategory;
      setActiveCategory(cat);
      setCurrentStage(0);
      setIsPlaying(true);
    }
  }, [isOpen, initialCategory, eventContext]);

  // Reset stage when switching category
  const handleSelectCategory = (cat: CivicCategoryKey) => {
    setActiveCategory(cat);
    setCurrentStage(0);
  };

  // Celebration on reaching final stage
  useEffect(() => {
    if (isOpen && currentStage === 4) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#10b981', '#34d399', '#f59e0b', '#3b82f6', '#ec4899'],
        });
      } catch (_) {}
    }
  }, [currentStage, isOpen, activeCategory]);

  // Auto-play timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStage((prev) => (prev >= 4 ? 0 : prev + 1));
    }, 3800);
    return () => clearInterval(timer);
  }, [isOpen, isPlaying]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // -------------------------------------------------------------
  // Categories Configuration & Bespoke SVG Illustrations
  // -------------------------------------------------------------
  const categories: Record<CivicCategoryKey, CategoryConfig> = {
    // 1. PLANTATION
    Plantation: {
      key: 'Plantation',
      label: 'Tree Plantation',
      badge: 'Seed to Harvest',
      color: 'emerald',
      icon: Trees,
      accentGradient: 'from-emerald-500 to-teal-600',
      stages: [
        {
          stage: 1,
          title: 'Day 1 — Sowing the Native Seed',
          timeline: 'Stage 1 of 5 • Planting Phase',
          description:
            'A hand places a resilient native fruit seed into nutrient-rich soil. Gentle morning rain droplets and warm sunlight trigger germination.',
          impactFact: '1 Native Neem or Mango sapling offsets 22kg CO₂ annually.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#e0f2fe" opacity="0.3" />
              <circle cx="340" cy="50" r="30" fill="#fef08a" opacity="0.9" />
              <path d="M 0 190 Q 200 180 400 190 L 400 280 L 0 280 Z" fill="#78350f" />
              <path d="M 0 205 Q 200 195 400 205 L 400 280 L 0 280 Z" fill="#582509" />
              <ellipse cx="200" cy="225" rx="16" ry="11" fill="#92400e" />
              <ellipse cx="200" cy="225" rx="12" ry="7" fill="#451a03" />
              <circle cx="198" cy="223" r="3" fill="#fde68a" opacity="0.8" />
              <path d="M 200 214 Q 200 185 198 175" stroke="#34d399" strokeWidth="3" strokeLinecap="round" strokeDasharray="3 3" />
              <g className="animate-bounce" style={{ animationDuration: '2s' }}>
                <path d="M 120 70 Q 120 85 125 95 A 5 5 0 0 1 115 95 Q 120 85 120 70 Z" fill="#38bdf8" opacity="0.85" />
                <path d="M 200 60 Q 200 75 205 85 A 5 5 0 0 1 195 85 Q 200 75 200 60 Z" fill="#38bdf8" opacity="0.85" />
              </g>
            </svg>
          ),
        },
        {
          stage: 2,
          title: 'Day 7 — Tender Green Sprout Emerges',
          timeline: 'Stage 2 of 5 • Germination',
          description:
            'The seed casing cracks open and two emerald cotyledon leaves rise through the topsoil, stretching toward the morning sunlight.',
          impactFact: 'Roots anchor topsoil, preventing urban dust storms.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <path d="M 0 190 Q 200 185 400 190 L 400 280 L 0 280 Z" fill="#78350f" />
              <path d="M 197 225 Q 198 175 200 155" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
              <path d="M 195 225 Q 185 240 180 255" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 200 160 Q 180 145 170 152 Q 175 168 198 162" fill="#34d399" stroke="#059669" strokeWidth="1.5" />
              <path d="M 200 155 Q 220 140 230 148 Q 225 165 202 158" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
            </svg>
          ),
        },
        {
          stage: 3,
          title: 'Day 30 — Sturdy Young Sapling',
          timeline: 'Stage 3 of 5 • Vegetative Growth',
          description:
            'A woody stem forms with lush branching foliage. Deep root systems anchor into the soil, drawing water and minerals.',
          impactFact: 'Community volunteers water and protect saplings with bamboo guards.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <path d="M 0 195 Q 200 190 400 195 L 400 280 L 0 280 Z" fill="#78350f" />
              <path d="M 195 200 Q 198 140 200 100" stroke="#854d0e" strokeWidth="8" strokeLinecap="round" />
              <ellipse cx="170" cy="115" rx="22" ry="14" fill="#34d399" opacity="0.9" />
              <ellipse cx="230" cy="110" rx="24" ry="15" fill="#10b981" opacity="0.9" />
              <ellipse cx="200" cy="85" rx="28" ry="18" fill="#059669" />
            </svg>
          ),
        },
        {
          stage: 4,
          title: 'Year 2 — Flourishing Canopy & Shade',
          timeline: 'Stage 4 of 5 • Canopy Expansion',
          description:
            'A majestic tree with a wide canopy provides natural coolness, clean oxygen, and birdsong to the entire neighborhood.',
          impactFact: 'Lowers surrounding neighborhood ambient heat by up to 3°C.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <path d="M 0 200 Q 200 195 400 200 L 400 280 L 0 280 Z" fill="#78350f" />
              <path d="M 192 205 Q 197 140 200 90" stroke="#713f12" strokeWidth="18" strokeLinecap="round" />
              <g className="animate-tree-sway">
                <circle cx="150" cy="95" r="48" fill="#10b981" opacity="0.92" />
                <circle cx="250" cy="90" r="50" fill="#047857" opacity="0.92" />
                <circle cx="200" cy="65" r="58" fill="#059669" />
                <circle cx="200" cy="85" r="45" fill="#34d399" opacity="0.9" />
              </g>
            </svg>
          ),
        },
        {
          stage: 5,
          title: 'Year 5 — Bountiful Harvest Celebration',
          timeline: 'Stage 5 of 5 • Bountiful Harvest',
          description:
            'Sweet, ripe fruits hang among golden leaves. Community children and neighbors gather beneath the branches to enjoy the harvest!',
          impactFact: 'Feeds local families with 100+ kg of organic seasonal fruits yearly.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <path d="M 0 200 Q 200 195 400 200 L 400 280 L 0 280 Z" fill="#78350f" />
              <path d="M 192 205 Q 197 140 200 90" stroke="#713f12" strokeWidth="18" strokeLinecap="round" />
              <g className="animate-tree-sway">
                <circle cx="150" cy="95" r="48" fill="#10b981" opacity="0.92" />
                <circle cx="250" cy="90" r="50" fill="#047857" opacity="0.92" />
                <circle cx="200" cy="65" r="58" fill="#059669" />
                <g className="animate-fruit-glow">
                  <circle cx="160" cy="85" r="10" fill="#ef4444" stroke="#fef08a" strokeWidth="2" />
                  <circle cx="240" cy="80" r="11" fill="#f59e0b" stroke="#fef08a" strokeWidth="2" />
                  <circle cx="200" cy="55" r="11" fill="#ef4444" stroke="#fef08a" strokeWidth="2" />
                  <circle cx="180" cy="105" r="10" fill="#f59e0b" stroke="#fef08a" strokeWidth="2" />
                  <circle cx="225" cy="105" r="9" fill="#ef4444" stroke="#fef08a" strokeWidth="2" />
                </g>
              </g>
            </svg>
          ),
        },
      ],
    },

    // 2. DONATION
    Donation: {
      key: 'Donation',
      label: 'Donation Drive',
      badge: 'Give to Poor & Needy',
      color: 'amber',
      icon: Heart,
      accentGradient: 'from-amber-500 to-orange-600',
      stages: [
        {
          stage: 1,
          title: 'Sorting Warm Clothes & Relief Boxes',
          timeline: 'Stage 1 of 5 • Collection & Sorting',
          description:
            'Volunteers inspect, clean, and pack thick woolen sweaters, blankets, and essential groceries into labeled humanitarian relief hampers.',
          impactFact: '1 winter blanket shields a vulnerable rickshaw puller or child from severe hypothermia.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#fef3c7" opacity="0.3" />
              {/* Packaging Table */}
              <rect x="60" y="160" width="280" height="70" rx="8" fill="#d97706" opacity="0.85" />
              <rect x="80" y="230" width="16" height="40" fill="#b45309" />
              <rect x="304" y="230" width="16" height="40" fill="#b45309" />
              {/* Donation Boxes */}
              <rect x="90" y="105" width="65" height="55" rx="6" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
              <path d="M 90 120 L 155 120" stroke="#b45309" strokeWidth="2" />
              <text x="122" y="142" fontSize="16" textAnchor="middle" fill="#78350f">📦</text>
              {/* Folded Blankets */}
              <rect x="175" y="118" width="60" height="42" rx="6" fill="#0284c7" stroke="#0369a1" strokeWidth="2" />
              <rect x="180" y="108" width="50" height="15" rx="4" fill="#38bdf8" />
              <rect x="255" y="112" width="65" height="48" rx="6" fill="#10b981" stroke="#047857" strokeWidth="2" />
              <circle cx="287" cy="136" r="12" fill="#ffffff" opacity="0.3" />
              <text x="287" y="142" fontSize="14" textAnchor="middle" fill="#ffffff">❤️</text>
            </svg>
          ),
        },
        {
          stage: 2,
          title: 'Reaching the Neighborhood Streets',
          timeline: 'Stage 2 of 5 • Hyperlocal Outreach',
          description:
            'Volunteers walk into informal settlements and night shelters in Mirpur and Mohammadpur with loaded donation packs.',
          impactFact: 'Direct street outreach ensures aid goes to genuine destitute families without middlemen.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              {/* Night shelter backdrop */}
              <rect x="0" y="0" width="400" height="280" fill="#0f172a" opacity="0.75" />
              <circle cx="330" cy="55" r="24" fill="#fde047" opacity="0.9" />
              <path d="M 0 210 Q 200 205 400 210 L 400 280 L 0 280 Z" fill="#334155" />
              {/* Volunteer walking with aid */}
              <circle cx="160" cy="140" r="16" fill="#fcd34d" />
              <path d="M 160 156 L 160 215" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
              <path d="M 160 170 L 195 180" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
              <rect x="195" y="165" width="40" height="32" rx="4" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
              <text x="215" y="186" fontSize="14" textAnchor="middle">🎁</text>
            </svg>
          ),
        },
        {
          stage: 3,
          title: 'Handing Over Warmth & Care',
          timeline: 'Stage 3 of 5 • The Act of Giving',
          description:
            'Hands meet in mutual dignity. A thick thermal blanket and hot meal container are passed directly to an elderly grandmother.',
          impactFact: 'Dignity first: Every relief package is handed over with respect and care.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#1e293b" opacity="0.7" />
              {/* Hands extending from left & right */}
              <path d="M 40 160 Q 140 160 175 165" stroke="#fcd34d" strokeWidth="18" strokeLinecap="round" />
              <path d="M 360 170 Q 260 170 225 165" stroke="#ca8a04" strokeWidth="16" strokeLinecap="round" />
              {/* Glowing Blanket & Gift in Center */}
              <g className="animate-heartbeat">
                <rect x="165" y="125" width="70" height="55" rx="10" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
                <path d="M 200 125 L 200 180" stroke="#ffffff" strokeWidth="3" />
                <path d="M 165 150 L 235 150" stroke="#ffffff" strokeWidth="3" />
                <circle cx="200" cy="115" r="14" fill="#fbbf24" />
                <text x="200" y="120" fontSize="12" textAnchor="middle">✨</text>
              </g>
            </svg>
          ),
        },
        {
          stage: 4,
          title: 'Comfort, Warmth & Smiles',
          timeline: 'Stage 4 of 5 • Transformation',
          description:
            'Wrapped in soft thermal warmth with wholesome food, relief warms hearts. A heartfelt smile shines in the chilly winter night.',
          impactFact: 'Community care restores hope and reminds people they are never forgotten.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#0f172a" opacity="0.8" />
              {/* Warm Radiance Glow */}
              <circle cx="200" cy="140" r="90" fill="#f59e0b" opacity="0.2" className="animate-pulse" />
              <circle cx="200" cy="140" r="60" fill="#f59e0b" opacity="0.35" />
              {/* Wrapped Figure Smiling */}
              <circle cx="200" cy="100" r="28" fill="#fcd34d" />
              <path d="M 190 98 Q 193 93 196 98" stroke="#78350f" strokeWidth="2.5" fill="none" />
              <path d="M 204 98 Q 207 93 210 98" stroke="#78350f" strokeWidth="2.5" fill="none" />
              <path d="M 192 112 Q 200 122 208 112" stroke="#78350f" strokeWidth="2.5" fill="none" />
              {/* Warm Blanket Wrapped */}
              <path d="M 155 130 Q 200 125 245 130 L 255 240 L 145 240 Z" fill="#0284c7" stroke="#38bdf8" strokeWidth="3" />
              <path d="M 175 135 L 225 190" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 4" />
              {/* Glowing Hearts */}
              <text x="140" y="80" fontSize="24" className="animate-heartbeat">💖</text>
              <text x="260" y="85" fontSize="24" className="animate-heartbeat">💝</text>
            </svg>
          ),
        },
        {
          stage: 5,
          title: '1,200+ Lives Kept Safe & Warm',
          timeline: 'Stage 5 of 5 • Collective Impact',
          description:
            'A wave of civic solidarity: hundreds of street children, seniors, and working laborers receive the warmth they deserve.',
          impactFact: '100% volunteer funded & transparently distributed across Dhaka.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#047857" opacity="0.25" />
              {/* Group of happy community members holding hands */}
              <circle cx="120" cy="120" r="18" fill="#fcd34d" />
              <rect x="108" y="140" width="24" height="60" rx="8" fill="#0284c7" />
              <circle cx="200" cy="105" r="22" fill="#fcd34d" />
              <rect x="185" y="130" width="30" height="70" rx="10" fill="#f59e0b" />
              <circle cx="280" cy="120" r="18" fill="#fcd34d" />
              <rect x="268" y="140" width="24" height="60" rx="8" fill="#10b981" />
              {/* Giant Golden Heart Overhead */}
              <g className="animate-heartbeat">
                <text x="200" y="60" fontSize="48" textAnchor="middle">❤️</text>
              </g>
              <text x="200" y="240" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#10b981">
                Warmth &amp; Dignity Delivered
              </text>
            </svg>
          ),
        },
      ],
    },

    // 3. CLEANUP
    Cleanup: {
      key: 'Cleanup',
      label: 'Urban & Lake Cleanup',
      badge: 'Clean the Dirty & Dusted Place',
      color: 'blue',
      icon: Trash2,
      accentGradient: 'from-blue-500 to-cyan-600',
      stages: [
        {
          stage: 1,
          title: 'The Littered & Dusted Shoreline',
          timeline: 'Stage 1 of 5 • Assessment',
          description:
            'A neglected park path and lake bank filled with discarded single-use plastic bottles, soda cans, and choking urban dust.',
          impactFact: 'Plastic bottles can take over 450 years to degrade in waterways.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#f1f5f9" />
              {/* Murky lake water */}
              <path d="M 0 160 Q 200 150 400 160 L 400 280 L 0 280 Z" fill="#94a3b8" opacity="0.6" />
              <path d="M 0 200 Q 200 190 400 200 L 400 280 L 0 280 Z" fill="#78716c" opacity="0.8" />
              {/* Litter on ground */}
              <rect x="90" y="220" width="28" height="12" rx="3" fill="#ef4444" transform="rotate(15 90 220)" />
              <rect x="170" y="225" width="30" height="10" rx="4" fill="#3b82f6" transform="rotate(-25 170 225)" />
              <rect x="250" y="215" width="22" height="14" rx="3" fill="#eab308" transform="rotate(40 250 215)" />
              <circle cx="310" cy="235" r="8" fill="#64748b" />
              <text x="140" y="240" fontSize="16">🥤</text>
              <text x="210" y="245" fontSize="16">🥫</text>
              <text x="280" y="240" fontSize="16">🛍️</text>
            </svg>
          ),
        },
        {
          stage: 2,
          title: 'Volunteers Arrive with Tools & Bins',
          timeline: 'Stage 2 of 5 • Mobilization',
          description:
            'Armed with heavy-duty gloves, ergonomic trash grabbers, eco-friendly jute sacks, and brooms, community members step forward.',
          impactFact: '80+ enthusiastic youth join weekend lake restorations.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#e2e8f0" opacity="0.5" />
              <path d="M 0 190 Q 200 185 400 190 L 400 280 L 0 280 Z" fill="#64748b" />
              {/* Volunteer with grabber */}
              <circle cx="150" cy="110" r="16" fill="#fcd34d" />
              <path d="M 150 126 L 150 195" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" />
              <path d="M 150 145 L 185 175" stroke="#475569" strokeWidth="4" />
              <path d="M 185 175 L 195 190" stroke="#ef4444" strokeWidth="3" />
              {/* Recycling Bins */}
              <rect x="270" y="145" width="40" height="65" rx="6" fill="#10b981" />
              <text x="290" y="180" fontSize="18" textAnchor="middle" fill="#ffffff">♻️</text>
              <rect x="320" y="145" width="40" height="65" rx="6" fill="#3b82f6" />
              <text x="340" y="180" fontSize="18" textAnchor="middle" fill="#ffffff">🗑️</text>
            </svg>
          ),
        },
        {
          stage: 3,
          title: 'Sweeping Away the Dust & Dirt',
          timeline: 'Stage 3 of 5 • Active Cleaning',
          description:
            'Brooms rhythmically sweep dust clouds away, tongs pluck bottles from reeds, and waste is organized for recycling.',
          impactFact: 'Over 85% of collected plastic is dispatched directly to recycling plants.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#f8fafc" />
              <path d="M 0 190 Q 200 185 400 190 L 400 280 L 0 280 Z" fill="#475569" />
              {/* Sweeping Broom Animated */}
              <g className="animate-sweep" style={{ transformOrigin: '200px 80px' }}>
                <path d="M 200 80 L 180 200" stroke="#b45309" strokeWidth="7" strokeLinecap="round" />
                <path d="M 160 200 L 200 200 L 210 230 L 150 230 Z" fill="#eab308" />
              </g>
              {/* Dust particles being swept */}
              <circle cx="140" cy="215" r="4" fill="#cbd5e1" opacity="0.8" />
              <circle cx="125" cy="205" r="5" fill="#94a3b8" opacity="0.7" />
              <circle cx="110" cy="220" r="3" fill="#cbd5e1" opacity="0.9" />
            </svg>
          ),
        },
        {
          stage: 4,
          title: 'Sparkling Shorelines & Clear Waters',
          timeline: 'Stage 4 of 5 • Rejuvenation',
          description:
            'The shoreline shines impeccably clean. The lake reflects the azure sky and indigenous fish swim freely near the water bank.',
          impactFact: 'Clean waterways prevent dengue outbreaks and water-borne ailments.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              {/* Pristine lake & green park */}
              <rect x="0" y="0" width="400" height="280" fill="#ecfeff" />
              <path d="M 0 160 Q 200 150 400 160 L 400 280 L 0 280 Z" fill="#0284c7" />
              <path d="M 0 200 Q 200 190 400 200 L 400 280 L 0 280 Z" fill="#10b981" />
              {/* Wildflowers blooming */}
              <circle cx="80" cy="220" r="6" fill="#f43f5e" />
              <circle cx="140" cy="235" r="6" fill="#fbbf24" />
              <circle cx="280" cy="225" r="6" fill="#a855f7" />
              <circle cx="330" cy="230" r="6" fill="#f43f5e" />
              {/* Sparkling Glimmers */}
              <g className="animate-sparkle">
                <text x="100" y="180" fontSize="22">✨</text>
                <text x="220" y="175" fontSize="26">✨</text>
                <text x="310" y="190" fontSize="20">✨</text>
              </g>
            </svg>
          ),
        },
        {
          stage: 5,
          title: '450 kg Plastics Removed & Restored',
          timeline: 'Stage 5 of 5 • Eco Milestone',
          description:
            'Hatirjheel waterfront restored! Community residents and park strollers enjoy a pristine, healthy urban sanctuary.',
          impactFact: 'Community signboards installed: Zero single-use plastic zone.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#0284c7" opacity="0.2" />
              {/* Clean park with birds and bench */}
              <path d="M 0 180 Q 200 175 400 180 L 400 280 L 0 280 Z" fill="#059669" />
              <rect x="150" y="160" width="100" height="12" rx="3" fill="#78350f" />
              <rect x="165" y="172" width="10" height="30" fill="#451a03" />
              <rect x="225" y="172" width="10" height="30" fill="#451a03" />
              {/* Flying Birds */}
              <path d="M 100 80 Q 110 70 120 80 Q 130 70 140 80" stroke="#0f172a" strokeWidth="2.5" fill="none" />
              <path d="M 240 60 Q 250 50 260 60 Q 270 50 280 60" stroke="#0f172a" strokeWidth="2.5" fill="none" />
              <g className="animate-bounce">
                <text x="200" y="130" fontSize="36" textAnchor="middle">🏆</text>
              </g>
              <text x="200" y="240" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#047857">
                Clean, Green &amp; Breathable
              </text>
            </svg>
          ),
        },
      ],
    },

    // 4. HEALTHCARE
    Healthcare: {
      key: 'Healthcare',
      label: 'Healthcare & Medical Camp',
      badge: 'Free Consultation & Health Restored',
      color: 'rose',
      icon: Stethoscope,
      accentGradient: 'from-rose-500 to-pink-600',
      stages: [
        {
          stage: 1,
          title: 'Patient Welcome & Vitals Check',
          timeline: 'Stage 1 of 5 • Triage & Registration',
          description:
            'Residents from low-income areas receive free digital blood pressure, glucose, and body temperature screenings from student nurses.',
          impactFact: 'Early hypertension & diabetes detection saves lives.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#ffe4e6" opacity="0.3" />
              {/* Medical Clinic Desk */}
              <rect x="60" y="160" width="280" height="70" rx="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
              {/* Sphygmomanometer / BP Monitor */}
              <rect x="100" y="125" width="45" height="35" rx="5" fill="#0f172a" />
              <text x="122" y="148" fontSize="14" fill="#34d399" textAnchor="middle" fontWeight="bold">120</text>
              {/* Medical Cross */}
              <circle cx="200" cy="90" r="28" fill="#f43f5e" />
              <rect x="193" y="72" width="14" height="36" rx="2" fill="#ffffff" />
              <rect x="181" y="83" width="38" height="14" rx="2" fill="#ffffff" />
            </svg>
          ),
        },
        {
          stage: 2,
          title: 'Specialist Consultation with Doctor',
          timeline: 'Stage 2 of 5 • Professional Diagnosis',
          description:
            'Volunteer physicians listen to heart & lung rhythms with stethoscopes, patiently answering questions in Bangla.',
          impactFact: 'Over 20 volunteer MD doctors participate in each weekend camp.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#fff1f2" opacity="0.4" />
              {/* Doctor on left with Stethoscope */}
              <circle cx="140" cy="115" r="20" fill="#fcd34d" />
              <path d="M 140 135 L 140 210" stroke="#f43f5e" strokeWidth="16" strokeLinecap="round" />
              {/* Stethoscope */}
              <path d="M 130 145 Q 140 185 175 165" stroke="#334155" strokeWidth="4" fill="none" />
              <circle cx="175" cy="165" r="7" fill="#64748b" />
              {/* Patient on right */}
              <circle cx="260" cy="125" r="18" fill="#fcd34d" />
              <path d="M 260 143 L 260 210" stroke="#0284c7" strokeWidth="14" strokeLinecap="round" />
              <text x="200" y="70" fontSize="28" className="animate-heartbeat">🩺</text>
            </svg>
          ),
        },
        {
          stage: 3,
          title: 'Free Medicine Dispensary & Eyeglasses',
          timeline: 'Stage 3 of 5 • Treatment Provision',
          description:
            'Patients receive full courses of prescribed antibiotics, iron supplements, pediatric syrup, and custom prescription reading glasses.',
          impactFact: '100% free medication sourced from certified pharmaceutical partners.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#f0fdf4" opacity="0.5" />
              {/* Medicine Dispensary Box */}
              <rect x="80" y="130" width="240" height="90" rx="10" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
              {/* Pill bottles */}
              <rect x="110" y="150" width="30" height="50" rx="4" fill="#f59e0b" />
              <rect x="113" y="142" width="24" height="10" rx="2" fill="#ffffff" />
              <rect x="160" y="150" width="30" height="50" rx="4" fill="#10b981" />
              <rect x="163" y="142" width="24" height="10" rx="2" fill="#ffffff" />
              {/* Prescription Glasses */}
              <circle cx="230" cy="175" r="14" stroke="#0f172a" strokeWidth="3" fill="none" />
              <circle cx="270" cy="175" r="14" stroke="#0f172a" strokeWidth="3" fill="none" />
              <path d="M 244 175 L 256 175" stroke="#0f172a" strokeWidth="3" />
              <text x="200" y="100" fontSize="32">💊</text>
            </svg>
          ),
        },
        {
          stage: 4,
          title: 'Strong ECG Heart Pulse Restored',
          timeline: 'Stage 4 of 5 • Healing & Vitality',
          description:
            'Continuous monitoring shows optimal recovery. Health vital indicators glow in reassuring emerald green.',
          impactFact: 'Regular monitoring lowers risk of severe cardiac complications by 40%.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#0f172a" />
              {/* ECG Monitor Screen */}
              <rect x="40" y="50" width="320" height="160" rx="12" fill="#022c22" stroke="#059669" strokeWidth="3" />
              {/* ECG Wave Animated */}
              <path
                d="M 50 130 L 120 130 L 135 90 L 150 170 L 165 110 L 180 145 L 195 130 L 250 130 L 265 85 L 280 175 L 295 120 L 350 130"
                stroke="#10b981"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
              />
              <text x="70" y="85" fontSize="16" fill="#34d399" fontWeight="bold">HEART RATE: 72 BPM</text>
              <g className="animate-heartbeat">
                <text x="320" y="90" fontSize="24">💚</text>
              </g>
            </svg>
          ),
        },
        {
          stage: 5,
          title: '800+ Neighbors Healed & Thriving',
          timeline: 'Stage 5 of 5 • Community Wellness',
          description:
            'A healthier community is a stronger community. Families leave with clear vision, reliable medicines, and renewed peace of mind.',
          impactFact: 'Free follow-up hotline connects patients to volunteer doctors 24/7.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#ecfdf5" />
              {/* Happy family with health shield */}
              <circle cx="200" cy="110" r="45" fill="#10b981" opacity="0.2" className="animate-ping" />
              <path
                d="M 200 60 L 250 85 L 250 145 Q 200 190 200 190 Q 150 145 150 85 Z"
                fill="#10b981"
                stroke="#047857"
                strokeWidth="3"
              />
              <text x="200" y="135" fontSize="32" textAnchor="middle" fill="#ffffff">✚</text>
              <text x="200" y="240" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#047857">
                Compassionate Care for Every Soul
              </text>
            </svg>
          ),
        },
      ],
    },

    // 5. EDUCATION
    Education: {
      key: 'Education',
      label: 'Youth & Children Literacy',
      badge: 'Knowledge, Books & Bright Futures',
      color: 'indigo',
      icon: BookOpen,
      accentGradient: 'from-indigo-500 to-violet-600',
      stages: [
        {
          stage: 1,
          title: 'Eager Learners Under the Open Sky',
          timeline: 'Stage 1 of 5 • The Gathering',
          description:
            'Working street children and youth gather on mats under the shade in Farmgate, their eyes filled with curiosity and desire to read.',
          impactFact: 'Over 250,000 children in urban centers lack basic access to primary literacy.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#eef2ff" opacity="0.6" />
              {/* Big Shade Tree */}
              <path d="M 0 210 Q 200 205 400 210 L 400 280 L 0 280 Z" fill="#15803d" />
              <path d="M 70 210 L 75 100" stroke="#78350f" strokeWidth="16" />
              <circle cx="75" cy="80" r="55" fill="#16a34a" opacity="0.9" />
              {/* Children sitting on mat */}
              <rect x="140" y="195" width="200" height="25" rx="6" fill="#f59e0b" opacity="0.8" />
              <circle cx="170" cy="170" r="14" fill="#fcd34d" />
              <circle cx="240" cy="168" r="14" fill="#fcd34d" />
              <circle cx="300" cy="170" r="14" fill="#fcd34d" />
            </svg>
          ),
        },
        {
          stage: 2,
          title: 'Opening the Magic of Illustrated Books',
          timeline: 'Stage 2 of 5 • Storytelling Session',
          description:
            'Volunteer mentors open colorful Bangla and English storybooks. Vibrant illustrations spark smiles and questions.',
          impactFact: 'Story-based learning accelerates word recognition by 3x.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#fdf4ff" opacity="0.5" />
              {/* Open Book in Center */}
              <g className="animate-float-gentle">
                <path d="M 120 180 Q 200 170 200 130 L 200 90 Q 120 100 120 140 Z" fill="#ffffff" stroke="#6366f1" strokeWidth="3" />
                <path d="M 280 180 Q 200 170 200 130 L 200 90 Q 280 100 280 140 Z" fill="#f8fafc" stroke="#6366f1" strokeWidth="3" />
                <path d="M 140 120 L 180 115" stroke="#94a3b8" strokeWidth="2.5" />
                <path d="M 140 135 L 180 130" stroke="#94a3b8" strokeWidth="2.5" />
                <path d="M 220 115 L 260 120" stroke="#94a3b8" strokeWidth="2.5" />
                <path d="M 220 130 L 260 135" stroke="#94a3b8" strokeWidth="2.5" />
              </g>
              <text x="200" y="70" fontSize="30" textAnchor="middle">📖</text>
            </svg>
          ),
        },
        {
          stage: 3,
          title: 'Letters & Numbers Unlocking the World',
          timeline: 'Stage 3 of 5 • Active Literacy',
          description:
            'Letters like অ, আ, ক, খ and A, B, C float up like glowing lanterns as children practice writing on newly gifted slate boards.',
          impactFact: 'Each student receives a full year pack of notebooks, pencils, and colors.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#312e81" opacity="0.85" />
              {/* Floating Glowing Letters */}
              <g className="animate-bounce" style={{ animationDuration: '2.5s' }}>
                <text x="90" y="110" fontSize="32" fill="#38bdf8" fontWeight="bold">অ</text>
                <text x="160" y="80" fontSize="32" fill="#f43f5e" fontWeight="bold">A</text>
                <text x="230" y="100" fontSize="32" fill="#fbbf24" fontWeight="bold">ক</text>
                <text x="300" y="75" fontSize="32" fill="#34d399" fontWeight="bold">B</text>
                <text x="200" y="140" fontSize="36" fill="#c084fc" fontWeight="bold">1 2 3</text>
              </g>
              {/* Student writing below */}
              <rect x="140" y="190" width="120" height="70" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
              <text x="200" y="235" fontSize="16" fill="#a5b4fc" textAnchor="middle">অ আ ক খ</text>
            </svg>
          ),
        },
        {
          stage: 4,
          title: 'The Golden Lightbulb of Insight',
          timeline: 'Stage 4 of 5 • Comprehension & Pride',
          description:
            'The moment of realization: sentences flow, math problems are solved, and eyes sparkle with confidence.',
          impactFact: '92% of enrolled children transition into formal accredited schooling.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#1e1b4b" />
              {/* Giant Glowing Lightbulb */}
              <g className="animate-fruit-glow">
                <circle cx="200" cy="110" r="40" fill="#fbbf24" opacity="0.9" />
                <path d="M 180 145 L 220 145 L 212 170 L 188 170 Z" fill="#94a3b8" />
                <circle cx="200" cy="175" r="5" fill="#64748b" />
                {/* Filament */}
                <path d="M 190 120 Q 200 100 200 130 Q 200 100 210 120" stroke="#78350f" strokeWidth="3" fill="none" />
              </g>
              {/* Light rays */}
              <line x1="200" y1="50" x2="200" y2="30" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
              <line x1="250" y1="75" x2="265" y2="60" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
              <line x1="150" y1="75" x2="135" y2="60" stroke="#fde047" strokeWidth="3" strokeLinecap="round" />
              <text x="200" y="235" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#e0e7ff">
                Igniting Young Minds
              </text>
            </svg>
          ),
        },
        {
          stage: 5,
          title: '350+ Children Empowered for Life',
          timeline: 'Stage 5 of 5 • Graduation & Future',
          description:
            'Graduation celebration! Children proudly hold certificates, toss paper hats into the sky, and step forward as future leaders.',
          impactFact: 'Free community library remains open daily for homework and books.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#4338ca" opacity="0.2" />
              {/* Flying graduation caps */}
              <g className="animate-bounce">
                <path d="M 120 70 L 150 60 L 180 70 L 150 80 Z" fill="#1e1b4b" />
                <path d="M 230 50 L 260 40 L 290 50 L 260 60 Z" fill="#1e1b4b" />
                <line x1="260" y1="50" x2="275" y2="65" stroke="#f59e0b" strokeWidth="2" />
              </g>
              <circle cx="200" cy="140" r="28" fill="#fcd34d" />
              <rect x="180" y="170" width="40" height="70" rx="8" fill="#6366f1" />
              <text x="200" y="245" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#4338ca">
                Knowledge is Freedom
              </text>
            </svg>
          ),
        },
      ],
    },

    // 6. RELIEF AID
    'Relief Aid': {
      key: 'Relief Aid',
      label: 'Emergency Relief & Flood Rescue',
      badge: 'Swift Rescue, Sustenance & Beacon of Hope',
      color: 'teal',
      icon: LifeBuoy,
      accentGradient: 'from-teal-500 to-emerald-600',
      stages: [
        {
          stage: 1,
          title: 'Heavy Monsoon Storm & Rising Waters',
          timeline: 'Stage 1 of 5 • Emergency Alert',
          description:
            'Torrential flash floods submerge remote riverside homesteads in Sylhet and Sunamganj. Communication is cut off.',
          impactFact: 'Every monsoon, sudden flash floods displace over 1.5 million people in northeastern Bangladesh.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              {/* Dark Storm Clouds */}
              <rect x="0" y="0" width="400" height="280" fill="#1e293b" />
              <ellipse cx="140" cy="60" rx="70" ry="35" fill="#334155" />
              <ellipse cx="230" cy="50" rx="90" ry="40" fill="#475569" />
              {/* Rain lines */}
              <g stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 6">
                <line x1="80" y1="90" x2="70" y2="150" />
                <line x1="160" y1="85" x2="150" y2="150" />
                <line x1="240" y1="90" x2="230" y2="160" />
                <line x1="320" y1="80" x2="310" y2="155" />
              </g>
              {/* Rising water */}
              <path d="M 0 170 Q 100 160 200 170 T 400 170 L 400 280 L 0 280 Z" fill="#0369a1" />
              <path d="M 0 190 Q 100 180 200 190 T 400 190 L 400 280 L 0 280 Z" fill="#075985" />
            </svg>
          ),
        },
        {
          stage: 2,
          title: 'Civic Rescue Boat Deploys Rapidly',
          timeline: 'Stage 2 of 5 • Rapid Response',
          description:
            'Trained youth first-responders navigate flat-bottom rescue boats with orange lifejackets, towlines, and emergency beacons.',
          impactFact: 'Civic boats can reach isolated waterlogged char islands within 45 minutes.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#0f172a" opacity="0.8" />
              <path d="M 0 170 Q 100 160 200 170 T 400 170 L 400 280 L 0 280 Z" fill="#0284c7" />
              {/* Rescue Motorboat Animated */}
              <g className="animate-water-float">
                <path d="M 120 160 L 280 160 L 260 195 L 140 195 Z" fill="#ea580c" stroke="#ffffff" strokeWidth="2" />
                <rect x="180" y="130" width="40" height="30" rx="4" fill="#ffffff" />
                <circle cx="200" cy="115" r="14" fill="#fcd34d" />
                <circle cx="240" cy="170" r="12" fill="#ffffff" stroke="#ea580c" strokeWidth="4" />
                <text x="240" y="174" fontSize="10" textAnchor="middle">🛟</text>
              </g>
            </svg>
          ),
        },
        {
          stage: 3,
          title: 'Distributing Clean Water & Food Packets',
          timeline: 'Stage 3 of 5 • Relief Distribution',
          description:
            'Water purification halo-tabs, high-protein biscuits, oral rehydration saline, and waterproof dry-food barrels are safely handed over.',
          impactFact: 'Each purification kit provides 1,000 liters of potable drinking water.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#082f49" />
              {/* Handing over supplies */}
              <path d="M 0 180 Q 200 175 400 180 L 400 280 L 0 280 Z" fill="#0284c7" />
              {/* Water Jerry Can & Food Box */}
              <rect x="120" y="115" width="45" height="60" rx="8" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
              <rect x="130" y="105" width="25" height="10" rx="3" fill="#0369a1" />
              <rect x="190" y="125" width="60" height="50" rx="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
              <text x="220" y="155" fontSize="18" textAnchor="middle">🍞</text>
              <text x="142" y="150" fontSize="18" textAnchor="middle">💧</text>
              <g className="animate-heartbeat">
                <text x="290" y="110" fontSize="26">🛡️</text>
              </g>
            </svg>
          ),
        },
        {
          stage: 4,
          title: 'Sunlight Breaks Through Storm Clouds',
          timeline: 'Stage 4 of 5 • The Turnaround',
          description:
            'Floodwaters recede as bright golden sunshine pierces the storm clouds. Safe community shelters provide hot meals and medical triage.',
          impactFact: 'Zero casualties recorded in all active CivicPulse supported shelters.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#e0f2fe" />
              {/* Golden Sun Breaking Through */}
              <circle cx="200" cy="80" r="45" fill="#f59e0b" opacity="0.9" className="animate-pulse" />
              <path d="M 0 195 Q 200 190 400 195 L 400 280 L 0 280 Z" fill="#047857" />
              {/* Safe Shelter House */}
              <polygon points="150,170 200,120 250,170" fill="#b91c1c" />
              <rect x="160" y="170" width="80" height="50" fill="#f8fafc" />
              <rect x="190" y="185" width="20" height="35" fill="#1e293b" />
              <text x="200" y="245" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#065f46">
                Safe Shelter Established
              </text>
            </svg>
          ),
        },
        {
          stage: 5,
          title: '2,000+ Families Rescued & Rebuilding',
          timeline: 'Stage 5 of 5 • Resilience & Restoration',
          description:
            'Community homes dry out, water wells are purified with bleaching powder, and children resume play with renewed hope.',
          impactFact: 'Relief turns into resilience: rebuilding bamboo homes and community embankments.',
          renderIllustration: () => (
            <svg viewBox="0 0 400 280" className="w-full h-full">
              <rect x="0" y="0" width="400" height="280" fill="#047857" opacity="0.2" />
              {/* Beautiful green riverside with rainbow */}
              <path d="M 60 180 A 140 140 0 0 1 340 180" stroke="#f43f5e" strokeWidth="4" fill="none" opacity="0.7" />
              <path d="M 65 180 A 135 135 0 0 1 335 180" stroke="#fbbf24" strokeWidth="4" fill="none" opacity="0.7" />
              <path d="M 70 180 A 130 130 0 0 1 330 180" stroke="#10b981" strokeWidth="4" fill="none" opacity="0.7" />
              <path d="M 0 190 Q 200 185 400 190 L 400 280 L 0 280 Z" fill="#15803d" />
              <g className="animate-bounce">
                <text x="200" y="130" fontSize="36" textAnchor="middle">🤝</text>
              </g>
              <text x="200" y="240" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#065f46">
                Standing Strong in Solidarity
              </text>
            </svg>
          ),
        },
      ],
    },
  };

  const currentConfig = categories[activeCategory] || categories.Plantation;
  const currentStageData = currentConfig.stages[currentStage] || currentConfig.stages[0];
  const IconComp = currentConfig.icon;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${currentConfig.accentGradient} text-white flex items-center justify-center shadow-md`}>
              <IconComp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1 max-w-sm sm:max-w-md">
                  {eventContext ? eventContext.title : 'Civic Action Animated Impact'}
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  {eventContext ? `${currentConfig.label} Animation` : 'Interactive Simulator'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {eventContext
                  ? `Location: ${eventContext.location} • Step-by-step initiative impact`
                  : 'Witness real social transformation from initiative to lasting community impact'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Navigation Pills (Select Any Category Animation!) */}
        <div className="px-4 py-2.5 bg-slate-100/60 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {(Object.keys(categories) as CivicCategoryKey[]).map((catKey) => {
            const cat = categories[catKey];
            const isSelected = activeCategory === catKey;
            const CatIcon = cat.icon;
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => handleSelectCategory(catKey)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <CatIcon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Main Body (Illustration + Stage Details) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Animated Illustration Stage Canvas */}
          <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner flex items-center justify-center">
            {currentStageData.renderIllustration()}

            {/* Stage Counter Badge Overlay */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold border border-white/20 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{currentStageData.timeline}</span>
            </div>

            {/* Category Brand Badge Overlay */}
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-200 text-[11px] font-semibold border border-slate-300 dark:border-slate-700 shadow-sm">
              {currentConfig.badge}
            </div>
          </div>

          {/* Interactive Timeline Scrubber (5 Stages) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>Timeline Progress</span>
              <span>
                Stage {currentStage + 1} of {currentConfig.stages.length}
              </span>
            </div>

            {/* 5-Step Segmented Bar */}
            <div className="grid grid-cols-5 gap-2">
              {currentConfig.stages.map((stg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentStage(idx);
                    setIsPlaying(false);
                  }}
                  className={`group relative h-2.5 rounded-full transition-all cursor-pointer ${
                    idx <= currentStage
                      ? `bg-gradient-to-r ${currentConfig.accentGradient} shadow-xs`
                      : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300'
                  }`}
                  title={stg.title}
                />
              ))}
            </div>

            {/* Step Labels */}
            <div className="grid grid-cols-5 gap-1 text-[11px] text-center pt-1 font-medium text-slate-500 dark:text-slate-400">
              <span>Initiative</span>
              <span>Action</span>
              <span>Hands-on</span>
              <span>Results</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Impact ✨</span>
            </div>
          </div>

          {/* Current Stage Description & Real Impact Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7 p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{currentStageData.title}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentStageData.description}
              </p>
            </div>

            <div className="md:col-span-5 p-4 sm:p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Civic Impact</span>
              </div>
              <p className="text-xs font-semibold text-emerald-900 dark:text-emerald-100">
                {currentStageData.impactFact}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Playback Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="btn-magnetic btn-steel-secondary px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Auto Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setCurrentStage(0);
                setIsPlaying(true);
              }}
              className="btn-magnetic btn-steel-secondary px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300"
              title="Restart from Stage 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {eventContext ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  window.location.href = `/events/${eventContext._id}`;
                }}
                className="w-full sm:w-auto btn-magnetic btn-steel-primary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>Proceed to Event Details &amp; RSVP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onExploreCategory) {
                    onExploreCategory(activeCategory);
                  } else {
                    window.location.href = `/events?type=${encodeURIComponent(activeCategory)}`;
                  }
                }}
                className="w-full sm:w-auto btn-magnetic btn-steel-primary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <IconComp className="w-4 h-4" />
                <span>Explore {currentConfig.label} Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
