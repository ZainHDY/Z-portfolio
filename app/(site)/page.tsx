import type { Metadata } from 'next';
import { getSiteSettings, getProjects, getExperience } from '@/lib/sanity/queries';
import ProjectCard from '@/components/ProjectCard';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity/image';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const title = settings?.name ? `${settings.name} — ${settings.role || 'Portfolio'}` : 'Portfolio';
  const description = settings?.heroLede || settings?.contactBody || 'Portfolio site.';

  return {
    title,
    description,
    alternates: { canonical: siteUrl },
    openGraph: {
      title,
      description,
      url: siteUrl,
      type: 'website',
      siteName: settings?.name || undefined,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function HomePage() {
  const settings = await getSiteSettings();
  const projects = await getProjects();
  const experience = await getExperience();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const grouped:
