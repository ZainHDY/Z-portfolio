'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface Settings {
  linkedin?: string;
  email?: string;
  footerWink?: string;
}

export default function SiteNav({
  name,
  role,
  settings,
}: {
  name?: string;
  role?: string;
  settings?: Settings;
}) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [current, setCurrent] = useState('home');

  useEffect(() => {
    if (!isHome) return;
    const sections = document.querySelectorAll('main section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setCurrent(entry.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [isHome]);

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <aside className="rail">
      <div className="rail-top">
        <Link className="mark" href="/">
          {name || 'Your Name'}
          <span>.</span>
        </Link>
        <div className="role">{role}</div>
        {isHome ? (
          <nav className="index">
            {links.map((l, i) => (
              
                key={l.id}
                href={`#${l.id}`}
                data-section={l.id}
                className={current === l.id ? 'current' : ''}
              >
                <span className="tick"></span>
                {String(i + 1).padStart(2, '0')} · {l.label}
              </a>
            ))}
          </nav>
        ) : (
          <nav className="index">
            <Link href="/#home">
              <span className="tick"></span>← Back home
            </Link>
          </nav>
        )}
      </div>
      <div className="rail-bottom">
        {settings?.linkedin && (
          <>
            <a href={settings.linkedin} target="_blank" rel="noopener">
              LinkedIn ↗
            </a>
            <br />
          </>
        )}
        {settings?.email && (
          <>
            <a href={`mailto:${settings.email}`}>Email ↗</a>
            <br />
          </>
        )}
        {settings?.footerWink && <span className="filed-line">{settings.footerWink}</span>}
      </div>
    </aside>
  );
}
