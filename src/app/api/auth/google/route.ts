import { NextResponse } from 'next/server';
import { findUserByEmail, createUser, signToken } from '@/server/store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, photoURL } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Google account email is required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user = findUserByEmail(normalizedEmail);
    let isNewUser = false;

    // Direct Google Sign-In & Sign-Up: No verification needed!
    // If account is new, create it automatically and log in immediately.
    if (!user) {
      const displayName = name || normalizedEmail.split('@')[0];
      user = createUser({
        name: displayName,
        email: normalizedEmail,
        password: 'GoogleOAuthUser@CivicPulse2026',
        photoURL: photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
      });
      isNewUser = true;
    } else if (name && (!user.name || user.name.includes('@'))) {
      user.name = name;
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
      isNewUser,
      message: isNewUser
        ? `Welcome to CivicPulse, ${user.name}! Your account is ready.`
        : `Google Sign-in successful! Welcome back, ${user.name}.`,
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
