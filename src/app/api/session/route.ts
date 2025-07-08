import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  if (!auth) {
    return NextResponse.json({ success: false, error: 'Auth service not configured.' }, { status: 500 });
  }
  try {
    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ success: false, error: 'Missing idToken.' }, { status: 400 });
    }
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 días
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    const response = NextResponse.json({ success: true });
    response.cookies.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('Failed to create session:', error);
    return NextResponse.json({ success: false, error: 'Failed to create session.' }, { status: 500 });
  }
} 