import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { EventItem, RSVPItem, User, Attendee } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'civicpulse_jwt_secret_key_secure_2026_social_platform';

export interface StoredUser extends User {
  password?: string;
  createdAt: string;
}

export interface VerificationCode {
  email: string;
  code: string;
  name: string;
  photoURL?: string;
  expiresAt: number;
}

interface InMemoryStore {
  users: Map<string, StoredUser>;
  events: Map<string, EventItem>;
  rsvps: Map<string, RSVPItem>;
  verificationCodes: Map<string, VerificationCode>;
  initialized: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var __civicpulse_store__: InMemoryStore | undefined;
}

function getStore(): InMemoryStore {
  if (!global.__civicpulse_store__) {
    global.__civicpulse_store__ = {
      users: new Map(),
      events: new Map(),
      rsvps: new Map(),
      verificationCodes: new Map(),
      initialized: false,
    };
  }
  if (!global.__civicpulse_store__.verificationCodes) {
    global.__civicpulse_store__.verificationCodes = new Map();
  }
  return global.__civicpulse_store__;
}

export function initStore() {
  const store = getStore();
  if (store.initialized) return;

  const hashedPassword = bcrypt.hashSync('CivicPulse@2026', 10);

  // Seed Users
  const user1: StoredUser = {
    id: 'user_tahmina',
    _id: 'user_tahmina',
    name: 'Tahmina Rahman',
    email: 'organizer@civicpulse.org',
    password: hashedPassword,
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Passionate community advocate and grassroots volunteer coordinator in Dhaka.',
    location: 'Mirpur, Dhaka',
    phone: '+880 1712-345678',
    createdAt: new Date().toISOString(),
  };

  const user2: StoredUser = {
    id: 'user_volunteer',
    _id: 'user_volunteer',
    name: 'Demo Volunteer',
    email: 'volunteer@civicpulse.org',
    password: hashedPassword,
    photoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    bio: 'Ready to lend a helping hand for any local humanitarian cause.',
    location: 'Mohammadpur, Dhaka',
    phone: '+880 1819-987654',
    createdAt: new Date().toISOString(),
  };

  const user3: StoredUser = {
    id: 'user_sohag',
    _id: 'user_sohag',
    name: 'Md. Salahuddin Sohag',
    email: 'sohag@example.com',
    password: hashedPassword,
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Community development volunteer and lead organizer.',
    location: 'Dhaka, Bangladesh',
    phone: '+880 1711-223344',
    createdAt: new Date().toISOString(),
  };

  store.users.set(user1.id, user1);
  store.users.set(user2.id, user2);
  store.users.set(user3.id, user3);

  // Seed Events with future dates
  const now = new Date();
  const makeDate = (daysAhead: number) => {
    const d = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);
    d.setHours(10, 0, 0, 0);
    return d.toISOString();
  };

  const initialEvents: EventItem[] = [
    {
      _id: 'evt_1',
      title: 'Winter Clothes Distribution – Mirpur 10, Dhaka',
      description: 'Join us in bringing warmth to underprivileged families and street dwellers across Mirpur 10. We will sort, pack, and distribute winter jackets, thermal sweaters, and woolen caps. Every volunteer will be assigned to a designated zone with a team coordinator.',
      eventType: 'Donation',
      thumbnail: 'https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?auto=format&fit=crop&w=1200&q=80',
      location: 'Mirpur 10 Roundabout, Dhaka',
      eventDate: makeDate(4),
      targetVolunteers: 60,
      creatorEmail: 'organizer@civicpulse.org',
      creatorName: 'Tahmina Rahman',
      creatorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      attendeesCount: 28,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'evt_2',
      title: 'Blanket Distribution for the Needy – Mohammadpur, Dhaka',
      description: 'A community drive to distribute 1,000 thick winter blankets to impoverished rickshaw pullers, elderly citizens, and pavement dwellers around Mohammadpur Town Hall and Geneva Camp area. Volunteers assist with logistics, distribution tokens, and safe night-time handoffs.',
      eventType: 'Donation',
      thumbnail: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80',
      location: 'Mohammadpur Town Hall Ground, Dhaka',
      eventDate: makeDate(7),
      targetVolunteers: 45,
      creatorEmail: 'fahim.ahmed@civicpulse.org',
      creatorName: 'Fahim Ahmed',
      creatorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      attendeesCount: 35,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'evt_3',
      title: 'Clean Hatirjheel Mega Waterfront Cleanup – Dhaka',
      description: 'Help clean and restore the Hatirjheel lake walkways and shoreline. We will collect single-use plastics, install community recycling bins, and raise awareness among park visitors about urban biodiversity conservation. Protective gloves, bags, and refreshments are provided.',
      eventType: 'Cleanup',
      thumbnail: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80',
      location: 'Hatirjheel Amphitheatre Promenade, Dhaka',
      eventDate: makeDate(11),
      targetVolunteers: 80,
      creatorEmail: 'green.earth@civicpulse.org',
      creatorName: 'Sadia Chowdhury',
      creatorPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      attendeesCount: 52,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'evt_4',
      title: 'Urban Tree Plantation & Green Canopy Drive – Uttara Sector 11',
      description: 'Planting 500 indigenous fruit-bearing and shade trees along school perimeters, park verges, and neighborhood avenues in Uttara. Volunteers will dig sapling pits, plant neem, bokul, and mahogany saplings, and install protective bamboo tree guards.',
      eventType: 'Plantation',
      thumbnail: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
      location: 'Sector 11 Lake Park & Avenue 3, Uttara, Dhaka',
      eventDate: makeDate(14),
      targetVolunteers: 50,
      creatorEmail: 'organizer@civicpulse.org',
      creatorName: 'Tahmina Rahman',
      creatorPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      attendeesCount: 41,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'evt_5',
      title: 'Free Healthcare & Eye Screening Camp – Korail Community Center',
      description: 'Collaborating with volunteer doctors to provide general medical consultations, pediatric screenings, diabetes tests, and free prescription glasses for residents of Korail. Volunteers help with patient registration, crowd management, and medicine dispensary support.',
      eventType: 'Healthcare',
      thumbnail: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
      location: 'Korail Community Health Center, Mohakhali, Dhaka',
      eventDate: makeDate(18),
      targetVolunteers: 40,
      creatorEmail: 'dr.kazi@civicpulse.org',
      creatorName: 'Dr. Kazi Ariful Islam',
      creatorPhoto: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
      attendeesCount: 22,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'evt_6',
      title: 'Street Children Literacy Drive & Book Distribution – Farmgate',
      description: 'Promoting joyful learning and basic literacy for working and street-connected youth. We will distribute colorful notebooks, storybooks, stationery pouches, and host an interactive storytelling and drawing workshop for over 150 children.',
      eventType: 'Education',
      thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
      location: 'Ananda Cinema Hall Plaza & Overbridge, Farmgate, Dhaka',
      eventDate: makeDate(22),
      targetVolunteers: 35,
      creatorEmail: 'fahim.ahmed@civicpulse.org',
      creatorName: 'Fahim Ahmed',
      creatorPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      attendeesCount: 19,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'evt_7',
      title: 'Nutritious Food Packets for Daily Wage Earners – Old Dhaka',
      description: 'Preparing and handing out 800 freshly prepared warm meal packets and clean bottled water to daily wage laborers, rickshaw pullers, and destitute seniors across Sadarghat, Victoria Park, and Chawkbazar.',
      eventType: 'Donation',
      thumbnail: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80',
      location: 'Bahadur Shah Park, Sadarghat, Old Dhaka',
      eventDate: makeDate(26),
      targetVolunteers: 40,
      creatorEmail: 'green.earth@civicpulse.org',
      creatorName: 'Sadia Chowdhury',
      creatorPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      attendeesCount: 31,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      _id: 'evt_8',
      title: 'Emergency Flood Preparedness & First-Aid Workshop – Sylhet',
      description: 'Community training session on flood rescue preparedness, clean water purification tablet distribution, and basic emergency CPR. Open to college students and local youth leaders to build first-responder resilience.',
      eventType: 'Relief Aid',
      thumbnail: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1200&q=80',
      location: 'Sylhet Town Community Hall, Zindabazar, Sylhet',
      eventDate: makeDate(30),
      targetVolunteers: 50,
      creatorEmail: 'dr.kazi@civicpulse.org',
      creatorName: 'Dr. Kazi Ariful Islam',
      creatorPhoto: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
      attendeesCount: 26,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  for (const ev of initialEvents) {
    store.events.set(ev._id, ev);
  }

  // Pre-seed RSVP
  const rsvp1: RSVPItem = {
    _id: 'rsvp_1',
    eventId: 'evt_1',
    eventTitle: initialEvents[0].title,
    eventThumbnail: initialEvents[0].thumbnail,
    eventLocation: initialEvents[0].location,
    eventType: initialEvents[0].eventType,
    eventDate: initialEvents[0].eventDate,
    userEmail: user2.email,
    userName: user2.name,
    userPhoto: user2.photoURL,
    joinedAt: new Date().toISOString(),
  };

  store.rsvps.set(rsvp1._id, rsvp1);
  store.initialized = true;
}

// User Helpers
export function findUserByEmail(email: string): StoredUser | null {
  initStore();
  const store = getStore();
  const normalized = email.trim().toLowerCase();
  for (const user of store.users.values()) {
    if (user.email.toLowerCase() === normalized) {
      return user;
    }
  }
  return null;
}

export function findUserById(id: string): StoredUser | null {
  initStore();
  const store = getStore();
  return store.users.get(id) || null;
}

export function createUser(data: {
  name: string;
  email: string;
  password?: string;
  photoURL?: string;
  phone?: string;
  location?: string;
  bio?: string;
}): StoredUser {
  initStore();
  const store = getStore();
  const id = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const newUser: StoredUser = {
    id,
    _id: id,
    name: data.name,
    email: data.email.trim().toLowerCase(),
    password: data.password ? bcrypt.hashSync(data.password, 10) : undefined,
    photoURL: data.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(data.name)}`,
    bio: data.bio || '',
    phone: data.phone || '',
    location: data.location || '',
    createdAt: new Date().toISOString(),
  };
  store.users.set(id, newUser);
  return newUser;
}

export function updateUser(id: string, updates: Partial<StoredUser>): StoredUser | null {
  initStore();
  const store = getStore();
  const existing = store.users.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  store.users.set(id, updated);
  return updated;
}

// Verification Code Helpers
export function saveVerificationCode(data: { email: string; name?: string; photoURL?: string }): { code: string; expiresAt: number } {
  initStore();
  const store = getStore();
  // 6-digit random code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // Valid for 10 minutes
  const normalizedEmail = data.email.trim().toLowerCase();

  store.verificationCodes.set(normalizedEmail, {
    email: normalizedEmail,
    code,
    name: data.name || data.email.split('@')[0],
    photoURL: data.photoURL,
    expiresAt,
  });

  return { code, expiresAt };
}

export function verifyCode(email: string, code: string): { valid: boolean; message?: string; data?: VerificationCode } {
  initStore();
  const store = getStore();
  const normalizedEmail = email.trim().toLowerCase();
  const record = store.verificationCodes.get(normalizedEmail);

  if (!record) {
    return { valid: false, message: 'No verification code found for this email. Please request a new code.' };
  }
  if (Date.now() > record.expiresAt) {
    store.verificationCodes.delete(normalizedEmail);
    return { valid: false, message: 'Verification code has expired. Please request a new code.' };
  }
  if (record.code.trim() !== code.trim()) {
    return { valid: false, message: 'Incorrect verification code. Please check your mailbox and try again.' };
  }

  // Code verified! Remove to prevent reuse
  store.verificationCodes.delete(normalizedEmail);
  return { valid: true, data: record };
}

// Event Helpers
export function getUpcomingEvents(options: {
  limit?: number;
  type?: string;
  search?: string;
  sort?: string;
} = {}): { events: EventItem[]; totalCount: number } {
  initStore();
  const store = getStore();
  const now = new Date();

  let list = Array.from(store.events.values());

  // Filter future events only
  list = list.filter((e) => new Date(e.eventDate).getTime() >= now.getTime());

  // Category filter
  if (options.type && options.type !== 'All') {
    list = list.filter((e) => e.eventType.toLowerCase() === options.type!.toLowerCase());
  }

  // Search filter
  if (options.search && options.search.trim() !== '') {
    const q = options.search.trim().toLowerCase();
    list = list.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    );
  }

  // Strict date sorting: first date first come (ascending)
  list.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

  const totalCount = list.length;
  if (options.limit && options.limit > 0) {
    list = list.slice(0, options.limit);
  }

  return { events: list, totalCount };
}

export function getEventById(id: string): EventItem | null {
  initStore();
  const store = getStore();
  return store.events.get(id) || null;
}

export function createEvent(data: {
  title: string;
  description: string;
  eventType: any;
  thumbnail: string;
  location: string;
  eventDate: string;
  targetVolunteers?: number;
  creatorEmail: string;
  creatorName: string;
  creatorPhoto?: string;
}): EventItem {
  initStore();
  const store = getStore();
  const _id = 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const newEvent: EventItem = {
    _id,
    title: data.title,
    description: data.description,
    eventType: data.eventType,
    thumbnail: data.thumbnail,
    location: data.location,
    eventDate: data.eventDate,
    targetVolunteers: data.targetVolunteers || 50,
    creatorEmail: data.creatorEmail,
    creatorName: data.creatorName,
    creatorPhoto: data.creatorPhoto,
    attendeesCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store.events.set(_id, newEvent);
  return newEvent;
}

export function updateEvent(id: string, updates: Partial<EventItem>): EventItem | null {
  initStore();
  const store = getStore();
  const existing = store.events.get(id);
  if (!existing) return null;
  const updated: EventItem = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  store.events.set(id, updated);
  return updated;
}

export function deleteEvent(id: string): boolean {
  initStore();
  const store = getStore();
  const deleted = store.events.delete(id);
  if (deleted) {
    // Delete associated RSVPs
    for (const [rsvpId, rsvp] of store.rsvps.entries()) {
      const eId = typeof rsvp.eventId === 'string' ? rsvp.eventId : (rsvp.eventId as any)?._id;
      if (eId === id) {
        store.rsvps.delete(rsvpId);
      }
    }
  }
  return deleted;
}

export function getEventsByCreator(email: string): EventItem[] {
  initStore();
  const store = getStore();
  const normalized = email.trim().toLowerCase();
  const list = Array.from(store.events.values()).filter(
    (e) => e.creatorEmail.toLowerCase() === normalized
  );
  list.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  return list;
}

// RSVP Helpers
export function joinEvent(eventId: string, user: { id: string; email: string; name: string; photoURL?: string }): { success: boolean; attendeesCount: number } {
  initStore();
  const store = getStore();
  const event = store.events.get(eventId);
  if (!event) throw new Error('Event not found');

  // Check if already joined
  for (const rsvp of store.rsvps.values()) {
    const eId = typeof rsvp.eventId === 'string' ? rsvp.eventId : (rsvp.eventId as any)?._id;
    if (eId === eventId && rsvp.userEmail.toLowerCase() === user.email.toLowerCase()) {
      return { success: true, attendeesCount: event.attendeesCount };
    }
  }

  const rsvpId = 'rsvp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const newRSVP: RSVPItem = {
    _id: rsvpId,
    eventId: event,
    eventTitle: event.title,
    eventThumbnail: event.thumbnail,
    eventLocation: event.location,
    eventType: event.eventType,
    eventDate: event.eventDate,
    userEmail: user.email,
    userName: user.name,
    userPhoto: user.photoURL,
    joinedAt: new Date().toISOString(),
  };

  store.rsvps.set(rsvpId, newRSVP);
  event.attendeesCount += 1;
  store.events.set(eventId, event);

  return { success: true, attendeesCount: event.attendeesCount };
}

export function leaveEvent(eventId: string, userEmail: string): { success: boolean; attendeesCount: number } {
  initStore();
  const store = getStore();
  const event = store.events.get(eventId);
  if (!event) throw new Error('Event not found');

  let removed = false;
  for (const [id, rsvp] of store.rsvps.entries()) {
    const eId = typeof rsvp.eventId === 'string' ? rsvp.eventId : (rsvp.eventId as any)?._id;
    if (eId === eventId && rsvp.userEmail.toLowerCase() === userEmail.toLowerCase()) {
      store.rsvps.delete(id);
      removed = true;
      break;
    }
  }

  if (removed && event.attendeesCount > 0) {
    event.attendeesCount -= 1;
    store.events.set(eventId, event);
  }

  return { success: true, attendeesCount: event.attendeesCount };
}

export function getUserRSVPs(userEmail: string): RSVPItem[] {
  initStore();
  const store = getStore();
  const normalized = userEmail.trim().toLowerCase();
  const list = Array.from(store.rsvps.values()).filter(
    (r) => r.userEmail.toLowerCase() === normalized
  );

  // Re-link live event object if possible
  for (const r of list) {
    const eId = typeof r.eventId === 'string' ? r.eventId : (r.eventId as any)?._id;
    const liveEvent = store.events.get(eId);
    if (liveEvent) {
      r.eventId = liveEvent;
      r.eventDate = liveEvent.eventDate;
    }
  }

  // Sort ascending by event date
  list.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  return list;
}

export function getEventAttendees(eventId: string): Attendee[] {
  initStore();
  const store = getStore();
  const attendees: Attendee[] = [];
  for (const r of store.rsvps.values()) {
    const eId = typeof r.eventId === 'string' ? r.eventId : (rsvpIdMatch(r.eventId, eventId));
    if (eId === eventId) {
      attendees.push({
        userEmail: r.userEmail,
        userName: r.userName,
        userPhoto: r.userPhoto,
        joinedAt: r.joinedAt,
      });
    }
  }
  return attendees;
}

function rsvpIdMatch(ev: any, targetId: string): string {
  if (typeof ev === 'string') return ev;
  return ev?._id || '';
}

export function hasUserJoined(eventId: string, userEmail: string): boolean {
  initStore();
  const store = getStore();
  const normalized = userEmail.trim().toLowerCase();
  for (const r of store.rsvps.values()) {
    const eId = typeof r.eventId === 'string' ? r.eventId : (r.eventId as any)?._id;
    if (eId === eventId && r.userEmail.toLowerCase() === normalized) {
      return true;
    }
  }
  return false;
}

// Auth Helpers
export function signToken(user: StoredUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyAuthToken(req: Request): { id: string; email: string; name: string } | null {
  try {
    let token = '';
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else {
      const cookieHeader = req.headers.get('cookie') || '';
      const match = cookieHeader.match(/(?:civicpulse_token|token)=([^;]+)/);
      if (match) {
        token = decodeURIComponent(match[1]);
      }
    }

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return decoded;
  } catch (err) {
    return null;
  }
}
