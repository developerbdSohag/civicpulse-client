import { NextResponse } from 'next/server';
import { joinEvent, leaveEvent, verifyAuthToken, findUserById } from '@/server/store';

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = verifyAuthToken(req);
    if (!auth) {
      return NextResponse.json(
        { success: false, message: 'You must be logged in to join an event.' },
        { status: 401 }
      );
    }

    const user = findUserById(auth.id);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    const { id } = await context.params;
    const result = joinEvent(id, {
      id: user.id,
      email: user.email,
      name: user.name,
      photoURL: user.photoURL,
    });

    return NextResponse.json({
      success: true,
      message: 'You have successfully joined this initiative!',
      attendeesCount: result.attendeesCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to join event.' },
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
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const result = leaveEvent(id, auth.email);

    return NextResponse.json({
      success: true,
      message: 'You have left this event.',
      attendeesCount: result.attendeesCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to cancel RSVP.' },
      { status: 500 }
    );
  }
}
