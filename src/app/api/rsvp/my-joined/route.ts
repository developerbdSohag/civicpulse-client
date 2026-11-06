import { NextResponse } from 'next/server';
import { getUserRSVPs, verifyAuthToken } from '@/server/store';

export async function GET(req: Request) {
  try {
    const auth = verifyAuthToken(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const joinedEvents = getUserRSVPs(auth.email);

    return NextResponse.json({
      success: true,
      count: joinedEvents.length,
      joinedEvents,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch joined events.' },
      { status: 500 }
    );
  }
}
