import { NextResponse, NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const jwt = request.cookies.get('jwt');

  let isAuthenticated = false;


  // If no JWT, redirect to the homepage
  if (!jwt && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
   // If logged in and accessing the homepage, redirect to /explore
   if (jwt && request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/explore', request.url));
  }

  // Allow access to other routes if authenticated
  return NextResponse.next();
}


export const config = {
  matcher: [
   
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}