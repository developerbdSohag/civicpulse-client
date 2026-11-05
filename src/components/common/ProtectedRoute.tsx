'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect once loading has completely finished checking stored token
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, loading, router, pathname]);

  // If still hydrating/loading auth state, render high quality skeleton loader rather than bouncing to login
  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 animate-spin">
          <Loader2 className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          Verifying session credentials...
        </p>
      </div>
    );
  }

  // If not logged in and not loading, render null while redirect finishes
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
