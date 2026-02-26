// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // /dashboard लाई /vendor/dashboard मा redirect
  if (request.nextUrl.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/vendor/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard'],
};