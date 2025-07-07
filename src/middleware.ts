// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;

  // Si no hay cookie de sesión, redirigir a login para páginas admin
  if (!session) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Verificar la sesión en el servidor usando una API route
  try {
    const verifyUrl = new URL('/api/verify-session', request.url);
    const response = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ session }),
    });

    if (!response.ok) {
      // Sesión inválida
      const loginResponse = NextResponse.redirect(new URL('/login', request.url));
      loginResponse.cookies.delete('session');
      return loginResponse;
    }
  } catch (error) {
    console.error('Error verifying session:', error);
    const loginResponse = NextResponse.redirect(new URL('/login', request.url));
    loginResponse.cookies.delete('session');
    return loginResponse;
  }

  // Si está autenticado y visita login, redirigir a admin
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};