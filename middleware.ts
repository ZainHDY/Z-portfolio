import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'ar'] as const;
type Locale = (typeof locales)[number];

function detectLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get('site-locale')?.value;
  if (cookie === 'ar' || cookie === 'en') return cookie;

  const header = request.headers.get('accept-language') || '';
  return header.toLowerCase().split(',').some((part) => part.trim().startsWith('ar')) ? 'ar' : 'en';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/studio') || pathname === '/robots.txt' || pathname === '/sitemap.xml' || pathname === '/llms.txt') {
    return NextResponse.next();
  }

  const hasLocale = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (hasLocale) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
