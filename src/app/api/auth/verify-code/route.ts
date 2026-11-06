import { NextResponse } from 'next/server';
import { verifyCode, findUserByEmail, createUser, signToken } from '@/server/store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, code, name, password, photoURL } = body;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify code
    const verification = verifyCode(normalizedEmail, code.toString().trim());
    if (!verification.valid) {
      return NextResponse.json(
        { success: false, message: verification.message || 'Invalid verification code.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = findUserByEmail(normalizedEmail);
    if (!user) {
      const finalName = name || verification.data?.name || normalizedEmail.split('@')[0];
      const finalPhoto = photoURL || verification.data?.photoURL;
      
      user = createUser({
        name: finalName,
        email: normalizedEmail,
        password: password || 'CivicPulse@Verified2026',
        photoURL: finalPhoto,
      });
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
      message: `Verification successful! Welcome to CivicPulse, ${user.name}.`,
      user: safeUser,
      token,
    });
  } catch (error: any) {
    console.error('Verify Code Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Verification failed.' },
      { status: 500 }
    );
  }
}
