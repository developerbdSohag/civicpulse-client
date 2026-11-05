import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'CivicPulse — Social Development & Community Events Platform',
  description: 'A community-driven event management platform where citizens create, join, and track social service and humanitarian events in their local area.',
  keywords: ['community service', 'social development', 'events', 'volunteering', 'blanket distribution', 'tree plantation', 'cleanup'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function() {
              try {
                var saved = localStorage.getItem('civicpulse_theme');
                var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (saved === 'dark' || (!saved && prefersDark)) {
                  document.documentElement.classList.add('dark');
                  if (document.body) document.body.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  if (document.body) document.body.classList.remove('dark');
                }
              } catch (e) {}
            })();`,
          }}
        />
      </head>
      <body className="antialiased selection:bg-emerald-500 selection:text-white flex flex-col min-h-screen">
        <ThemeProvider>
          <AuthProvider>
            <Toaster position="top-right" richColors closeButton />
            <Suspense fallback={<div className="h-16 sm:h-20 border-b border-gray-200 dark:border-gray-800" />}>
              <Navbar />
            </Suspense>
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
