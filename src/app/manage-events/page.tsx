'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { EventItem } from '@/types';
import { eventsAPI } from '@/lib/api';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { TableRowSkeleton } from '@/components/common/LoadingSkeleton';
import {
  FolderKanban,
  Edit3,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Plus,
  AlertTriangle,
  X,
  Check,
  Loader2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

const EVENT_TYPES = [
  'Donation',
  'Cleanup',
  'Plantation',
  'Healthcare',
  'Education',
  'Relief Aid',
  'Winter Drive',
  'Food Aid',
  'Other',
];

export default function ManageEventsPage() {
  const { user } = useAuth();

  const [myEvents, setMyEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    eventType: 'Donation',
    thumbnail: '',
    location: '',
    eventDate: '',
    targetVolunteers: 50,
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Modal State
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const res = await eventsAPI.getMyCreated();
      if (res.success && res.events) {
        const sorted = [...res.events].sort(
          (a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
        );
        setMyEvents(sorted);
      }
    } catch (err: any) {
      toast.error('Failed to load your organized events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyEvents();
    }
  }, [user]);

  // Open Edit Modal
  const openEditModal = (event: EventItem) => {
    setEditingEvent(event);
    
    // Format date for datetime-local
    const d = new Date(event.eventDate);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const formatted = d.toISOString().slice(0, 16);

    setEditForm({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      thumbnail: event.thumbnail,
      location: event.location,
      eventDate: formatted,
      targetVolunteers: event.targetVolunteers || 50,
    });
  };

  // Submit Update Event
  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    if (!editForm.title.trim() || editForm.title.length < 5) {
      toast.error('Title must be at least 5 characters.');
      return;
    }

    if (!editForm.description.trim() || editForm.description.length < 15) {
      toast.error('Description must be at least 15 characters.');
      return;
    }

    const chosenDate = new Date(editForm.eventDate);
    if (chosenDate <= new Date()) {
      toast.error('Updated date must be in the future. Past dates cannot be selected.');
      return;
    }

    try {
      setSavingEdit(true);
      const res = await eventsAPI.update(editingEvent._id, {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        eventType: editForm.eventType,
        thumbnail: editForm.thumbnail.trim(),
        location: editForm.location.trim(),
        eventDate: chosenDate.toISOString(),
        targetVolunteers: editForm.targetVolunteers,
      });

      if (res.success && res.event) {
        toast.success('Event updated successfully!');
        setMyEvents((prev) =>
          prev.map((item) => (item._id === editingEvent._id ? res.event : item))
        );
        setEditingEvent(null);
      } else {
        toast.error(res.message || 'Failed to update event.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating event.');
    } finally {
      setSavingEdit(false);
    }
  };

  // Submit Delete Event
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    try {
      setIsDeleting(true);
      const res = await eventsAPI.delete(deletingId);
      if (res.success) {
        toast.success('Event has been permanently deleted.');
        setMyEvents((prev) => prev.filter((item) => item._id !== deletingId));
        setDeletingId(null);
      } else {
        toast.error(res.message || 'Failed to delete event.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error deleting event.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-2">
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Organizer Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Manage Your Organized Events
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Update details or remove initiatives you have organized. Only you have permission to edit these events.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Host Another Event</span>
          </Link>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden shadow-sm">
            {[1, 2, 3, 4].map((n) => (
              <TableRowSkeleton key={n} />
            ))}
          </div>
        ) : myEvents.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900/50 space-y-4">
            <FolderKanban className="w-14 h-14 text-gray-400 mx-auto" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">You haven&apos;t created any events yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Ready to make a difference? Host a winter clothing distribution or a community lake cleanup today.
            </p>
            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Event</span>
            </Link>
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-800 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    <th className="py-3.5 px-4 sm:px-6">Event Details</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Event Date</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Volunteers</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {myEvents.map((evt) => (
                    <tr key={evt._id} className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
                      
                      {/* Title & Thumbnail */}
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <Image
                            src={evt.thumbnail}
                            alt={evt.title}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                            style={{ width: '48px', height: '48px', borderRadius: '0.75rem', objectFit: 'cover' }}
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/events/${evt._id}`}
                              className="font-bold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 line-clamp-1 flex items-center gap-1 group"
                            >
                              <span>{evt.title}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Published on {new Date(evt.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          {evt.eventType}
                        </span>
                      </td>

                      {/* Event Date */}
                      <td className="py-4 px-4 text-xs whitespace-nowrap text-gray-700 dark:text-gray-300 font-medium">
                        {new Date(evt.eventDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 text-xs text-gray-600 dark:text-gray-400 max-w-[180px] truncate">
                        {evt.location}
                      </td>

                      {/* Volunteers */}
                      <td className="py-4 px-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        {evt.attendeesCount} / {evt.targetVolunteers}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(evt)}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                            title="Edit Event"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingId(evt._id)}
                            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* EDIT EVENT MODAL */}
        {editingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 mb-6">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Update Event Information
                  </h3>
                </div>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Event Type *
                    </label>
                    <select
                      value={editForm.eventType}
                      onChange={(e) => setEditForm({ ...editForm, eventType: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {EVENT_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Target Volunteers
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={editForm.targetVolunteers}
                      onChange={(e) => setEditForm({ ...editForm, targetVolunteers: parseInt(e.target.value, 10) || 50 })}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Meeting Location *
                    </label>
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Event Date & Time (Future Only) *
                    </label>
                    <input
                      type="datetime-local"
                      value={editForm.eventDate}
                      onChange={(e) => setEditForm({ ...editForm, eventDate: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Thumbnail Image URL *
                  </label>
                  <input
                    type="url"
                    value={editForm.thumbnail}
                    onChange={(e) => setEditForm({ ...editForm, thumbnail: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Event Description *
                  </label>
                  <textarea
                    rows={4}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow flex items-center gap-2"
                  >
                    {savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* DELETE CONFIRMATION DIALOG */}
        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-2xl space-y-5 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Delete This Event?
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete this event? This action is permanent and will remove all attendee RSVPs from the database.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  disabled={isDeleting}
                  className="w-full py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  disabled={isDeleting}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow-md flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>Confirm Delete</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
