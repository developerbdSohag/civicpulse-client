import { NextResponse } from 'next/server';
import { getEventsByCreator, verifyAuthToken } from '@/server/store';

export async function GET(req: Request) {
  try {
    const auth = verifyAuthToken(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const events = getEventsByCreator(auth.email);

    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch your organized events.' },
      { status: 500 }
    );
  }
}
