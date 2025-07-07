import {NextRequest, NextResponse} from 'next/server';
import {initializeApp, getApps, cert} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';

try {
  if (!getApps().length) {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY!
    );
    initializeApp({
      credential: cert(serviceAccount),
    });
  }
} catch (error: any) {
  console.error('Firebase admin initialization error', error.stack);
}

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;

  // If no session cookie, redirect to login for admin pages, otherwise continue.
  if (!session) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Verify the session cookie. If invalid, redirect to login and clear the cookie.
  try {
    await getAuth().verifySessionCookie(session, true);
  } catch (error) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('session');
    return response;
  }

  // If the user is authenticated and visits the login page, redirect to the admin dashboard.
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// Force middleware to run on Node.js runtime.
export const runtime = 'nodejs';

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
