'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface Settings { linkedin?: string; github?: string; email?: string; footerWink?: string; }
type Locale = 'en' | 'ar';

export default function SiteNav({ locale = 'en', name, role, settings }: { locale?: Locale; name?: string; role?: string; settings?: Settings }) {
  const pathname = usePathname();
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const [current, setCurrent] = useState('home');
  const isAr = locale === 'ar';
  const otherLocale = isAr ? 'en' : 'ar';
  const labels = isAr ? ['الرئيسية', 'نبذة', 'المشاريع', 'السيرة الذاتية', 'تواصل'] : ['Home', 'About', 'Projects', 'Resume', 'Contact'];

  useEffect(() => {
    if (!isHome) return;
    const sections = document.querySelectorAll('main section[id]');
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setCurrent(entry.target.id); }), { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  const ids = ['home', 'about', 'projects', 'resume', 'contact'];
  const switchHref = isHome ? `/${otherLocale}` : pathname.replace(`/${locale}`, `/${otherLocale}`);
  const switchLanguage = () => { document.cookie = `site-locale=${otherLocale}; path=/; max-age=31536000; SameSite=Lax`; };

  return (
    <aside className="rail">
      <div className="rail-top">
        <Link className="mark" href={`/${locale}`}>{name || 'Your Name'}<span>.</span></Link>
        <div className="role">{role}</div>
        <div className="language-switch"><Link href={switchHref} onClick={switchLanguage}>{isAr ? 'EN' : 'العربية'}</Link></div>
        {isHome ? <nav className="index">{ids.map((id, i) => <a key={id} href={`#${id}`} data-section={id} className={current === id ? 'current' : ''}><span className="tick"></span>{String(i + 1).padStart(2, '0')} · {labels[i]}</a>)}</nav> : <nav className="index"><Link href={`/${locale}#home`}><span className="tick"></span>← {isAr ? 'العودة للرئيسية' : 'Back home'}</Link></nav>}
      </div>
      <div className="rail-bottom">
        <div className="socials" aria-label={isAr ? 'روابط التواصل' : 'Social links'}>
          {settings?.linkedin && <a className="social-icon" href={settings.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 8.5H3V21h3.5V8.5ZM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3ZM21 13.85c0-3.75-2-5.5-4.7-5.5-2.17 0-3.14 1.2-3.68 2.05V8.5H9.12V21h3.5v-6.2c0-1.63.3-3.2 2.32-3.2 1.98 0 2 1.86 2 3.3V21H21v-7.15Z"/></svg></a>}
          {settings?.github && <a className="social-icon" href={settings.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2a9.8 9.8 0 0 0-3.1 19.1c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.9.1-.7.3-1.1.6-1.4-2.2-.2-4.5-1.1-4.5-4.8 0-1.1.4-2 1-2.7-.1-.2-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5.1 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.5.1 2.7.6.7 1 1.6 1 2.7 0 3.7-2.3 4.6-4.5 4.8.3.3.6.9.6 1.8v2.6c0 .3.2.6.7.5A9.8 9.8 0 0 0 12 2.2Z"/></svg></a>}
          {settings?.email && <a className="social-icon" href={`mailto:${settings.email}`} aria-label="Email" title="Email"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3V5Zm2 2v.5l7 5 7-5V7l-7 5-7-5Z"/></svg></a>}
        </div>
        {settings?.footerWink && <span className="filed-line">{settings.footerWink}</span>}
      </div>
    </aside>
  );
}
