import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/sanity/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const projects = await getProjects('en');

  const entries: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/en`, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/ar`, changeFrequency: 'weekly', priority: 1 },
  ];

  for (const project of projects) {
    entries.push(
      { url: `${siteUrl}/en/projects/${project.slug}`, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${siteUrl}/ar/projects/${project.slug}`, changeFrequency: 'monthly', priority: 0.7 },
    );
  }

  return entries;
}
