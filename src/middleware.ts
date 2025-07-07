
import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/firebase/admin';

// This is crucial to run firebase-admin in the middleware
export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const isTryingToAccessAdmin = request.nextUrl.pathname.startsWith('/admin');
  const isTryingToAccessLogin = request.nextUrl.pathname === '/login';

  // If there's no session cookie, handle redirection
  if (!session) {
    if (isTryingToAccessAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // If there is a session, verify it
  try {
    if (!auth) {
        throw new Error("Auth service is not configured on the server.");
    }
    await auth.verifySessionCookie(session, true);
    
    // Session is valid. If user is on login page, redirect to admin.
    if (isTryingToAccessLogin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

  } catch (error) {
    console.error("Session verification failed:", error);
    // Session is invalid. Redirect to login if trying to access admin pages.
    if (isTryingToAccessAdmin) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('session'); // Clear the invalid cookie
        return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * This is to avoid running the middleware on static assets.
   */
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
