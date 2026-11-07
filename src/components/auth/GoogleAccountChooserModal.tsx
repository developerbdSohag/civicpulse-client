'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Loader2, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';

export interface GoogleAccount {
  name: string;
  email: string;
  photoURL?: string;
  avatarLetter?: string;
  avatarBg?: string;
}

const DEFAULT_BROWSER_ACCOUNTS: GoogleAccount[] = [
  {
    name: 'Md. Salahuddin Sohag',
    email: 'mdsalahuddinsohag218@gmail.com',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Sabrina Akter Nova',
    email: 'sabrinaakternova054@gmail.com',
    avatarLetter: 'S',
    avatarBg: 'bg-emerald-700',
  },
];

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRedirect?: string;
}

export default function GoogleAccountChooserModal({
  isOpen,
  onClose,
  onSuccessRedirect = '/',
}: GoogleAccountChooserModalProps) {
  const { googleLogin } = useAuth();
  const router = useRouter();

  const [accounts, setAccounts] = useState<GoogleAccount[]>(DEFAULT_BROWSER_ACCOUNTS);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // "Use another account" toggle & custom input
  const [showCustomInput, setShowCustomInput] = useState<boolean>(false);
  const [customEmail, setCustomEmail] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');

  // Load custom accounts stored in this browser
  useEffect(() => {
    try {
      const stored = localStorage.getItem('civicpulse_browser_google_accounts');
      if (stored) {
        const parsed: GoogleAccount[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge ensuring no duplicate emails
          const emailSet = new Set(DEFAULT_BROWSER_ACCOUNTS.map((a) => a.email.toLowerCase()));
          const extra = parsed.filter((a) => !emailSet.has(a.email.toLowerCase()));
          setAccounts([...DEFAULT_BROWSER_ACCOUNTS, ...extra]);
        }
      }
    } catch (_) {}
  }, []);

  if (!isOpen) return null;

  // Save new custom account into browser storage
  const saveAccountToBrowser = (newAcc: GoogleAccount) => {
    try {
      const existing = accounts.filter((a) => a.email.toLowerCase() !== newAcc.email.toLowerCase());
      const updated = [...existing, newAcc];
      setAccounts(updated);
      localStorage.setItem('civicpulse_browser_google_accounts', JSON.stringify(updated));
    } catch (_) {}
  };

  // Direct Google Sign-In & Sign-Up: 1-Click, No verification needed!
  const handleSelectAccount = async (account: GoogleAccount) => {
    setSelectedEmail(account.email);
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await googleLogin(account.email, account.name, account.photoURL);

      if (res.success && res.user) {
        // Trigger celebratory confetti
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch (_) {}

        toast.success(res.message || `Signed in with Google as ${account.name}!`);
        onClose();
        router.push(onSuccessRedirect);
      } else {
        setErrorMessage(res.message || 'Google sign-in could not be completed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google authentication failed.');
    } finally {
      setLoading(false);
      setSelectedEmail(null);
    }
  };

  // Submit custom account
  const handleCustomAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail) return;

    const email = customEmail.trim().toLowerCase();
    const name = customName.trim() || email.split('@')[0];
    const newAccount: GoogleAccount = {
      name,
      email,
      avatarLetter: name.charAt(0).toUpperCase(),
      avatarBg: 'bg-teal-700',
    };

    saveAccountToBrowser(newAccount);
    setShowCustomInput(false);
    setCustomEmail('');
    setCustomName('');
    handleSelectAccount(newAccount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-[440px] rounded-3xl bg-[#131314] text-white border border-neutral-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Top Bar: Google G logo + Sign in with Google */}
        <div className="px-7 pt-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
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
            <span className="text-xs font-medium text-neutral-300">
              Sign in with Google
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Header */}
        <div className="px-7 pt-2 pb-5">
          <h2 className="text-2xl font-normal text-neutral-100 tracking-tight">
            Choose an account
          </h2>
          <p className="text-sm text-neutral-400 mt-1">
            to continue to <span className="text-white font-medium">CivicPulse</span>
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mx-7 mb-3 p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Accounts List (Exact layout of Image 2) */}
        <div className="border-t border-neutral-800/80 divide-y divide-neutral-800/80">
          {accounts.map((acc) => {
            const isSelected = selectedEmail === acc.email && loading;
            return (
              <button
                key={acc.email}
                type="button"
                disabled={loading}
                onClick={() => handleSelectAccount(acc)}
                className="w-full px-7 py-3.5 flex items-center gap-4 hover:bg-neutral-800/50 active:bg-neutral-800 transition-colors text-left group cursor-pointer disabled:opacity-60"
              >
                {/* Account Avatar */}
                {acc.photoURL ? (
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-neutral-700">
                    <img
                      src={acc.photoURL}
                      alt={acc.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div
                    className={`w-10 h-10 rounded-full ${
                      acc.avatarBg || 'bg-emerald-700'
                    } text-white flex items-center justify-center text-sm font-semibold shrink-0`}
                  >
                    {acc.avatarLetter || acc.name.charAt(0)}
                  </div>
                )}

                {/* Account Name & Email */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-200 group-hover:text-white truncate">
                    {acc.name}
                  </p>
                  <p className="text-xs text-neutral-400 truncate">
                    {acc.email}
                  </p>
                </div>

                {/* Loading Spinner */}
                {isSelected && (
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
                )}
              </button>
            );
          })}

          {/* Use Another Account Option (Exact to Image 2) */}
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="w-full px-7 py-3.5 flex items-center gap-4 hover:bg-neutral-800/50 active:bg-neutral-800 transition-colors text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full border border-neutral-700 flex items-center justify-center text-neutral-300 group-hover:text-white shrink-0">
                <UserPlus className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-neutral-300 group-hover:text-white">
                Use another account
              </span>
            </button>
          ) : (
            /* Inline Custom Account Input */
            <form
              onSubmit={handleCustomAccountSubmit}
              className="p-5 bg-neutral-900/90 space-y-3 animate-in fade-in"
            >
              <div className="space-y-2">
                <label className="block text-xs font-medium text-neutral-300">
                  Enter your Google email address:
                </label>
                <input
                  type="email"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="e.g. name@gmail.com"
                  required
                  autoFocus
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Your Full Name (Optional)"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-700 bg-neutral-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Modal Footer Note */}
        <div className="px-7 py-4 bg-neutral-900/50 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Direct Google Authentication</span>
          </span>
          <span>English (US)</span>
        </div>
      </div>
    </div>
  );
}
