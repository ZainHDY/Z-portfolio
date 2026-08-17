import type { Metadata } from 'next';
import './globals.css';
import { getSiteSettings } from '@/lib/sanity/queries';
import ViewTracker from '@/components/ViewTracker';
import SiteNav from '@/components/SiteNav';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return {
    metadataBase: new URL(siteUrl),
    title: settings?.name ? `${settings.name} — Portfolio` : 'Portfolio',
    description: settings?.heroLede || '',
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ViewTracker />
        <div className="shell">
          <SiteNav name={settings?.name} role={settings?.role} settings={settings} />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
