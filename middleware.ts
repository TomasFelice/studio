// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export const runtime = 'nodejs';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const isTryingToAccessAdmin = request.nextUrl.pathname.startsWith('/admin');
  const isTryingToAccessLogin = request.nextUrl.pathname === '/login';

  // Si no hay sesión, redirigir a login si accede a páginas admin
  if (!session) {
    if (isTryingToAccessAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Si hay sesión y está en login, redirigir a admin
  if (isTryingToAccessLogin) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};