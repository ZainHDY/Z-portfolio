import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'ar'] as const;
type Locale = (typeof locales)[number];

function detectLocale(request: NextRequest): Locale {
  const header = request.headers.get('accept-language') || '';
  const languages = header
    .toLowerCase()
    .split(',')
    .map((part) => part.trim().split(';')[0]);

  return languages.some((language) => language === 'ar' || language.startsWith('ar-')) ? 'ar' : 'en';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/studio') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/llms.txt' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (hasLocale) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set('site-locale', locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
