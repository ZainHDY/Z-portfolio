'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface Settings { linkedin?: string; email?: string; footerWink?: string; }
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
        {settings?.linkedin && <><a href={settings.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a><br /></>}
        {settings?.email && <><a href={`mailto:${settings.email}`}>{isAr ? 'البريد الإلكتروني ↗' : 'Email ↗'}</a><br /></>}
        {settings?.footerWink && <span className="filed-line">{settings.footerWink}</span>}
      </div>
    </aside>
  );
}
