import { NextResponse } from 'next/server';
import { updateUser, verifyAuthToken, findUserByIdOrToken, signToken } from '@/server/store';

export async function PUT(req: Request) {
  try {
    const auth = verifyAuthToken(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, photoURL, bio, phone, location } = body;

    // Self-healing user resolution: guaranteed to resolve or instantiate from verified token
    const user = findUserByIdOrToken(auth);

    const updates: any = {};
    if (name && name.trim()) updates.name = name.trim();
    if (photoURL !== undefined) updates.photoURL = photoURL.trim();
    if (bio !== undefined) updates.bio = bio.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (location !== undefined) updates.location = location.trim();

    const updated = updateUser(user.id, updates);
    const finalUser = updated || user;

    // Issue refreshed token containing newly updated profile data
    const newToken = signToken(finalUser);

    const safeUser = {
      id: finalUser.id,
      name: finalUser.name,
      email: finalUser.email,
      photoURL: finalUser.photoURL,
      bio: finalUser.bio || '',
      phone: finalUser.phone || '',
      location: finalUser.location || '',
    };

    const response = NextResponse.json({
      success: true,
      message: 'Profile updated successfully!',
      user: safeUser,
      token: newToken,
    });

    response.cookies.set('token', newToken, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });
    response.cookies.set('civicpulse_token', newToken, {
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
