import { NextResponse } from 'next/server';
import { findUserByEmail, signToken } from '@/server/store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Google account email is required.' },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          notRegistered: true,
          message: `The Google account (${email}) is not registered yet. Please create an account with this email first.`,
        },
        { status: 404 }
      );
    }

    const token = signToken(user);
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
      message: `Google Sign-in successful! Welcome back, ${user.name}.`,
      user: safeUser,
      token,
    });
  } catch (error: any) {
    console.error('Google Auth API Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Google authentication failed.' },
      { status: 500 }
    );
  }
}
