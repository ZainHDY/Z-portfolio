import type { Metadata } from 'next';
import { getSiteSettings, getProjects, getExperience, type Locale } from '@/lib/sanity/queries';
import ProjectCard from '@/components/ProjectCard';
import { PortableText } from '@portabletext/react';
import { urlFor } from '@/lib/sanity/image';

const locales: Locale[] = ['en', 'ar'];

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const locale = locales.includes(params.locale) ? params.locale : 'en';
  const settings = await getSiteSettings(locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const url = `${siteUrl}/${locale}`;
  const title = settings?.name ? `${settings.name} — ${settings.role || 'Portfolio'}` : 'Portfolio';
  const description = settings?.heroLede || settings?.contactBody || 'Portfolio site.';
  return {
    title, description,
    alternates: { canonical: url, languages: { en: `${siteUrl}/en`, ar: `${siteUrl}/ar` } },
    openGraph: { title, description, url, type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

export default async function LocaleHomePage({ params }: { params: { locale: Locale } }) {
  const locale = locales.includes(params.locale) ? params.locale : 'en';
  const settings = await getSiteSettings(locale);
  const projects = await getProjects(locale);
  const experience = await getExperience(locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const isAr = locale === 'ar';
  const t = isAr
    ? { portfolio: 'ملف شخصي', about: 'نبذة', projects: 'المشاريع', resume: 'السيرة الذاتية', contact: 'تواصل', download: 'تحميل السيرة الذاتية ↓', present: 'حالياً', email: 'راسلني ↗', linkedin: 'LinkedIn' }
    : { portfolio: 'Portfolio', about: 'About', projects: 'Projects', resume: 'Resume', contact: 'Contact', download: 'Download Resume ↓', present: 'Present', email: 'Email me ↗', linkedin: 'LinkedIn' };

  const grouped: Record<string, typeof projects> = {};
  for (const p of projects) {
    const key = p.category?.title || (isAr ? 'أخرى' : 'Other');
    grouped[key] = grouped[key] || [];
    grouped[key].push(p);
  }

  const formatDate = (d?: string) => d ? new Date(d + 'T00:00:00').toLocaleDateString(isAr ? 'ar' : 'en-US', { month: 'short', year: 'numeric' }) : '';
  const headline = settings?.heroHeadline || (isAr ? 'مرحباً بكم في ملفي الشخصي.' : 'Welcome to my portfolio.');
  const accent = settings?.heroAccent;
  const parts = accent && headline.includes(accent) ? headline.split(accent) : null;
  const personLd = {
    '@context': 'https://schema.org', '@type': 'Person', name: settings?.name, jobTitle: settings?.role,
    url: siteUrl, description: settings?.heroLede, inLanguage: locale,
    sameAs: [settings?.linkedin, settings?.github].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
      <section id="home" className="hero"><div className="eyebrow">{t.portfolio}</div><h1>{parts ? <><>{parts[0]}</><em>{accent}</em>{parts[1]}</> : headline}</h1><p className="lede">{settings?.heroLede}</p></section>
      <section id="about"><div className="eyebrow">{t.about}</div><h2 className="section-title">{t.about}</h2><div className="prose">{settings?.aboutBio ? <PortableText value={settings.aboutBio} /> : <p>{isAr ? 'أضف نبذتك من استوديو Sanity.' : 'Add your bio in Sanity Studio.'}</p>}</div></section>
      <section id="projects"><h2 className="section-title">{t.projects}</h2>{Object.keys(grouped).length === 0 && <p style={{ opacity: 0.5, fontSize: 14 }}>{isAr ? 'لا توجد مشاريع بعد.' : 'No projects yet.'}</p>}{Object.entries(grouped).map(([category, items]) => <div key={category} style={{ marginBottom: 40 }}><div className="eyebrow">{category}</div>{items.map((p: any) => <ProjectCard key={p.slug} href={`/${locale}/projects/${p.slug}`} tag={p.tags?.[0] || p.category?.title || ''} title={p.title} summary={p.summary} image={p.image ? urlFor(p.image).width(900).height(540).url() : undefined} />)}</div>)}</section>
      <section id="resume"><h2 className="section-title">{t.resume}</h2>{settings?.resumeIntro && <p className="prose" style={{ marginBottom: 24 }}>{settings.resumeIntro}</p>}{settings?.resumeFile?.asset && <a className="btn-secondary" href={settings.resumeFile.asset.url} target="_blank" rel="noopener" style={{ marginBottom: 24 }}>{t.download}</a>}{experience.length === 0 && <p style={{ opacity: 0.5, fontSize: 14 }}>{isAr ? 'لا توجد خبرات بعد.' : 'No experience entries yet.'}</p>}{experience.map((e: any, i: number) => <div className="card" key={i} style={{ cursor: 'default' }}><div className="tag">{formatDate(e.startDate)} — {e.current ? t.present : formatDate(e.endDate)}</div><h3>{e.role} · {e.organization}</h3>{e.description && <div className="prose"><PortableText value={e.description} /></div>}</div>)}</section>
      <section id="contact"><div className="eyebrow">{t.contact}</div><h2 className="contact-heading">{settings?.contactHeading || (isAr ? 'لنتحدث.' : "Let's talk.")}</h2><p style={{ maxWidth: 420 }}>{settings?.contactBody}</p><br />{settings?.email && <a className="contact-link" href={`mailto:${settings.email}`}>{t.email}</a>}{settings?.linkedin && <div className="contact-secondary">{isAr ? 'أو تجدني على ' : 'or find me on '}<a href={settings.linkedin} target="_blank" rel="noopener">{t.linkedin}</a></div>}</section>
    </>
  );
}
