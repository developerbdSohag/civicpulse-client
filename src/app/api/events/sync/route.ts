import { NextResponse } from 'next/server';
import { syncEvents } from '@/server/store';
import { EventItem } from '@/types';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const incoming: EventItem[] = Array.isArray(body?.events) ? body.events : [];

    if (incoming.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    const updatedEvents = syncEvents(incoming);

    return NextResponse.json({
      success: true,
      message: 'Community events synchronized successfully.',
      count: updatedEvents.length,
    });
  } catch (error: any) {
    console.error('Events Sync API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to synchronize events.' },
      { status: 500 }
    );
  }
}
