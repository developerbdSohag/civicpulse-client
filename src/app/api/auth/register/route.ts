import { NextResponse } from 'next/server';
import { findUserByEmail, createUser, signToken } from '@/server/store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, photoURL, phone, location, bio } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide name, email, and password.' },
        { status: 400 }
      );
    }

    // Password validation rules: uppercase, lowercase, at least 6 characters
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }
    if (!/[A-Z]/.test(password)) {
      return NextResponse.json(
        { success: false, message: 'Password must contain at least one uppercase letter.' },
        { status: 400 }
      );
    }
    if (!/[a-z]/.test(password)) {
      return NextResponse.json(
        { success: false, message: 'Password must contain at least one lowercase letter.' },
        { status: 400 }
      );
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    const newUser = createUser({ name, email, password, photoURL, phone, location, bio });
    const token = signToken(newUser);

    const safeUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      photoURL: newUser.photoURL,
      bio: newUser.bio,
      phone: newUser.phone,
      location: newUser.location,
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully! Welcome to CivicPulse.',
        user: safeUser,
        token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to register account.' },
      { status: 500 }
    );
  }
}
