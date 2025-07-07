
import { NextResponse, type NextRequest } from 'next/server';
import { auth } from '@/lib/firebase/admin';

// This is crucial for firebase-admin to work in the middleware
export const runtime = 'nodejs';

async function verifySessionCookie(session: string | undefined) {
    if (!session || !auth) return false;
    try {
        await auth.verifySessionCookie(session, true);
        return true;
    } catch (error) {
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    const sessionIsValid = await verifySessionCookie(session);

    const isTryingToAccessAdmin = request.nextUrl.pathname.startsWith('/admin');
    const isTryingToAccessLogin = request.nextUrl.pathname === '/login';

    // If session is valid and user tries to access login page, redirect to admin
    if (sessionIsValid && isTryingToAccessLogin) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    // If session is not valid and user tries to access a protected admin page, redirect to login
    if (!sessionIsValid && isTryingToAccessAdmin) {
        const response = NextResponse.redirect(new URL('/login', request.url));
        // Clear the invalid cookie
        response.cookies.delete('session');
        return response;
    }

    // Allow the request to proceed
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
