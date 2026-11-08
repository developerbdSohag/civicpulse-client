'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  ChevronRight,
  Zap,
  ShieldCheck,
  Users,
  Sparkles,
  ArrowRight,
  Loader2,
  Check,
  MapPin,
  Heart,
  ChevronDown,
  User,
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Star,
  Camera,
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import RegistrationGrowthTree from '@/components/animations/RegistrationGrowthTree';
import CivicAuthLightModal from '@/components/animations/CivicAuthLightModal';

const BD_DISTRICTS = [
  'Dhaka (Mirpur, Mohammadpur, Dhanmondi)',
  'Dhaka (Gulshan, Banani, Uttara)',
  'Old Dhaka (Sadarghat, Chawkbazar)',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh',
  'Comilla',
  'Cox\'s Bazar',
];

const CAUSES = [
  'Winter Clothes & Blankets',
  'Food & Meals Relief',
  'Tree Plantation Drives',
  'Lakeside & Park Cleanups',
  'Healthcare & Medical Camps',
  'Emergency Flood Preparedness',
];

function RegisterContent() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryEmail = searchParams.get('email') || '';
  const queryName = searchParams.get('name') || '';

  // Step 1: Your Details
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState(queryName);
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState(queryEmail);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [photoURL, setPhotoURL] = useState('');

  // Step 2: Community Setup
  const [district, setDistrict] = useState(BD_DISTRICTS[0]);
  const [selectedCauses, setSelectedCauses] = useState<string[]>([CAUSES[0], CAUSES[1]]);

  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (queryEmail) setEmail(queryEmail);
    if (queryName) setName(queryName);
  }, [queryEmail, queryName]);

  // Dynamic Password Validation Checks
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;

  // Toggle cause selection in Step 2
  const toggleCause = (cause: string) => {
    if (selectedCauses.includes(cause)) {
      setSelectedCauses(selectedCauses.filter((c) => c !== cause));
    } else {
      setSelectedCauses([...selectedCauses, cause]);
    }
  };

  // Validate Step 1 before advancing
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!password) {
      toast.error('Please choose a password.');
      return;
    }

    if (!hasMinLength) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    if (!hasUpperCase) {
      toast.error('Password must contain at least one uppercase letter (A-Z).');
      return;
    }
    if (!hasLowerCase) {
      toast.error('Password must contain at least one lowercase letter (a-z).');
      return;
    }

    // Step 1 valid -> move to Step 2
    setStep(2);
  };

  // Final Registration Submission
  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setLoading(true);

    const fullPhone = phone ? `+880 ${phone.replace(/^\+?880\s?/, '')}` : '';
    const bioText = designation.trim()
      ? `${designation.trim()} • Interested in: ${selectedCauses.slice(0, 2).join(', ')}`
      : `Volunteer • Interested in: ${selectedCauses.slice(0, 2).join(', ')}`;

    try {
      const result = await register(
        name.trim(),
        email.trim(),
        password,
        photoURL.trim() || undefined,
        fullPhone,
        district,
        bioText
      );

      if (result.success) {
        setIsCompleted(true);
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#10b981', '#34d399', '#f59e0b', '#3b82f6', '#ec4899'],
          });
        } catch (_) {}
        toast.success(`🎉 Welcome to CivicPulse, ${name.trim()}! Your tree is grown and your civic light is shining!`);
        setTimeout(() => {
          router.push('/events');
        }, 2200);
      } else {
        toast.error(result.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b12] text-slate-900 dark:text-slate-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-250">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          <span className="text-slate-800 dark:text-slate-200 font-semibold">Sign up</span>
        </nav>

        {/* 2-Column Split Hero Registration Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* =============================================================
              LEFT COLUMN: Vibrant Emerald Grid Card (built for Bangladesh)
             ============================================================= */}
          <div
            className="lg:col-span-5 rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl shadow-emerald-950/20 border border-emerald-400/30 text-white"
            style={{
              background: 'linear-gradient(145deg, #059669 0%, #047857 55%, #064e3b 100%)',
              backgroundImage: `
                radial-gradient(circle at 15% 15%, rgba(255, 255, 255, 0.12) 0%, transparent 40%),
                linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                linear-gradient(145deg, #059669 0%, #047857 55%, #064e3b 100%)
              `,
              backgroundSize: '100% 100%, 28px 28px, 28px 28px, 100% 100%',
            }}
          >
            {/* Top Section */}
            <div className="space-y-6 relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold tracking-wide shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span>CivicPulse Bangladesh</span>
              </div>

              {/* Main Headline with bespoke smooth SVG underline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[38px] font-extrabold text-white leading-[1.18] tracking-tight">
                Modern social action, relief &amp; drives{' '}
                <span className="relative inline-block text-emerald-100">
                  built for Bangladesh.
                  <svg
                    className="absolute -bottom-1 left-0 w-full h-2 text-emerald-300/80"
                    viewBox="0 0 200 8"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M1 5.5Q50 1 100 5.5T200 5.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              {/* Sub-text */}
              <p className="text-emerald-50/90 text-[14.5px] leading-relaxed font-normal">
                Join passionate volunteers and grassroots leaders creating lasting social impact with warm winter clothes, food relief, and cleanups across 64 districts.
              </p>

              {/* Step-by-Step Tree & Light Growth Animation */}
              <RegistrationGrowthTree step={step} isCompleted={isCompleted} />

              {/* Feature Points with elevated glass containers */}
              <div className="space-y-4 pt-2">
                {/* Point 1 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shrink-0 mt-0.5 shadow-xs text-emerald-200">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Setup in under 10 seconds</h3>
                    <p className="text-xs text-emerald-100/85 leading-relaxed font-normal mt-0.5">
                      Instant volunteer onboarding ready to explore or host local initiatives.
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shrink-0 mt-0.5 shadow-xs text-emerald-200">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">100% Transparent &amp; Safe</h3>
                    <p className="text-xs text-emerald-100/85 leading-relaxed font-normal mt-0.5">
                      Verified organizers, open attendee rosters, and zero platform fees.
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shrink-0 mt-0.5 shadow-xs text-emerald-200">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Local Bangladesh impact</h3>
                    <p className="text-xs text-emerald-100/85 leading-relaxed font-normal mt-0.5">
                      Active callouts for Dhaka, Chittagong, Sylhet, and flood-affected areas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card: Avatars & Social Proof with Real Volunteer Headshots */}
            <div className="mt-8 pt-6 border-t border-white/15 relative z-10">
              <div className="p-3.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {/* Overlapping Realistic Volunteer Portraits */}
                  <div className="flex items-center -space-x-2.5 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces"
                      alt="Volunteer"
                      className="w-8 h-8 rounded-full border-2 border-emerald-600 object-cover shadow-xs"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=faces"
                      alt="Volunteer"
                      className="w-8 h-8 rounded-full border-2 border-emerald-600 object-cover shadow-xs"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=faces"
                      alt="Volunteer"
                      className="w-8 h-8 rounded-full border-2 border-emerald-600 object-cover shadow-xs"
                    />
                    <div className="w-8 h-8 rounded-full bg-emerald-800 border-2 border-emerald-600 flex items-center justify-center text-[10px] font-bold text-white shadow-xs">
                      +14k
                    </div>
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-white tracking-tight">Trusted by 14,200+ volunteers</p>
                    <p className="text-emerald-100/80 text-[11px]">Active in 64 districts across Bangladesh</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-emerald-200 text-xs font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>4.9</span>
                </div>
              </div>
            </div>

            {/* Subtle Decorative Ambient Glows */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-emerald-950/30 blur-2xl pointer-events-none" />
          </div>

          {/* =============================================================
              RIGHT COLUMN: Professional Theme-Adaptive Form Card
             ============================================================= */}
          <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#0f1722] border border-slate-200/90 dark:border-slate-800 p-8 sm:p-10 flex flex-col justify-between shadow-xl shadow-slate-200/50 dark:shadow-2xl transition-colors duration-250 space-y-6">
            
            <div className="space-y-6">
              {/* Badge: Free Volunteer Account */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>100% Free Volunteer Account</span>
              </div>

              {/* Title & Subtitle */}
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {step === 1 ? 'Create your profile' : 'Interests & community setup'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  {step === 1
                    ? 'Tell us about yourself. Once registered, we’ll set up your CivicPulse account and give you full access to upcoming drives.'
                    : 'Choose your district and primary volunteer initiatives so we can show relevant drives near you.'}
                </p>
              </div>

              {/* Multi-Step Indicator with clean linear progress */}
              <div className="flex items-center gap-3 pt-1">
                {/* Step 1 Pill */}
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step >= 1
                        ? 'bg-emerald-600 text-white shadow-xs ring-4 ring-emerald-500/15'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {step > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : '1'}
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-semibold ${
                        step === 1
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      Your details
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Personal information</span>
                  </div>
                </div>

                {/* Connecting Line */}
                <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-800 relative overflow-hidden rounded-full">
                  <div
                    className={`h-full bg-emerald-600 transition-all duration-300 ${
                      step === 2 ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>

                {/* Step 2 Pill */}
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      step === 2
                        ? 'bg-emerald-600 text-white shadow-xs ring-4 ring-emerald-500/15'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    2
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`text-xs font-semibold ${
                        step === 2
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      Community setup
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">Area &amp; causes</span>
                  </div>
                </div>
              </div>

              {/* =========================================================
                  STEP 1 FORM: Your Details
                 ========================================================= */}
              {step === 1 && (
                <div className="space-y-5 pt-2">
                  {/* 1-Click Fast Track: Sign up with Google */}
                  <div className="space-y-3.5">
                    <button
                      type="button"
                      onClick={() => {
                        window.location.href = '/api/auth/google/login';
                      }}
                      className="w-full py-3 px-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-sm flex items-center justify-center gap-3 transition-all shadow-xs hover:shadow-md cursor-pointer group"
                    >
                      <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </button>

                    {/* Modern SaaS Divider */}
                    <div className="relative flex items-center justify-center">
                      <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                      <span className="bg-white dark:bg-[#0f1722] px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider select-none">
                        or register with email
                      </span>
                      <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                    </div>
                  </div>

                  {/* Manual Registration Form */}
                  <form onSubmit={handleStep1Next} className="space-y-4">
                    {/* Row 1: Your Name & Your Designation */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Your name *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Rahim Uddin"
                            required
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Your designation *
                        </label>
                        <div className="relative">
                          <Briefcase className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                            placeholder="e.g. Volunteer Lead, Student"
                            required
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Work Email & Phone Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Work / Personal email *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@domain.com"
                            required
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                          Phone number <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                        </label>
                        <div className="flex rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/80 overflow-hidden focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all shadow-xs">
                          <span className="px-3 py-2.5 bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold border-r border-slate-200 dark:border-slate-700 flex items-center gap-1.5 select-none shrink-0">
                            <span>🇧🇩</span>
                            <span>+880</span>
                          </span>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="01712-345678"
                            className="w-full px-3.5 py-2.5 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none font-normal"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Password with Show/Hide Toggle */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Account Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/80 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-1 cursor-pointer"
                          tabIndex={-1}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password Criteria Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-2.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                            hasMinLength
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60'
                          }`}
                        >
                          <CheckCircle2 className={`w-3 h-3 ${hasMinLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                          6+ characters
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                            hasUpperCase
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60'
                          }`}
                        >
                          <CheckCircle2 className={`w-3 h-3 ${hasUpperCase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                          1 Uppercase (A-Z)
                        </span>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                            hasLowerCase
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60'
                          }`}
                        >
                          <CheckCircle2 className={`w-3 h-3 ${hasLowerCase ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                          1 Lowercase (a-z)
                        </span>
                      </div>
                    </div>

                    {/* Primary Submit Button */}
                    <button
                      type="submit"
                      className="w-full btn-magnetic btn-steel-primary py-3.5 px-6 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                      <span>Next: Community details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* =========================================================
                  STEP 2 FORM: Community Setup (Districts & Causes)
                 ========================================================= */}
              {step === 2 && (
                <form onSubmit={handleFinalSubmit} className="space-y-5 pt-2 animate-in fade-in duration-200">
                  {/* Select District / Area */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Primary District / Area in Bangladesh *</span>
                    </label>
                    <div className="relative">
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 appearance-none cursor-pointer shadow-xs transition-all"
                      >
                        {BD_DISTRICTS.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Optional Profile Photo URL */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Profile Avatar URL</span>
                      <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="https://images.unsplash.com/... (optional)"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 shadow-xs transition-all"
                    />
                  </div>

                  {/* Causes you want to volunteer for */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Select Social Causes You Care About</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {CAUSES.map((cause) => {
                        const isChecked = selectedCauses.includes(cause);
                        return (
                          <button
                            key={cause}
                            type="button"
                            onClick={() => toggleCause(cause)}
                            className={`p-3 rounded-xl text-xs font-medium text-left flex items-center gap-2.5 border transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-100 shadow-sm ring-1 ring-emerald-500/20'
                                : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] shrink-0 border transition-colors ${
                                isChecked
                                  ? 'bg-emerald-600 border-emerald-600 text-white font-bold'
                                  : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800'
                              }`}
                            >
                              {isChecked && '✓'}
                            </div>
                            <span className="truncate">{cause}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Buttons: Back and Complete */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 btn-magnetic btn-steel-primary py-3.5 px-6 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Complete Registration</span>
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Footer: Already have an account? Sign in */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 text-center text-xs text-slate-500 dark:text-slate-400">
              Already have a CivicPulse account?{' '}
              <Link
                href="/login"
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-colors ml-1"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Completion Light & Tree Celebration Modal */}
      <CivicAuthLightModal isOpen={isCompleted} mode="login" userName={name || 'Volunteer'} />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-[#070b12] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
