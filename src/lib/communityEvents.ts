import { EventItem } from '@/types';

const COMMUNITY_EVENTS_KEY = 'civicpulse_community_events';
const DELETED_EVENTS_KEY = 'civicpulse_deleted_events';

/**
 * Retrieve all community-created/updated events from local persistent storage.
 */
export function getCommunityEvents(): EventItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMMUNITY_EVENTS_KEY);
    if (!raw) return [];
    const list: EventItem[] = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch (err) {
    console.error('Error reading community events:', err);
    return [];
  }
}

/**
 * Save or update a community event in local persistent storage.
 */
export function saveCommunityEvent(event: EventItem): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getCommunityEvents();
    const index = existing.findIndex((e) => e._id === event._id);
    if (index >= 0) {
      existing[index] = { ...existing[index], ...event, updatedAt: new Date().toISOString() };
    } else {
      existing.unshift({ ...event, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(COMMUNITY_EVENTS_KEY, JSON.stringify(existing));

    // Also remove from deleted set if it was previously marked deleted
    try {
      const deletedRaw = localStorage.getItem(DELETED_EVENTS_KEY);
      if (deletedRaw) {
        const deletedSet: string[] = JSON.parse(deletedRaw);
        const filtered = deletedSet.filter((id) => id !== event._id);
        localStorage.setItem(DELETED_EVENTS_KEY, JSON.stringify(filtered));
      }
    } catch (_) {}

    // Background sync to server so all other lambdas/workers get this event
    syncCommunityEventsToServer().catch(() => {});
  } catch (err) {
    console.error('Error saving community event:', err);
  }
}

/**
 * Mark a community event as deleted.
 */
export function removeCommunityEvent(eventId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getCommunityEvents().filter((e) => e._id !== eventId);
    localStorage.setItem(COMMUNITY_EVENTS_KEY, JSON.stringify(existing));

    // Track deleted IDs so they aren't resurrected from server seeds
    const deletedRaw = localStorage.getItem(DELETED_EVENTS_KEY);
    const deletedSet: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
    if (!deletedSet.includes(eventId)) {
      deletedSet.push(eventId);
      localStorage.setItem(DELETED_EVENTS_KEY, JSON.stringify(deletedSet));
    }
  } catch (err) {
    console.error('Error removing community event:', err);
  }
}

/**
 * Merge server events with locally created/updated community events.
 * Guarantees that any event created by User 1 will be visible to User 2 on the same or synced browser.
 */
export function mergeCommunityEvents(serverEvents: EventItem[]): EventItem[] {
  if (typeof window === 'undefined') return serverEvents;

  try {
    const communityList = getCommunityEvents();
    const deletedRaw = localStorage.getItem(DELETED_EVENTS_KEY);
    const deletedIds = new Set<string>(deletedRaw ? JSON.parse(deletedRaw) : []);

    const eventMap = new Map<string, EventItem>();

    // 1. Add server events (excluding any marked as deleted)
    for (const ev of serverEvents) {
      if (!deletedIds.has(ev._id)) {
        eventMap.set(ev._id, ev);
      }
    }

    // 2. Overlay / add community events
    for (const comm of communityList) {
      if (!deletedIds.has(comm._id)) {
        eventMap.set(comm._id, comm);
      }
    }

    const merged = Array.from(eventMap.values());

    // 3. Filter strictly for future events only
    const now = Date.now();
    const futureOnly = merged.filter((ev) => new Date(ev.eventDate).getTime() >= now);

    // 4. Sort ascending by event date (first date first come)
    futureOnly.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

    return futureOnly;
  } catch (err) {
    console.error('Error merging community events:', err);
    return serverEvents;
  }
}

/**
 * Sync all known community events to the server API so any other users/sessions can retrieve them.
 */
export async function syncCommunityEventsToServer(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const events = getCommunityEvents();
    if (events.length === 0) return;

    await fetch('/api/events/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
    }).catch(() => {});
  } catch (_) {}
}
