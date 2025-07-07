
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const isTryingToAccessAdmin = request.nextUrl.pathname.startsWith('/admin');
  const isTryingToAccessLogin = request.nextUrl.pathname === '/login';

  // If there's no session, redirect to login for admin pages, otherwise continue
  if (!session) {
    if (isTryingToAccessAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // If there is a session, verify it with our API route
  const response = await fetch(new URL('/api/verify-session', request.url), {
    headers: {
      'Cookie': `session=${session}`,
    },
    method: 'POST',
  });

  const { valid } = await response.json();

  // If session is valid and user is on login page, redirect to admin
  if (valid && isTryingToAccessLogin) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // If session is invalid and user is trying to access admin, redirect to login
  if (!valid && isTryingToAccessAdmin) {
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.cookies.delete('session'); // Clear the invalid cookie
    return res;
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
