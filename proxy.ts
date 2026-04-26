import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authToken = request.cookies.get('better-auth.session_token');

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isDashboard = pathname.startsWith('/dashboard');
  const isApiRoute = pathname.startsWith('/api');

  if (isDashboard && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (isApiRoute && pathname !== '/api/auth' && !authToken && pathname !== '/api/transactions') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/api/transactions/:path*',
  ],
};