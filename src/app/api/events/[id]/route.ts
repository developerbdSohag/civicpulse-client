import { NextResponse } from 'next/server';
import {
  getEventById,
  updateEvent,
  deleteEvent,
  hasUserJoined,
  getEventAttendees,
  verifyAuthToken,
} from '@/server/store';

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const event = getEventById(id);

    if (!event) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }

    const auth = verifyAuthToken(req);
    const hasJoined = auth ? hasUserJoined(id, auth.email) : false;
    const attendees = getEventAttendees(id);

    return NextResponse.json({
      success: true,
      event,
      hasJoined,
      attendees,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch event details.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAuthToken(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await context.params;
    const existing = getEventById(id);
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Event not found.' }, { status: 404 });
    }

    if (existing.creatorEmail.toLowerCase() !== auth.email.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: 'You are only authorized to edit your own created events.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { title, description, eventType, thumbnail, location, eventDate, targetVolunteers } = body;

    const updates: any = {};
    if (title) updates.title = title;
    if (description) updates.description = description;
    if (eventType) updates.eventType = eventType;
    if (thumbnail) updates.thumbnail = thumbnail;
    if (location) updates.location = location;
    if (targetVolunteers) updates.targetVolunteers = parseInt(targetVolunteers, 10);
    if (eventDate) {
      const parsed = new Date(eventDate);
      if (isNaN(parsed.getTime()) || parsed.getTime() <= Date.now()) {
        return NextResponse.json(
          { success: false, message: 'Event date must be a valid future date.' },
          { status: 400 }
        );
      }
      updates.eventDate = parsed.toISOString();
    }

    const updated = updateEvent(id, updates);

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully!',
      event: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to update event.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAuthToken(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    const { id } = await context.params;
    const existing = getEventById(id);
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Event not found.' }, { status: 404 });
    }

    if (existing.creatorEmail.toLowerCase() !== auth.email.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: 'You are only authorized to delete your own created events.' },
        { status: 403 }
      );
    }

    deleteEvent(id);

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete event.' },
      { status: 500 }
    );
  }
}
