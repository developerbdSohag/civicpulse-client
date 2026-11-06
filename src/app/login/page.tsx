'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  X,
  AlertTriangle,
  UserCheck,
  UserPlus,
} from 'lucide-react';
import { toast } from 'sonner';

function LoginFormContent() {
  const { login, googleLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Google Sign-In Modal States
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [notRegisteredError, setNotRegisteredError] = useState<string | null>(null);
  const [savedGoogleEmail, setSavedGoogleEmail] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('civicpulse_last_google_email');
      if (saved) {
        setSavedGoogleEmail(saved);
        setGoogleEmail(saved);
      }
    } catch (e) {}
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both your email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success(result.message || 'Logged in successfully! Welcome back.');
      router.push(redirectUrl);
    } else {
      toast.error(result.message || 'Invalid email or password.');
    }
  };

  const handleExecuteGoogleLogin = async (targetEmail: string) => {
    const trimmed = targetEmail.trim().toLowerCase();
    if (!trimmed || !trimmed.includes('@')) {
      toast.error('Please enter a valid Google email address.');
      return;
    }

    setGoogleLoading(true);
    setNotRegisteredError(null);

    const result = await googleLogin(trimmed);
    setGoogleLoading(false);

    if (result.success) {
      try {
        localStorage.setItem('civicpulse_last_google_email', trimmed);
      } catch (e) {}
      toast.success(result.message || 'Signed in with Google successfully!');
      setGoogleModalOpen(false);
      router.push(redirectUrl);
    } else {
      if (result.notRegistered) {
        setNotRegisteredError(trimmed);
        toast.error('This email is not registered yet. Please register with your email ID first.');
      } else {
        toast.error(result.message || 'Google sign-in failed.');
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
        
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
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
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

        {/* Google Login Button */}
        <button
          type="button"
          onClick={() => {
            setNotRegisteredError(null);
            setGoogleModalOpen(true);
          }}
          className="w-full btn-magnetic btn-steel-secondary py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2.5 shadow-sm cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
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

      {/* GOOGLE SIGN-IN ACCOUNT CHOOSER MODAL */}
      {googleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Sign in with Google
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    to continue to CivicPulse
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setGoogleModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If user previously used an account, show 1-click select */}
            {savedGoogleEmail && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Previously Used Account
                </p>
                <button
                  type="button"
                  onClick={() => handleExecuteGoogleLogin(savedGoogleEmail)}
                  disabled={googleLoading}
                  className="w-full p-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 hover:border-emerald-500 dark:hover:border-emerald-500 flex items-center justify-between text-left transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {savedGoogleEmail.charAt(0).toUpperCase()}
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                        {savedGoogleEmail}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        Click to verify & sign in
                      </p>
                    </div>
                  </div>
                  <UserCheck className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 shrink-0" />
                </button>
              </div>
            )}

            {/* Enter Google Email Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteGoogleLogin(googleEmail);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Enter Your Google / Gmail Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={googleEmail}
                    onChange={(e) => {
                      setGoogleEmail(e.target.value);
                      if (notRegisteredError) setNotRegisteredError(null);
                    }}
                    placeholder="yourname@gmail.com"
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Not Registered Warning Box */}
              {notRegisteredError && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 space-y-2.5 text-left animate-in fade-in">
                  <div className="flex items-start gap-2.5 text-amber-800 dark:text-amber-300 text-xs font-medium">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <span>
                      The Google email <strong>{notRegisteredError}</strong> is not registered yet.
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400">
                    Please create your volunteer account first. Your email will be prefilled automatically.
                  </p>
                  <Link
                    href={`/register?email=${encodeURIComponent(notRegisteredError)}`}
                    onClick={() => setGoogleModalOpen(false)}
                    className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register Now with this Email</span>
                  </Link>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setGoogleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={googleLoading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {googleLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Checking Account...</span>
                    </>
                  ) : (
                    <span>Continue with Google</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
