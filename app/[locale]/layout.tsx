import type { Metadata } from 'next';
import { getSiteSettings, type Locale } from '@/lib/sanity/queries';
import ViewTracker from '@/components/ViewTracker';
import SiteNav from '@/components/SiteNav';

export const dynamic = 'force-dynamic';
const locales: Locale[] = ['en', 'ar'];

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const locale = locales.includes(params.locale) ? params.locale : 'en';
  const settings = await getSiteSettings(locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${siteUrl}/${locale}`;
  const title = settings?.name ? `${settings.name} — ${settings.role || 'Portfolio'}` : 'Portfolio';
  const description = settings?.heroLede || '';
  const brandMarkUrl = settings?.brandMark?.asset?.url;
  return {
    title, description,
    alternates: { canonical: url, languages: { en: `${siteUrl}/en`, ar: `${siteUrl}/ar` } },
    openGraph: { title, description, url, type: 'website', locale: locale === 'ar' ? 'ar' : 'en_US' },
    twitter: { card: 'summary', title, description },
    icons: brandMarkUrl ? { icon: brandMarkUrl, shortcut: brandMarkUrl, apple: brandMarkUrl } : undefined,
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: Locale } }) {
  const locale = locales.includes(params.locale) ? params.locale : 'en';
  const settings = await getSiteSettings(locale);
  return (
    <div className="locale-root" lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <ViewTracker />
      <div className="shell">
        <SiteNav locale={locale} name={settings?.name} role={settings?.role} settings={settings} />
        <main>{children}</main>
      </div>
    </div>
  );
}
