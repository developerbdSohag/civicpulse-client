'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  HeartHandshake,
  User,
  Mail,
  Image as ImageIcon,
  Lock,
  UserPlus,
  ArrowRight,
  Loader2,
  Check,
  AlertCircle,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';

function RegisterContent() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryEmail = searchParams.get('email') || '';
  const queryName = searchParams.get('name') || '';

  const [name, setName] = useState(queryName);
  const [email, setEmail] = useState(queryEmail);
  const [photoURL, setPhotoURL] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (queryEmail) setEmail(queryEmail);
    if (queryName) setName(queryName);
  }, [queryEmail, queryName]);

  // Dynamic Password Validation Checks
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    // Password validation rule strictly required
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

    setLoading(true);
    const result = await register(
      name.trim(),
      email.trim(),
      password,
      photoURL.trim() || undefined
    );
    setLoading(false);

    if (result.success) {
      toast.success(result.message || 'Account created successfully! Welcome to CivicPulse.');
      router.push('/events');
    } else {
      toast.error(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-7 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Create an Account
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Join thousands of volunteers organizing social change
          </p>
        </div>

        {/* Pre-filled Notice if redirected from Google login */}
        {queryEmail && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Setting up your account for <strong>{queryEmail}</strong>. Please choose your name and password to complete registration.
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Md. Salahuddin Sohag"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sohag@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Profile Photo URL (optional)
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
              Leave blank for a default avatar photo.
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters..."
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Live Password Criteria Visual Indicators */}
            <div className="mt-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-950/70 border border-gray-200 dark:border-gray-800 space-y-1.5 text-xs">
              <p className="font-semibold text-gray-600 dark:text-gray-400 text-[11px]">
                Password Requirements:
              </p>
              <div className="flex items-center gap-1.5">
                {hasMinLength ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                )}
                <span className={hasMinLength ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-gray-500'}>
                  At least 6 characters
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasUpperCase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                )}
                <span className={hasUpperCase ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-gray-500'}>
                  At least one uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasLowerCase ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                )}
                <span className={hasLowerCase ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-gray-500'}>
                  At least one lowercase letter (a-z)
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-magnetic btn-steel-primary py-3.5 px-4 rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Volunteer Account</span>
              </>
            )}
          </button>
        </form>

        {/* Redirect to Login Page */}
        <p className="text-center text-xs text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Log in instead</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
