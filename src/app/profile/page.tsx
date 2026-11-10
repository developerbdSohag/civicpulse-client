'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { profileAPI } from '@/lib/api';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { ProfileSkeleton } from '@/components/common/LoadingSkeleton';
import UserAvatar from '@/components/common/UserAvatar';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Save,
  CheckCircle2,
  FolderKanban,
  Edit,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  Camera,
  Upload,
  RefreshCw,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react';
import { toast } from 'sonner';

const AVATAR_PRESETS = [
  {
    name: 'Volunteer 1',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Volunteer 2',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Volunteer 3',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Volunteer 4',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Volunteer 5',
    url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Volunteer 6',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  },
];

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [stats, setStats] = useState({ createdEvents: 0, joinedEvents: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 2.5 * 1024 * 1024) {
      toast.error('Image size should be under 2.5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPhotoURL(dataUrl);
      toast.success('New photo loaded! Click "Save Profile Changes" below to save.');
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);

        // Preload any local vault data for instant responsiveness
        if (user?.email) {
          try {
            const vaultStr = localStorage.getItem(`civicpulse_vault_${user.email.toLowerCase()}`);
            if (vaultStr) {
              const vault = JSON.parse(vaultStr);
              if (vault.name) setName(vault.name);
              if (vault.photoURL) setPhotoURL(vault.photoURL);
              if (vault.bio) setBio(vault.bio);
              if (vault.phone) setPhone(vault.phone);
              if (vault.location) setLocation(vault.location);
            }
          } catch (_) {}
        }

        const res = await profileAPI.getMe();
        if (res.success && res.user) {
          let mergedUser = res.user;

          // Merge with persistent vault if server fields are blank (e.g. after fresh Google sign-in)
          if (user?.email) {
            try {
              const vaultStr = localStorage.getItem(`civicpulse_vault_${user.email.toLowerCase()}`);
              if (vaultStr) {
                const vault = JSON.parse(vaultStr);
                const hasLocalCustomizations =
                  (!mergedUser.phone && vault.phone) ||
                  (!mergedUser.bio && vault.bio) ||
                  (!mergedUser.location && vault.location) ||
                  (vault.name && vault.name !== mergedUser.name);

                mergedUser = {
                  ...mergedUser,
                  name: vault.name || mergedUser.name || '',
                  photoURL: vault.photoURL || mergedUser.photoURL || '',
                  bio: vault.bio || mergedUser.bio || '',
                  phone: vault.phone || mergedUser.phone || '',
                  location: vault.location || mergedUser.location || '',
                };

                // Auto-sync client vault to server to keep database synchronized
                if (hasLocalCustomizations) {
                  profileAPI
                    .update({
                      name: mergedUser.name,
                      photoURL: mergedUser.photoURL,
                      bio: mergedUser.bio,
                      phone: mergedUser.phone,
                      location: mergedUser.location,
                    })
                    .catch(() => {});
                }
              }
            } catch (_) {}
          }

          setName(mergedUser.name || '');
          setPhotoURL(mergedUser.photoURL || '');
          setBio(mergedUser.bio || '');
          setPhone(mergedUser.phone || '');
          setLocation(mergedUser.location || '');
          if (res.stats) {
            setStats(res.stats);
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadProfile();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Name cannot be empty.');
      return;
    }

    const payload = {
      name: name.trim(),
      photoURL: photoURL.trim(),
      bio: bio.trim(),
      phone: phone.trim(),
      location: location.trim(),
    };

    try {
      setSaving(true);
      const res = await profileAPI.update(payload);

      if (res.success && res.user) {
        updateUser(res.user);
        if ((res as any).token) {
          localStorage.setItem('civicpulse_token', (res as any).token);
        }
        if (res.user.email) {
          try {
            localStorage.setItem(`civicpulse_vault_${res.user.email.toLowerCase()}`, JSON.stringify(res.user));
          } catch (_) {}
        }
        toast.success(res.message || 'Profile updated successfully!');
      } else {
        toast.error(res.message || 'Failed to update profile.');
      }
    } catch (err: any) {
      // Graceful fallback: save locally so user edits are NEVER lost
      if (user?.email) {
        const localUpdated = { ...user, ...payload };
        updateUser(localUpdated);
        try {
          localStorage.setItem(`civicpulse_vault_${user.email.toLowerCase()}`, JSON.stringify(localUpdated));
        } catch (_) {}
        toast.success('Profile saved securely to your device!');
      } else {
        toast.error(err.message || 'Error updating profile.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      toast.error('Please enter your new password.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long.');
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      toast.error('New password must contain at least one uppercase letter (A-Z).');
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      toast.error('New password must contain at least one lowercase letter (a-z).');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match. Please verify.');
      return;
    }

    try {
      setChangingPassword(true);
      const res = await profileAPI.changePassword({
        currentPassword: currentPassword.trim(),
        newPassword: newPassword.trim(),
      });

      if (res.success) {
        toast.success(res.message || 'Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.message || 'Failed to change password.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password.');
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
        
        {/* Header */}
        <div className="pb-6 border-b border-gray-200 dark:border-gray-800 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            <UserIcon className="w-3.5 h-3.5" />
            <span>Volunteer Identity</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            My Profile & Impact Stats
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            View your community contributions, update your display details, and manage your volunteer bio.
          </p>
        </div>

        {loading ? (
          <ProfileSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Left Column: Profile Card & Stats */}
            <div className="md:col-span-5 space-y-6">
              
              {/* Profile Overview Card */}
              <div className="p-6 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm text-center space-y-4">
                <div className="relative inline-block mx-auto">
                  <UserAvatar
                    src={photoURL || user?.photoURL}
                    name={name || user?.name}
                    size={100}
                    className="border-4 border-emerald-500 shadow-lg ring-4 ring-emerald-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload photo from device"
                    className="absolute -bottom-1 -right-1 p-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-md ring-2 ring-white dark:ring-gray-900 transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {name || user?.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 italic px-2">
                  &quot;{bio || 'Community volunteer passionate about making local impact.'}&quot;
                </p>

                <div className="pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2 text-xs text-left text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{location || 'Dhaka, Bangladesh'}</span>
                  </div>
                  {phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{user?.email}</span>
                  </div>
                </div>
              </div>

              {/* Participation Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/30 text-center">
                  <FolderKanban className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                  <p className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-300">
                    {stats.createdEvents}
                  </p>
                  <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    Events Organized
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-teal-200 dark:border-teal-900/50 bg-teal-50/60 dark:bg-teal-950/30 text-center">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-1" />
                  <p className="text-2xl font-extrabold text-teal-800 dark:text-teal-300">
                    {stats.joinedEvents}
                  </p>
                  <p className="text-[11px] font-semibold text-teal-700 dark:text-teal-400">
                    Events Joined
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Update Profile Form & Security */}
            <div className="md:col-span-7 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <Edit className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Edit Profile Details
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Display Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Profile Picture Option Section */}
                  <div className="space-y-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-emerald-600" />
                        Profile Picture Options
                      </label>
                      {photoURL && (
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoURL('');
                            toast.info('Switched to Initials Avatar style.');
                          }}
                          className="text-[11px] text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 font-medium underline cursor-pointer"
                        >
                          Use Initials
                        </button>
                      )}
                    </div>

                    {/* Direct Upload Button */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Photo from Device</span>
                      </button>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        PNG, JPG, or WEBP (up to 2.5MB)
                      </span>
                    </div>

                    {/* Quick Avatar Presets */}
                    <div className="pt-2">
                      <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Or pick a verified volunteer portrait:
                      </p>
                      <div className="grid grid-cols-6 gap-2">
                        {AVATAR_PRESETS.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setPhotoURL(preset.url);
                              toast.success(`Selected ${preset.name}`);
                            }}
                            className={`relative h-11 w-11 rounded-full overflow-hidden border-2 transition-all cursor-pointer mx-auto ${
                              photoURL === preset.url
                                ? 'border-emerald-500 ring-2 ring-emerald-400/40 scale-105 shadow-md'
                                : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300 dark:hover:border-gray-700'
                            }`}
                            title={preset.name}
                          >
                            <img
                              src={preset.url}
                              alt={preset.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom URL Input */}
                    <div className="pt-2 border-t border-gray-200/60 dark:border-gray-700/60">
                      <label className="block text-[11px] font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Or paste direct image URL:
                      </label>
                      <input
                        type="url"
                        value={photoURL}
                        onChange={(e) => setPhotoURL(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Volunteer Bio & Passions
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell the community about your volunteering interests (e.g. winter relief, teaching kids, environmental care)..."
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Phone & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+880 1712-XXXXXX"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Home City / Neighborhood
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Mirpur, Dhaka"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full btn-magnetic btn-steel-primary py-3.5 px-4 rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Profile Changes</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Change Password Card */}
              <div className="p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                      Change Password
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Update your account password with a strong, secure combination
                    </p>
                  </div>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {/* Current Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Current Password (if applicable)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password & Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        New Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min. 6 chars (A-Z, a-z)"
                          required
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          required
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Requirements Hint */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Password requirements: at least 6 characters, containing both uppercase (A-Z) and lowercase (a-z) letters.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="w-full btn-magnetic btn-steel-secondary py-3 px-4 rounded-xl text-sm font-bold shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {changingPassword ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
