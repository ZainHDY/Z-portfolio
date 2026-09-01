import type { Metadata } from 'next';
import '../(site)/globals.css';
import { getSiteSettings } from '@/lib/sanity/queries';
import ViewTracker from '@/components/ViewTracker';
import SiteNav from '@/components/SiteNav';

export const dynamic = 'force-dynamic';

const locales = ['en', 'ar'] as const;
type Locale = (typeof locales)[number];

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const locale = locales.includes(params.locale) ? params.locale : 'en';
  const settings = await getSiteSettings(locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${siteUrl}/${locale}`;
  const title = settings?.name ? `${settings.name} — ${settings.role || 'Portfolio'}` : 'Portfolio';
  const description = settings?.heroLede || '';

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: `${siteUrl}/en`, ar: `${siteUrl}/ar` },
    },
    openGraph: { title, description, url, type: 'website', locale: locale === 'ar' ? 'ar' : 'en_US' },
    twitter: { card: 'summary', title, description },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: Locale } }) {
  const locale = locales.includes(params.locale) ? params.locale : 'en';
  const settings = await getSiteSettings(locale);

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Noto+Kufi+Arabic:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ViewTracker />
        <div className="shell">
          <SiteNav locale={locale} name={settings?.name} role={settings?.role} settings={settings} />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
