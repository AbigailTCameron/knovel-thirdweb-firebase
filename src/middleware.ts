import { NextResponse, NextRequest } from 'next/server';

function isBot(userAgent: string | null) {
  if (!userAgent) return false;
  return /Twitterbot|facebookexternalhit|LinkedInBot|Slackbot|Discordbot|WhatsApp|TelegramBot|Googlebot|bingbot/i.test(
    userAgent
  );
}

export async function middleware(request: NextRequest) {
  const jwt = request.cookies.get('jwt');
  const { pathname } = request.nextUrl;
  const ua = request.headers.get('user-agent');


  // ✅ Allow preview bots to see /explore without auth (for correct OG tags)
  if (pathname === '/explore' && isBot(ua)) {
    return NextResponse.next();
  }


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