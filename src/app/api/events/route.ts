import { NextResponse } from 'next/server';
import { getUpcomingEvents, createEvent, verifyAuthToken, findUserById } from '@/server/store';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;
    const type = searchParams.get('type') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || 'date-asc';

    const { events, totalCount } = getUpcomingEvents({ limit, type, search, sort });

    return NextResponse.json({
      success: true,
      count: events.length,
      totalCount,
      events,
    });
  } catch (error: any) {
    console.error('Events GET API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch upcoming events.' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const auth = verifyAuthToken(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'You must be logged in to create an event.' },
        { status: 401 }
      );
    }

    const user = findUserById(auth.id);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    const body = await req.json();
    const { title, description, eventType, thumbnail, location, eventDate, targetVolunteers } = body;

    if (!title || !description || !eventType || !thumbnail || !location || !eventDate) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields.' },
        { status: 400 }
      );
    }

    const parsedDate = new Date(eventDate);
    if (isNaN(parsedDate.getTime()) || parsedDate.getTime() <= Date.now()) {
      return NextResponse.json(
        { success: false, message: 'Event date must be set to a future date.' },
        { status: 400 }
      );
    }

    const newEvent = createEvent({
      title,
      description,
      eventType,
      thumbnail,
      location,
      eventDate: parsedDate.toISOString(),
      targetVolunteers: targetVolunteers ? parseInt(targetVolunteers, 10) : 50,
      creatorEmail: user.email,
      creatorName: user.name,
      creatorPhoto: user.photoURL,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Community initiative created successfully!',
        event: newEvent,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Events POST API Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to create event.' },
      { status: 500 }
    );
  }
}
