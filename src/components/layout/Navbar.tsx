'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import {
  HeartHandshake,
  Calendar,
  PlusCircle,
  FolderKanban,
  CheckCircle2,
  User as UserIcon,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    toast.success('Logged out successfully. See you next time!');
    router.push('/');
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Upcoming Events', href: '/events' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/85 dark:bg-gray-950/85 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
                Civic<span className="text-emerald-600 dark:text-emerald-400">Pulse</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                  Community
                </span>
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:block -mt-1 font-medium">
                Social Service & Humanitarian Action
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 font-semibold'
                    : 'text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100/70 dark:hover:bg-gray-900/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Section: Theme Toggle & Conditional Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </button>

            {/* Auth Condition */}
            {!user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-emerald-500/25 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Profile Picture with Tooltip & Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="group relative flex items-center gap-2 p-1 rounded-full border-2 border-emerald-500/30 hover:border-emerald-500 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    aria-expanded={dropdownOpen}
                    aria-label="User menu"
                  >
                    <Image
                      src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                      alt={user.name || 'User Avatar'}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                      style={{ width: '36px', height: '36px', borderRadius: '9999px', objectFit: 'cover' }}
                      unoptimized
                    />
                    <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />

                    {/* Tooltip on hover showing User's Display Name */}
                    <span className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 rounded-md bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow-lg whitespace-nowrap z-50">
                      {user.name}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl py-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                      {/* User Info Header */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Dropdown Links */}
                      <div className="py-1">
                        <Link
                          href="/create-event"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>Create Event</span>
                        </Link>

                        <Link
                          href="/manage-events"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          <FolderKanban className="w-4 h-4 text-indigo-500" />
                          <span>Manage Events</span>
                        </Link>

                        <Link
                          href="/joined-events"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4 text-teal-500" />
                          <span>Joined Events</span>
                        </Link>

                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        >
                          <UserIcon className="w-4 h-4 text-amber-500" />
                          <span>My Profile</span>
                        </Link>
                      </div>

                      {/* Logout Action in Dropdown */}
                      <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Standalone Logout Button */}
                <button
                  onClick={handleLogout}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1.5"
                  title="Log out of your account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 pt-3 pb-6 space-y-3">
          {user && (
            <div className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-xl mb-3">
              <Image
                src={user.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                alt={user.name || 'User'}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover shrink-0"
                style={{ width: '40px', height: '40px', borderRadius: '9999px', objectFit: 'cover' }}
                unoptimized
              />
              <div className="truncate">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  isActive(link.href)
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 font-semibold'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {user && (
              <>
                <Link
                  href="/create-event"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-600" />
                  Create Event
                </Link>
                <Link
                  href="/manage-events"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600"
                >
                  <FolderKanban className="w-4 h-4 text-indigo-500" />
                  Manage Events
                </Link>
                <Link
                  href="/joined-events"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-500" />
                  Joined Events
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-emerald-600"
                >
                  <UserIcon className="w-4 h-4 text-amber-500" />
                  My Profile
                </Link>
              </>
            )}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  {theme === 'light' ? (
                    <Moon className="w-4 h-4 text-gray-600" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-400" />
                  )}
                  <span>Appearance</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300">
                  {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
            {!user ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-red-300 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
