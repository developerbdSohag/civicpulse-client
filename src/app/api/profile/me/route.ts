import { NextResponse } from 'next/server';
import {
  findUserByIdOrToken,
  getEventsByCreator,
  getUserRSVPs,
  verifyAuthToken,
} from '@/server/store';

export async function GET(req: Request) {
  try {
    const auth = verifyAuthToken(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const user = findUserByIdOrToken(auth);

    const createdEvents = getEventsByCreator(user.email).length;
    const joinedEvents = getUserRSVPs(user.email).length;

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      bio: user.bio || '',
      phone: user.phone || '',
      location: user.location || '',
    };

    return NextResponse.json({
      success: true,
      user: safeUser,
      stats: {
        createdEvents,
        joinedEvents,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch profile details.' },
      { status: 500 }
    );
  }
}
