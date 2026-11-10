'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  HeartHandshake,
  Mail,
  Lock,
  LogIn,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import CivicAuthLightModal from '@/components/animations/CivicAuthLightModal';
import ButterflyLoginFormAnimation, {
  ButterflyState,
} from '@/components/animations/ButterflyLoginFormAnimation';

function LoginFormContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [butterflyState, setButterflyState] = useState<ButterflyState>('resting');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setButterflyState('failed');
      toast.error('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      setButterflyState('success');
      setShowLoginModal(true);
      toast.success(result.message || 'Logged in successfully! Welcome back.');
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1800);
    } else {
      setButterflyState('failed');
      toast.error(result.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* =====================================================================
          Soft Blurred Aurora Background Orbs (Shining Through the Frosted Glass)
          ===================================================================== */}
      {/* 1. Emerald/Teal Floating Radiance Orb (Top Left) */}
      <div className="absolute -top-32 -left-28 w-96 h-96 rounded-full bg-gradient-to-tr from-emerald-500/35 via-teal-400/25 to-transparent blur-[100px] animate-pulse pointer-events-none" />

      {/* 2. Cyan & Sky Blue Ambient Orb (Middle Right) */}
      <div className="absolute top-1/4 -right-28 w-[28rem] h-[28rem] rounded-full bg-gradient-to-bl from-cyan-400/30 via-sky-500/20 to-transparent blur-[120px] pointer-events-none" />

      {/* 3. Violet & Purple Depth Orb (Bottom Left) */}
      <div className="absolute -bottom-36 left-1/4 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-purple-600/25 via-indigo-500/20 to-emerald-400/15 blur-[130px] pointer-events-none" />

      {/* 4. Subtle Tactile Dot-Matrix Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(15,23,42,0.035)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Form Container & 3D Floating Elements */}
      <div className="relative w-full max-w-md">
        {/* 3D Floating Glass Badge 1 (Top Left) */}
        <div className="hidden sm:inline-flex absolute -left-10 -top-6 items-center gap-2 px-3.5 py-1.5 rounded-full glass-badge text-xs font-semibold text-gray-800 dark:text-gray-100 shadow-lg animate-float-gentle z-20 pointer-events-none select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-ping" />
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Verified Community</span>
        </div>

        {/* 3D Floating Glass Badge 2 (Bottom Right) */}
        <div
          className="hidden sm:inline-flex absolute -right-8 -bottom-5 items-center gap-2 px-3.5 py-1.5 rounded-full glass-badge text-xs font-semibold text-gray-800 dark:text-gray-100 shadow-lg animate-float-gentle z-20 pointer-events-none select-none"
          style={{ animationDelay: '1.6s' }}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <Users className="w-3.5 h-3.5 text-teal-500" />
          <span>2.4k+ Volunteers</span>
        </div>

        {/* =====================================================================
            Translucent Frosted-Glass Login Card
            ===================================================================== */}
        <div className="relative w-full space-y-7 glass-panel p-8 sm:p-10 rounded-3xl overflow-visible">
          {/* Light Glowing Top Specular Edge Highlight */}
          <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent pointer-events-none" />

          {/* Interactive Butterfly 3D Resting / Flying / Success / Failed Animation */}
          <ButterflyLoginFormAnimation
            state={butterflyState}
            onReset={() => setButterflyState('resting')}
          />

          {/* Header */}
          <div className="text-center space-y-2.5">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-[0_10px_25px_-5px_rgba(16,185,129,0.45)] border border-white/30 backdrop-blur-md">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 via-emerald-950 to-gray-900 dark:from-white dark:via-emerald-100 dark:to-white bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Sign in to organize and join community social events
            </p>
          </div>

          {/* Email & Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-emerald-500/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (butterflyState === 'failed') setButterflyState('resting');
                  }}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/80 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-emerald-500/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (butterflyState === 'failed') setButterflyState('resting');
                  }}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-400/80 transition-all"
                />
              </div>
            </div>

            {/* Glowing Glass Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.5)] border border-emerald-400/40 backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200/60 dark:border-white/10 w-full" />
            <span className="bg-transparent px-3 text-[11px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
              Or continue with
            </span>
            <div className="border-t border-gray-200/60 dark:border-white/10 w-full" />
          </div>

          {/* Official Google Sign-In Button (Frosted Glass) */}
          <button
            type="button"
            onClick={() => {
              setButterflyState('success');
              setTimeout(() => {
                window.location.href = '/api/auth/google/login';
              }, 750);
            }}
            className="w-full py-3 px-5 rounded-xl glass-input hover:bg-white/80 dark:hover:bg-white/[0.08] text-slate-800 dark:text-slate-100 font-semibold text-sm flex items-center justify-center gap-3 transition-all shadow-xs hover:shadow-md cursor-pointer group"
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

          {/* Redirect to Register Page */}
          <p className="text-center text-xs text-gray-600 dark:text-gray-400">
            Don&apos;t have an account yet?{' '}
            <Link
              href="/register"
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Register here</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>

      {/* Login Light Ignite Modal */}
      <CivicAuthLightModal isOpen={showLoginModal} mode="login" userName={email.split('@')[0] || 'Volunteer'} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
