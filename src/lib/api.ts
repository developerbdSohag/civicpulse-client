import { ApiResponse, EventItem, RSVPItem, User, Attendee } from '@/types';

const getBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes('trycloudflare.com')) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return '/api';
};

const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('civicpulse_token');
  }
  return null;
};

async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: 'Invalid response from server',
  }));

  if (!response.ok) {
    const error: any = new Error(data.message || `Request failed with status ${response.status}`);
    error.data = data;
    error.notRegistered = data.notRegistered;
    error.status = response.status;
    throw error;
  }

  return data;
}

export const authAPI = {
  register: (payload: { name: string; email: string; password: string; photoURL?: string }) =>
    apiRequest<{ success: boolean; message: string; user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    apiRequest<{ success: boolean; message: string; user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  googleAuth: (payload: { email: string }) =>
    apiRequest<{ success: boolean; message: string; user: User; token: string }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getMe: () =>
    apiRequest<{ success: boolean; user: User }>('/auth/me'),
};

export const eventsAPI = {
  getUpcoming: (params?: { limit?: number; type?: string; search?: string; sort?: string }) => {
    const query = new URLSearchParams();
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.type && params.type !== 'All') query.set('type', params.type);
    if (params?.search) query.set('search', params.search);
    if (params?.sort) query.set('sort', params.sort);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return apiRequest<{ success: boolean; count: number; totalCount: number; events: EventItem[] }>(
      `/events${queryString}`
    );
  },

  getById: (id: string) =>
    apiRequest<{ success: boolean; event: EventItem; hasJoined: boolean; attendees: Attendee[] }>(
      `/events/${id}`
    ),

  create: (payload: {
    title: string;
    description: string;
    eventType: string;
    thumbnail: string;
    location: string;
    eventDate: string;
    targetVolunteers?: number;
  }) =>
    apiRequest<{ success: boolean; message: string; event: EventItem }>('/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (
    id: string,
    payload: {
      title?: string;
      description?: string;
      eventType?: string;
      thumbnail?: string;
      location?: string;
      eventDate?: string;
      targetVolunteers?: number;
    }
  ) =>
    apiRequest<{ success: boolean; message: string; event: EventItem }>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  delete: (id: string) =>
    apiRequest<{ success: boolean; message: string }>(`/events/${id}`, {
      method: 'DELETE',
    }),

  getMyCreated: () =>
    apiRequest<{ success: boolean; count: number; events: EventItem[] }>('/events/manage/my-events'),
};

export const rsvpAPI = {
  join: (eventId: string) =>
    apiRequest<{ success: boolean; message: string; attendeesCount: number }>(`/rsvp/${eventId}`, {
      method: 'POST',
    }),

  leave: (eventId: string) =>
    apiRequest<{ success: boolean; message: string; attendeesCount: number }>(`/rsvp/${eventId}`, {
      method: 'DELETE',
    }),

  getMyJoined: () =>
    apiRequest<{ success: boolean; count: number; joinedEvents: RSVPItem[] }>('/rsvp/my-joined'),
};

export const profileAPI = {
  getMe: () =>
    apiRequest<{ success: boolean; user: User; stats: { createdEvents: number; joinedEvents: number } }>(
      '/profile/me'
    ),

  update: (payload: { name?: string; photoURL?: string; bio?: string; phone?: string; location?: string }) =>
    apiRequest<{ success: boolean; message: string; user: User }>('/profile/update', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};
