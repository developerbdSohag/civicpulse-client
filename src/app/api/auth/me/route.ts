import { NextResponse } from 'next/server';
import { verifyAuthToken, findUserById } from '@/server/store';

export async function GET(req: Request) {
  try {
    const auth = verifyAuthToken(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const user = findUserById(auth.id);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      bio: user.bio,
      phone: user.phone,
      location: user.location,
    };

    return NextResponse.json({
      success: true,
      user: safeUser,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Authentication failed' }, { status: 500 });
  }
}
