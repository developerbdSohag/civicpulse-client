import { NextResponse } from 'next/server';
import { updateUser, verifyAuthToken } from '@/server/store';

export async function PUT(req: Request) {
  try {
    const auth = verifyAuthToken(req);
    if (!auth) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, photoURL, bio, phone, location } = body;

    const updates: any = {};
    if (name) updates.name = name;
    if (photoURL !== undefined) updates.photoURL = photoURL;
    if (bio !== undefined) updates.bio = bio;
    if (phone !== undefined) updates.phone = phone;
    if (location !== undefined) updates.location = location;

    const updated = updateUser(auth.id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const safeUser = {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      photoURL: updated.photoURL,
      bio: updated.bio || '',
      phone: updated.phone || '',
      location: updated.location || '',
    };

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully!',
      user: safeUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to update profile.' },
      { status: 500 }
    );
  }
}
