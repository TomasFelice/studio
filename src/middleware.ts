import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';
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
  const session = cookies().get('session')?.value || '';

  if (!session) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  try {
    const decodedClaims = await getAuth().verifySessionCookie(session, true);
    if (!decodedClaims) {
        throw new Error("Invalid session cookie");
    }
  } catch (error) {
    if (request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
