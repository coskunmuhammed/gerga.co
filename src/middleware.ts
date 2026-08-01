import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/dictionaries';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname already has a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Exclude static assets, api routes, images, etc.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Redirect to default locale if missing
  const locale = defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Match all pathnames except static files & api
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
