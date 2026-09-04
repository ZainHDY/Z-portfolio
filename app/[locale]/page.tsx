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
  return { title, description, alternates: { canonical: url, languages: { en: `${siteUrl}/en`, ar: `${siteUrl}/ar` } }, openGraph: { title, description, url, type: 'website' }, twitter: { card: 'summary', title, description } };
}

export default async function LocaleHomePage({ params }: { params: { locale: Locale } }) {
  const locale = locales.includes(params.locale) ? params.locale : 'en';
  const [settings, projects, experience] = await Promise.all([getSiteSettings(locale), getProjects(locale), getExperience(locale)]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const isAr = locale === 'ar';
  const t = isAr ? { intro:'نبذة سريعة', about:'نبذة', projects:'المشاريع', resume:'الخبرة', contact:'تواصل', download:'تحميل السيرة الذاتية ↓', present:'حالياً', email:'راسلني ↗', view:'عرض المشروع ↗' } : { intro:'A little about me', about:'About', projects:'Selected work', resume:'Experience', contact:'Let’s talk', download:'Download Resume ↓', present:'Present', email:'Email me ↗', view:'View project ↗' };
  const headline = settings?.heroHeadline || (isAr ? 'مرحباً، أنا زين.' : 'Hello, I’m Zain.');
  const accent = settings?.heroAccent;
  const parts = accent && headline.includes(accent) ? headline.split(accent) : null;
  const personLd = { '@context':'https://schema.org', '@type':'Person', name:settings?.name, jobTitle:settings?.role, url:siteUrl, description:settings?.heroLede, inLanguage:locale, sameAs:[settings?.linkedin, settings?.github].filter(Boolean) };
  const profileUrl = settings?.profileImageUrl || (settings?.profileImage ? urlFor(settings.profileImage).width(600).height(600).fit('crop').url() : undefined);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
    <section id="home" className="hero">
      <div className="hero-topline"><span className="eyebrow">{t.intro}</span><span className="hero-index">01 / 05</span></div>
      <div className="hero-identity">
        <div className="hero-pfp" aria-label={settings?.name || 'Profile photo'}>{profileUrl ? <img src={profileUrl} alt={settings?.name || 'Zain Hamidy'} width={180} height={180} /> : <span className="hero-pfp-fallback">ZH</span>}</div>
        <div className="hero-copy"><h1>{parts ? <>{parts[0]}<em>{accent}</em>{parts[1]}</> : headline}</h1><p className="lede">{settings?.heroLede}</p><div className="hero-actions"><a className="btn-primary" href="#projects">{isAr ? 'استكشف أعمالي ↗' : 'Explore my work ↗'}</a><a className="btn-secondary" href="#about">{isAr ? 'المزيد عني' : 'More about me'}</a></div></div>
      </div>
    </section>
    <section id="about" className="about-section"><div className="section-kicker"><span>02</span><span>{t.about}</span></div><div className="about-grid"><h2 className="section-title">{isAr ? 'أصنع روابط بين الأفكار والناس والأنظمة.' : 'I connect ideas, people and systems.'}</h2><div className="prose">{settings?.aboutBio ? <PortableText value={settings.aboutBio} /> : <p>{isAr ? 'أضف نبذتك من استوديو Sanity.' : 'Add your bio in Sanity Studio.'}</p>}</div></div></section>
    <section id="projects" className="work-section"><div className="section-kicker"><span>03</span><span>{t.projects}</span></div>{projects.length === 0 && <p className="empty-state">{isAr ? 'لا توجد مشاريع بعد.' : 'No projects yet.'}</p>}{projects.length > 0 && <div className="project-grid">{projects.map((p: any, i: number) => <ProjectCard key={p.slug} featured={i === 0} href={`/${locale}/projects/${p.slug}`} tag={p.tags?.[0] || p.category?.title || ''} title={p.title} summary={p.summary} image={p.image ? urlFor(p.image).width(i === 0 ? 1400 : 900).height(i === 0 ? 780 : 600).url() : undefined} viewLabel={t.view} />)}</div>}</section>
    <section id="resume" className="experience-section"><div className="section-kicker"><span>04</span><span>{t.resume}</span></div><div className="experience-intro">{settings?.resumeIntro && <div className="prose"><PortableText value={settings.resumeIntro} /></div>}{settings?.resumeFile?.asset && <a className="btn-secondary" href={settings.resumeFile.asset.url} target="_blank" rel="noopener">{t.download}</a>}</div><div className="experience-list">{experience.map((e: any, i: number) => <div className="experience-item" key={i}><div className="experience-date">{e.startDate} — {e.current ? t.present : e.endDate}</div><div><h3>{e.role}</h3><div className="experience-org">{e.organization}</div>{e.description && <div className="prose"><PortableText value={e.description} /></div>}</div></div>)}</div></section>
    <section id="contact" className="contact-section"><div className="section-kicker"><span>05</span><span>{t.contact}</span></div><h2 className="contact-heading">{settings?.contactHeading || (isAr ? 'لنتحدث.' : 'Let’s make something useful.')}</h2><p>{settings?.contactBody}</p><div className="contact-actions">{settings?.email && <a className="contact-link" href={`mailto:${settings.email}`}>{t.email}</a>}{settings?.linkedin && <a className="social-icon" href={settings.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5H3V21h3.5V8.5ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.85c0-3.75-2-5.5-4.7-5.5-2.17 0-3.14 1.2-3.68 2.05V8.5H9.12V21h3.5v-7.15c0-1.63.3-3.2 2.32-3.2 1.98 0 2 1.86 2 3.3V21H21v-7.15Z"/></svg></a>}{settings?.github && <a className="social-icon" href={settings.github} target="_blank" rel="noopener" aria-label="GitHub" title="GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.9.1-.7.3-1.1.6-1.4-2.2-.2-4.5-1.1-4.5-4.8 0-1.1.4-2 1-2.7-.1-.2-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.5.1 2.7.6.7 1 1.6 1 2.7 0 3.7-2.3 4.6-4.5 4.8.3.3.6.9.6 1.8v2.6c0 .3.2.6.7.5A9.8 9.8 0 0 0 12 2.2Z"/></svg></a>}</div></section>
  </>;
}
