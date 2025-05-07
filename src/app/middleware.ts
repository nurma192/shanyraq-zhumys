// src/app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const publicPaths = ['/auth/login', '/auth/register', '/auth/verify'];
  const path = request.nextUrl.pathname;
  
  // Check if the path is a public path
  const isPublicPath = publicPaths.some((publicPath) => 
    path === publicPath || path === `${publicPath}/`
  );
  
  // Get the token from the cookies
  const token = request.cookies.get('accessToken')?.value;
  
  // If the path is public and the user is authenticated, redirect to home page
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // If the path is not public and the user is not authenticated, redirect to login page
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  // Continue with the request
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};