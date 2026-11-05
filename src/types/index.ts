export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  photoURL?: string;
  bio?: string;
  phone?: string;
  location?: string;
}

export interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: 'Cleanup' | 'Plantation' | 'Donation' | 'Healthcare' | 'Education' | 'Relief Aid' | 'Winter Drive' | 'Food Aid' | 'Other';
  thumbnail: string;
  location: string;
  eventDate: string;
  targetVolunteers: number;
  creatorEmail: string;
  creatorName: string;
  creatorPhoto?: string;
  attendeesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RSVPItem {
  _id: string;
  eventId: EventItem | string;
  eventTitle: string;
  eventThumbnail: string;
  eventLocation: string;
  eventType: string;
  eventDate: string;
  userEmail: string;
  userName: string;
  userPhoto?: string;
  joinedAt: string;
}

export interface Attendee {
  userEmail: string;
  userName: string;
  userPhoto?: string;
  joinedAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}
