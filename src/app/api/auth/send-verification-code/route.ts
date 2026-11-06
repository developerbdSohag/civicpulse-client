import { NextResponse } from 'next/server';
import { findUserByEmail, saveVerificationCode } from '@/server/store';
import { sendVerificationEmail } from '@/server/mailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, photoURL } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'A valid email address is required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user is already registered
    const existing = findUserByEmail(normalizedEmail);
    if (existing) {
      return NextResponse.json({
        success: false,
        isRegistered: true,
        message: `The email (${normalizedEmail}) is already registered! Please sign in with your password or 1-click Google login.`,
      });
    }

    const displayName = name || normalizedEmail.split('@')[0];

    // Generate & save 6-digit code in store
    const { code, expiresAt } = saveVerificationCode({
      email: normalizedEmail,
      name: displayName,
      photoURL,
    });

    // Send email (via SMTP if configured, or simulated)
    const mailResult = await sendVerificationEmail({
      toEmail: normalizedEmail,
      name: displayName,
      code,
    });

    return NextResponse.json({
      success: true,
      message: `A 6-digit verification code has been dispatched to ${normalizedEmail}.`,
      email: normalizedEmail,
      code, // returned so UI can present a simulated mailbox helper or 1-click test button
      expiresAt,
      deliveredVia: mailResult.deliveredVia,
    });
  } catch (error: any) {
    console.error('Send Verification Code Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to dispatch verification code.' },
      { status: 500 }
    );
  }
}
