// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { auth } from './src/lib/firebase/admin';

export const runtime = 'nodejs';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  const isTryingToAccessAdmin = request.nextUrl.pathname.startsWith('/admin');
  const isTryingToAccessLogin = request.nextUrl.pathname === '/login';

  // Si auth es null, significa que Firebase Admin no se pudo inicializar
  if (!auth) {
    console.error("CRITICAL: Firebase Admin not initialized. Check FIREBASE_SERVICE_ACCOUNT_KEY.");
    
    // Redirigir a login si intenta acceder a admin
    if (isTryingToAccessAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Si no hay sesión, redirigir a login si accede a páginas admin
  if (!session) {
    if (isTryingToAccessAdmin) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // Verificar la sesión
  try {
    await auth.verifySessionCookie(session, true);
    
    // Sesión válida. Si está en login, redirigir a admin
    if (isTryingToAccessLogin) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

  } catch (error) {
    console.error("Session verification failed:", error);
    
    if (isTryingToAccessAdmin) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)', '/admin/:path*', '/login'],
};