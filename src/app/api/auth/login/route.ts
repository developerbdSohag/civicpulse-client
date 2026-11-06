import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { findUserByEmail, signToken } from '@/server/store';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide both email and password.' },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);
    if (!user || !user.password) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password credentials.' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password credentials.' },
        { status: 401 }
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
      message: `Welcome back, ${user.name}!`,
      user: safeUser,
      token,
    });
  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Login failed.' },
      { status: 500 }
    );
  }
}
