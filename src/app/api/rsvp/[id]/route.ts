import { NextResponse } from 'next/server';
import { joinEvent, leaveEvent, verifyAuthToken, findUserByIdOrToken } from '@/server/store';

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

    const user = findUserByIdOrToken(auth);
    const { id } = await context.params;
    const result = joinEvent(id, {
      id: user.id || auth.id,
      email: user.email || auth.email,
      name: user.name || auth.name || 'Volunteer',
      photoURL: user.photoURL || auth.photoURL,
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
