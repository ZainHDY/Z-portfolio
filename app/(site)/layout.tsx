import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/sanity/queries';
import ViewTracker from '@/components/ViewTracker';
import SiteNav from '@/components/SiteNav';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings('en');
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return { metadataBase: new URL(siteUrl), title: settings?.name ? `${settings.name} — Portfolio` : 'Portfolio', description: settings?.heroLede || '' };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings('en');
  return (
    <div className="locale-root" lang="en" dir="ltr">
      <ViewTracker />
      <div className="shell">
        <SiteNav locale="en" name={settings?.name} role={settings?.role} settings={settings} />
        <main>{children}</main>
      </div>
    </div>
  );
}
