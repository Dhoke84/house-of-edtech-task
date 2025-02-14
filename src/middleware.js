import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  
  const isPublicPath = path === '/login' || path === '/register';
  const token = request.cookies.get("token")?.value || "";

  console.log("Is Public Path:", isPublicPath, "Token:", token);

  // Always allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/profile'],
};
