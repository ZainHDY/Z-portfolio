import type { Metadata } from 'next';
import { getProjectBySlug } from '@/lib/sanity/queries';
import { urlFor } from '@/lib/sanity/image';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: 'Project not found' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${siteUrl}/projects/${params.slug}`;
  const description = project.summary || '';
  const ogImage = project.image ? urlFor(project.image).width(1200).height(630).url() : undefined;

  return {
    title: project.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: project.title,
      description,
      url,
      type: 'article',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: project.title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const creativeWorkLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: `${siteUrl}/projects/${params.slug}`,
    image: project.image ? urlFor(project.image).width(1200).height(630).url() : undefined,
    keywords: project.tags?.join(', '),
  };

  return (
    <section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkLd) }} />

      <Link className="back-link" href="/#projects">← Back to index</Link>
      {project.image && (
        <div className="thumb" style={{ marginBottom: 26 }}>
          <Image
            src={urlFor(project.image).width(1200).height(700).url()}
            alt=""
            width={1200}
            height={700}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      )}
      <div className="tag">{project.category?.title}</div>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 500,
          fontSize: 34,
          color: 'var(--ink)',
          margin: '10px 0 22px',
        }}
      >
        {project.title}
      </h1>
      {project.link && (
        <a className="btn-secondary" href={project.link} target="_blank" rel="noopener" style={{ marginBottom: 24 }}>
          Visit ↗
        </a>
      )}
      <div className="prose">
        {project.body ? <PortableText value={project.body} /> : <p>{project.summary}</p>}
      </div>
    </section>
  );
}
