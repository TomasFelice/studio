import { NextResponse, type NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Ensure Firebase Admin is initialized
if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY!
    );
    initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error: any) {
    console.error('Firebase Admin SDK initialization error in API route:', error.message);
  }
}

export async function POST(request: NextRequest) {
  const { session } = await request.json();

  if (!session) {
    return NextResponse.json({ message: 'No session provided' }, { status: 401 });
  }

  try {
    await getAuth().verifySessionCookie(session, true);
    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
  }
}
