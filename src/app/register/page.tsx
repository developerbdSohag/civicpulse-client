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
  Lock,
  ArrowRight,
  Loader2,
  Check,
  AlertCircle,
  MapPin,
  Heart,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import GoogleAccountChooserModal from '@/components/auth/GoogleAccountChooserModal';

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
  const [photoURL, setPhotoURL] = useState('');

  // Step 2: Community Setup
  const [district, setDistrict] = useState(BD_DISTRICTS[0]);
  const [selectedCauses, setSelectedCauses] = useState<string[]>([CAUSES[0], CAUSES[1]]);

  const [loading, setLoading] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

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
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (_) {}
        toast.success(`🎉 Welcome to CivicPulse, ${name.trim()}! Your volunteer profile is ready.`);
        router.push('/events');
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
    <div className="min-h-screen bg-[#070b12] text-slate-100 py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Breadcrumb (Matching Image 1) */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-200 font-semibold">Sign up</span>
        </nav>

        {/* 2-Column Split Hero Registration Container (Matching Image 1) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          
          {/* =============================================================
              LEFT COLUMN: Vibrant Emerald Grid Card (built for Bangladesh)
             ============================================================= */}
          <div
            className="lg:col-span-5 rounded-3xl p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl border border-emerald-400/30 text-white"
            style={{
              background: 'linear-gradient(145deg, #10b981 0%, #059669 55%, #047857 100%)',
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                linear-gradient(145deg, #10b981 0%, #059669 55%, #047857 100%)
              `,
              backgroundSize: '28px 28px, 28px 28px, 100% 100%',
            }}
          >
            {/* Top Section */}
            <div className="space-y-6 relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
                <span>CivicPulse Bangladesh</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-white leading-[1.14] tracking-tight">
                Modern social action, relief & drives{' '}
                <span className="underline decoration-emerald-200/50 decoration-wavy decoration-2">
                  — built for Bangladesh.
                </span>
              </h1>

              {/* Sub-text */}
              <p className="text-emerald-50 text-sm sm:text-base leading-relaxed font-normal">
                Join passionate volunteers and grassroots leaders creating lasting social impact with warm winter clothes, food relief, and cleanups across 64 districts.
              </p>

              {/* Feature Points (Matching Image 1 Icons & Rows) */}
              <div className="space-y-4 pt-2">
                {/* Point 1 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-black/20 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Zap className="w-4 h-4 text-emerald-200" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Setup in under 10 seconds</h3>
                    <p className="text-xs text-emerald-100/90 leading-relaxed">
                      Instant volunteer onboarding ready to explore or host local initiatives.
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-black/20 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">100% Transparent & Safe</h3>
                    <p className="text-xs text-emerald-100/90 leading-relaxed">
                      Verified organizers, open attendee rosters, and zero platform fees.
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-black/20 backdrop-blur-sm border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Users className="w-4 h-4 text-emerald-200" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Local Bangladesh impact</h3>
                    <p className="text-xs text-emerald-100/90 leading-relaxed">
                      Active callouts for Dhaka, Chittagong, Sylhet, and flood-affected areas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card: Avatars & Social Proof (Matching Image 1) */}
            <div className="mt-8 pt-6 border-t border-white/20 relative z-10">
              <div className="p-3.5 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20 flex items-center gap-3.5">
                {/* Overlapping Colorful Dots / Avatars */}
                <div className="flex items-center -space-x-2 shrink-0">
                  <div className="w-7 h-7 rounded-full bg-amber-400 border-2 border-emerald-600 shadow-sm" />
                  <div className="w-7 h-7 rounded-full bg-rose-500 border-2 border-emerald-600 shadow-sm" />
                  <div className="w-7 h-7 rounded-full bg-teal-300 border-2 border-emerald-600 shadow-sm" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-white">Trusted by 14,200+ volunteers</p>
                  <p className="text-emerald-100 text-[11px]">across 25+ wards in Bangladesh</p>
                </div>
              </div>
            </div>

            {/* Subtle Decorative Gradient Circles in background */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-emerald-950/20 blur-2xl pointer-events-none" />
          </div>

          {/* =============================================================
              RIGHT COLUMN: Dark Workspace Setup Form Card (Matching Image 1)
             ============================================================= */}
          <div className="lg:col-span-7 rounded-3xl bg-[#0f1722] border border-slate-800 p-8 sm:p-10 flex flex-col justify-between shadow-2xl space-y-6">
            
            <div className="space-y-6">
              {/* Badge: Free Community Access */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Free Volunteer Account</span>
              </div>

              {/* Title & Subtitle (Matching Image 1) */}
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {step === 1 ? 'Create your profile' : 'Interests & community setup'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {step === 1
                    ? 'Tell us about yourself. Once registered, we’ll set up your CivicPulse account and give you full access to upcoming drives.'
                    : 'Choose your district and primary volunteer initiatives so we can show relevant drives near you.'}
                </p>
              </div>

              {/* Multi-Step Indicator (Matching Image 1) */}
              <div className="flex items-center gap-3 pt-1">
                {/* Step 1 Pill */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step >= 1 ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    1
                  </div>
                  <span className={`text-xs font-semibold ${step === 1 ? 'text-white' : 'text-slate-400'}`}>
                    Your details
                  </span>
                </div>

                {/* Connecting Line */}
                <div className={`flex-1 h-0.5 ${step === 2 ? 'bg-emerald-500' : 'bg-slate-800'} transition-colors`} />

                {/* Step 2 Pill */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      step === 2 ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    2
                  </div>
                  <span className={`text-xs font-semibold ${step === 2 ? 'text-white' : 'text-slate-400'}`}>
                    Community setup
                  </span>
                </div>
              </div>

              {/* =========================================================
                  STEP 1 FORM: Your Details (Matching Image 1 Field Layout)
                 ========================================================= */}
              {step === 1 && (
                <form onSubmit={handleStep1Next} className="space-y-4 pt-2">
                  {/* Row 1: Your Name & Your Designation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Rahim Uddin"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your designation *
                      </label>
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. Volunteer Lead, Coordinator"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 2: Work Email & Phone Number with BD +880 (Matching Image 1) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Work / Personal email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone
                      </label>
                      <div className="flex rounded-xl border border-slate-700 bg-slate-900/90 overflow-hidden focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                        <span className="px-3 py-2.5 bg-slate-800 text-slate-300 text-xs font-medium border-r border-slate-700 flex items-center gap-1 select-none shrink-0">
                          BD +880
                        </span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="1XXXXXXXXX"
                          className="w-full px-3 py-2.5 bg-transparent text-white placeholder:text-slate-500 text-sm focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Account Password *
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                      />
                    </div>

                    {/* Password criteria chips */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px]">
                      <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                        {hasMinLength ? <Check className="w-3 h-3 text-emerald-400" /> : '•'} 6+ characters
                      </span>
                      <span className={`flex items-center gap-1 ${hasUpperCase ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                        {hasUpperCase ? <Check className="w-3 h-3 text-emerald-400" /> : '•'} 1 Uppercase (A-Z)
                      </span>
                      <span className={`flex items-center gap-1 ${hasLowerCase ? 'text-emerald-400 font-semibold' : 'text-slate-500'}`}>
                        {hasLowerCase ? <Check className="w-3 h-3 text-emerald-400" /> : '•'} 1 Lowercase (a-z)
                      </span>
                    </div>
                  </div>

                  {/* Google 1-Click Option Section (Matching Image 1's auxiliary action box) */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="space-y-0.5 text-center sm:text-left">
                      <p className="text-xs font-bold text-white flex items-center gap-1.5 justify-center sm:justify-start">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Or 1-Click with Google</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Choose your Google account. No verification needed!
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setGoogleModalOpen(true)}
                      className="btn-magnetic btn-steel-secondary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                      <span>Sign in with Google</span>
                    </button>
                  </div>

                  {/* Primary Next Button (Matching Image 1: Green button "Next: Company details ->") */}
                  <button
                    type="submit"
                    className="w-full btn-magnetic btn-steel-primary py-3.5 px-6 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Next: Community details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* =========================================================
                  STEP 2 FORM: Community Setup (Districts & Causes)
                 ========================================================= */}
              {step === 2 && (
                <form onSubmit={handleFinalSubmit} className="space-y-5 pt-2 animate-in fade-in">
                  {/* Select District / Area */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Primary District / Area in Bangladesh *</span>
                    </label>
                    <div className="relative">
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 text-white text-sm focus:outline-none focus:border-emerald-500 appearance-none cursor-pointer"
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
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Profile Avatar URL <span className="text-slate-500 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="https://images.unsplash.com/... (optional)"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Causes you want to volunteer for */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Select Social Causes You Care About</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {CAUSES.map((cause) => {
                        const isChecked = selectedCauses.includes(cause);
                        return (
                          <button
                            key={cause}
                            type="button"
                            onClick={() => toggleCause(cause)}
                            className={`p-2.5 rounded-xl text-xs font-medium text-left flex items-center gap-2 border transition-all cursor-pointer ${
                              isChecked
                                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-sm'
                                : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] shrink-0 border ${
                                isChecked
                                  ? 'bg-emerald-500 border-emerald-500 text-black font-bold'
                                  : 'border-slate-700 bg-slate-800'
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
                      className="px-5 py-3.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-bold transition-colors cursor-pointer"
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

            {/* Bottom Footer: Already have an account? Sign in (Matching Image 1) */}
            <div className="pt-6 border-t border-slate-800/80 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-bold text-emerald-400 hover:text-emerald-300 hover:underline transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Google Account Chooser Modal (1-Click, No verification needed) */}
      <GoogleAccountChooserModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSuccessRedirect="/events"
      />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070b12] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
