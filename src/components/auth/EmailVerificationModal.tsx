'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle2, AlertCircle, Loader2, ArrowLeft, RefreshCw, Sparkles, X, ShieldCheck } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/navigation';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  name?: string;
  photoURL?: string;
  initialCode?: string; // Pre-populated if dispatched right before opening
  onSuccessRedirect?: string;
}

export default function EmailVerificationModal({
  isOpen,
  onClose,
  email,
  name,
  photoURL,
  initialCode,
  onSuccessRedirect = '/',
}: EmailVerificationModalProps) {
  const { handleAuthSuccess } = useAuth();
  const router = useRouter();

  // 6 digit array for individual input boxes
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(45);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dispatchedCode, setDispatchedCode] = useState<string | null>(initialCode || null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Update initial code when prop changes
  useEffect(() => {
    if (initialCode) {
      setDispatchedCode(initialCode);
    }
  }, [initialCode]);

  // Resend Countdown Timer
  useEffect(() => {
    if (!isOpen) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown, isOpen]);

  // Auto-focus first input on modal open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    } else {
      setDigits(['', '', '', '', '', '']);
      setErrorMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle single digit input
  const handleChange = (index: number, value: string) => {
    // Only accept numeric digit
    const cleaned = value.replace(/[^0-9]/g, '');
    if (!cleaned) {
      const updated = [...digits];
      updated[index] = '';
      setDigits(updated);
      return;
    }

    const lastChar = cleaned.slice(-1);
    const updated = [...digits];
    updated[index] = lastChar;
    setDigits(updated);
    setErrorMessage(null);

    // Auto-advance to next input
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else {
      // If 6th digit entered, auto submit if full
      const fullCode = updated.join('');
      if (fullCode.length === 6) {
        verifyCode(fullCode);
      }
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Handle paste full 6-digit code
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const updated = [...digits];
      for (let i = 0; i < 6; i++) {
        updated[i] = pasted[i] || '';
      }
      setDigits(updated);
      setErrorMessage(null);

      // Focus last filled or next empty
      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();

      if (pasted.length === 6) {
        verifyCode(pasted);
      }
    }
  };

  // Submit code to backend
  const verifyCode = async (codeToVerify?: string) => {
    const code = codeToVerify || digits.join('');
    if (code.length !== 6) {
      setErrorMessage('Please enter all 6 digits of your verification code.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await authAPI.verifyCode({
        email,
        code,
        name: name || email.split('@')[0],
        photoURL,
      });

      if (res.success && res.user && res.token) {
        // Trigger celebration confetti
        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (_) {}

        toast.success(`🎉 Email verified successfully! Welcome, ${res.user.name}.`);
        handleAuthSuccess(res.user, res.token);
        onClose();
        router.push(onSuccessRedirect);
      } else {
        setErrorMessage(res.message || 'Invalid verification code. Please check your mailbox.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend code request
  const handleResend = async () => {
    if (!canResend) return;
    setResending(true);
    setErrorMessage(null);

    try {
      const res = await authAPI.sendVerificationCode({
        email,
        name,
        photoURL,
      });

      if (res.success) {
        toast.success(`A fresh verification code has been dispatched to ${email}!`);
        if (res.code) {
          setDispatchedCode(res.code);
        }
        setCountdown(45);
        setCanResend(false);
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not resend code. Please try again later.');
    } finally {
      setResending(false);
    }
  };

  // Quick 1-click test fill helper
  const handleAutofillCode = () => {
    if (!dispatchedCode) return;
    const split = dispatchedCode.split('');
    setDigits(split);
    setErrorMessage(null);
    verifyCode(dispatchedCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
            <Mail className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Verify Your Email
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
            We sent a 6-digit verification code to:
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate max-w-[240px]">{email}</span>
          </div>
        </div>

        {/* Live Code Notification Banner (Guarantees zero lockout) */}
        {dispatchedCode && (
          <div className="p-3.5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800/70 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="font-bold">Code sent: </span>
                <span className="font-mono font-extrabold tracking-widest text-emerald-700 dark:text-emerald-300 text-sm">
                  {dispatchedCode}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutofillCode}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-xs cursor-pointer transition-all"
            >
              1-Click Fill
            </button>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 6 Digit Verification Input Box */}
        <div className="space-y-4">
          <label className="block text-center text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Enter 6-Digit Code
          </label>

          <div className="flex items-center justify-center gap-2 sm:gap-2.5">
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={loading}
                className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-extrabold rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/15 transition-all shadow-xs"
              />
            ))}
          </div>

          {/* Submit Verification Button */}
          <button
            type="button"
            onClick={() => verifyCode()}
            disabled={loading || digits.join('').length !== 6}
            className="w-full btn-magnetic btn-steel-primary py-3.5 px-4 rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Complete Registration</span>
              </>
            )}
          </button>
        </div>

        {/* Resend Code Section */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Didn&apos;t receive code?</span>
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${resending ? 'animate-spin' : ''}`} />
              <span>Resend Code</span>
            </button>
          ) : (
            <span className="font-medium text-gray-400 dark:text-gray-500">
              Resend in <strong className="text-gray-700 dark:text-gray-300 font-mono">{countdown}s</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
