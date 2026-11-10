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
  Sparkles,
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
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-md space-y-8 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-visible">
        {/* Interactive Butterfly 3D Resting / Flying / Success / Failed Animation */}
        <ButterflyLoginFormAnimation
          state={butterflyState}
          onReset={() => setButterflyState('resting')}
        />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
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
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (butterflyState === 'failed') setButterflyState('resting');
                }}
                placeholder="name@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (butterflyState === 'failed') setButterflyState('resting');
                }}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-magnetic btn-steel-primary py-3 px-4 rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
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
          <div className="border-t border-gray-200 dark:border-gray-800 w-full" />
          <span className="bg-white dark:bg-gray-900 px-3 text-xs text-gray-500 dark:text-gray-400 font-medium uppercase">
            Or continue with
          </span>
          <div className="border-t border-gray-200 dark:border-gray-800 w-full" />
        </div>

        {/* Official Google Sign-In Button (Direct Google OAuth 2.0) */}
        <button
          type="button"
          onClick={() => {
            setButterflyState('success');
            setTimeout(() => {
              window.location.href = '/api/auth/google/login';
            }, 750);
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

        {/* Interactive Butterfly State Preview Bar */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80">
          <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-2 font-medium">
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Interactive Butterfly Animation:</span>
            </span>
            <span className="capitalize text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/50">
              State: {butterflyState}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setButterflyState('flying')}
              className={`py-1.5 px-1.5 rounded-lg font-medium transition-all text-center cursor-pointer ${
                butterflyState === 'flying'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              title="Butterflies fly gracefully around login card"
            >
              🦋 Fly
            </button>
            <button
              type="button"
              onClick={() => setButterflyState('resting')}
              className={`py-1.5 px-1.5 rounded-lg font-medium transition-all text-center cursor-pointer ${
                butterflyState === 'resting'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
              title="Butterflies rest gently on top edge of card"
            >
              🌿 Rest
            </button>
            <button
              type="button"
              onClick={() => setButterflyState('success')}
              className={`py-1.5 px-1.5 rounded-lg font-medium transition-all text-center cursor-pointer ${
                butterflyState === 'success'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
              }`}
              title="Simulate Login Success: Butterflies gracefully fly away off-screen"
            >
              ✨ Success
            </button>
            <button
              type="button"
              onClick={() => setButterflyState('failed')}
              className={`py-1.5 px-1.5 rounded-lg font-medium transition-all text-center cursor-pointer ${
                butterflyState === 'failed'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60'
              }`}
              title="Simulate Login Failed: Butterflies immediately vanish/dissolve"
            >
              💥 Failed
            </button>
          </div>
        </div>

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
