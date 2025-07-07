import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  const { session } = await request.json();

  if (!auth) {
    console.error("Auth service is not available for session verification.");
    return NextResponse.json({ message: 'Authentication service not configured.' }, { status: 500 });
  }

  if (!session) {
    return NextResponse.json({ message: 'No session provided' }, { status: 401 });
  }

  try {
    await auth.verifySessionCookie(session, true);
    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid session' }, { status: 401 });
  }
}
