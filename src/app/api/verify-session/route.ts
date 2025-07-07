import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  const session = request.cookies.get('session')?.value;

  if (!auth) {
    console.error("Auth service is not available for session verification.");
    return NextResponse.json({ valid: false, message: 'Authentication service not configured.' }, { status: 500 });
  }

  if (!session) {
    return NextResponse.json({ valid: false, message: 'No session provided' }, { status: 401 });
  }

  try {
    // Setting checkRevoked to true is important for security
    await auth.verifySessionCookie(session, true);
    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    // Session is invalid
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
