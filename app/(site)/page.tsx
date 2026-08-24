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

  const grouped: Record<string, typeof projects> = {};
  for (const p of projects) {
    const key = p.category?.title || 'Other';
    grouped[key] = grouped[key] || [];
    grouped[key].push(p);
  }

  const formatDate = (d?: string) =>
    d
      ? new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      : '';

  const headline = settings?.heroHeadline || 'Welcome to my portfolio.';
  const accent = settings?.heroAccent;
  const parts = accent && headline.includes(accent) ? headline.split(accent) : null;

  const personLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: settings?.name,
    jobTitle: settings?.role,
    url: siteUrl,
    description: settings?.heroLede,
    sameAs: [settings?.linkedin, settings?.github].filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />

      <section id="home" className="hero">
        <div className="eyebrow">Portfolio</div>
        <h1>
          {parts ? (
            <>
              {parts[0]}
              <em>{accent}</em>
              {parts[1]}
            </>
          ) : (
            headline
          )}
        </h1>
        <p className="lede">{settings?.heroLede}</p>
      </section>

      <section id="about">
        <div className="eyebrow">About</div>
        <h2 className="section-title">About</h2>
        <div className="prose">
          {settings?.aboutBio ? (
            <PortableText value={settings.aboutBio} />
          ) : (
            <p>Add your bio in Sanity Studio.</p>
          )}
        </div>
      </section>

      <section id="projects">
        <h2 className="section-title">Projects</h2>
        {Object.keys(grouped).length === 0 && (
          <p style={{ opacity: 0.5, fontSize: 14 }}>No projects yet.</p>
        )}
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} style={{ marginBottom: 40 }}>
            <div className="eyebrow">{category}</div>
            {items.map((p: any) => (
              <ProjectCard
                key={p.slug}
                href={`/projects/${p.slug}`}
                tag={p.tags?.[0] || p.category?.title || ''}
                title={p.title}
                summary={p.summary}
                image={p.image ? urlFor(p.image).width(900).height(540).url() : undefined}
              />
            ))}
          </div>
        ))}
      </section>

      <section id="resume">
        <h2 className="section-title">Resume</h2>
        {settings?.resumeIntro && (
          <p className="prose" style={{ marginBottom: 24 }}>
            {settings.resumeIntro}
          </p>
        )}
        {settings?.resumeFile?.asset && (
          
            className="btn-secondary"
            href={settings.resumeFile.asset.url}
            target="_blank"
            rel="noopener"
            style={{ marginBottom: 24 }}
          >
            Download Resume ↓
          </a>
        )}
        {experience.length === 0 && (
          <p style={{ opacity: 0.5, fontSize: 14 }}>No experience entries yet.</p>
        )}
        {experience.map((e: any, i: number) => (
          <div className="card" key={i} style={{ cursor: 'default' }}>
            <div className="tag">
              {formatDate(e.startDate)} — {e.current ? 'Present' : formatDate(e.endDate)}
            </div>
            <h3>
              {e.role} · {e.organization}
            </h3>
            {e.description && (
              <div className="prose">
                <PortableText value={e.description} />
              </div>
            )}
          </div>
        ))}
      </section>

      <section id="contact">
        <div className="eyebrow">Contact</div>
        <h2 className="contact-heading">{settings?.contactHeading || "Let's talk."}</h2>
        <p style={{ maxWidth: 420 }}>{settings?.contactBody}</p>
        <br />
        {settings?.email && (
          <a className="contact-link" href={`mailto:${settings.email}`}>
            Email me ↗
          </a>
        )}
        {settings?.linkedin && (
          <div className="contact-secondary">
            or find me on{' '}
            <a href={settings.linkedin} target="_blank" rel="noopener">
              LinkedIn
            </a>
          </div>
        )}
      </section>
    </>
  );
}
