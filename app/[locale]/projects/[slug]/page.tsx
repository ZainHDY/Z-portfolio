import type { Metadata } from 'next';
import { getProjectBySlug, type Locale } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

const locales: Locale[] = ['en', 'ar'];

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: Locale; slug: string } }): Promise<Metadata> {
  const locale = locales.includes(params.locale) ? params.locale : 'en';
  const project = await getProjectBySlug(params.slug, locale);
  if (!project) return { title: 'Project not found' };
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${siteUrl}/${locale}/projects/${params.slug}`;
  const description = project.summary || '';
  const ogImage = project.image ? urlFor(project.image).width(1200).height(630).url() : undefined;
  return {
    title: project.title,
    description,
    alternates: { canonical: url, languages: { en: `${siteUrl}/en/projects/${params.slug}`, ar: `${siteUrl}/ar/projects/${params.slug}` } },
    openGraph: { title: project.title, description, url, type: 'article', images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined },
    twitter: { card: ogImage ? 'summary_large_image' : 'summary', title: project.title, description, images: ogImage ? [ogImage] : undefined },
  };
}

export default async function LocaleProjectPage({ params }: { params: { locale: Locale; slug: string } }) {
  const locale = locales.includes(params.locale) ? params.locale : 'en';
  const project = await getProjectBySlug(params.slug, locale);
  if (!project) notFound();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const projectUrl = `${siteUrl}/${locale}/projects/${params.slug}`;
  const isAr = locale === 'ar';
  const creativeWorkLd = {
    '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.title, description: project.summary,
    url: projectUrl, image: project.image ? urlFor(project.image).width(1200).height(630).url() : undefined,
    keywords: project.tags?.join(', '), inLanguage: locale,
    author: { '@type': 'Person', name: 'Zain Hamidy', url: siteUrl },
  };
  return (
    <section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd) }} />
      <Link className="back-link" href={`/${locale}#projects`}>{isAr ? '→ العودة إلى المشاريع' : '← Back to index'}</Link>
      {project.image && <div className="thumb" style={{ marginBottom: 26 }}><Image src={urlFor(project.image).width(1200).height(700).url()} alt={project.title || ''} width={1200} height={700} style={{ width: '100%', height: 'auto' }} /></div>}
      <div className="tag">{project.category?.title}</div>
      <h1 style={{ fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-display)', fontWeight: 500, fontSize: 34, color: 'var(--ink)', margin: '10px 0 22px' }}>{project.title}</h1>
      {project.link && <a className="btn-secondary" href={project.link} target="_blank" rel="noopener" style={{ marginBottom: 24 }}>{isAr ? 'زيارة ↗' : 'Visit ↗'}</a>}
      <div className="prose">{project.body ? <PortableText value={project.body} /> : <p>{project.summary}</p>}</div>
    </section>
  );
}
