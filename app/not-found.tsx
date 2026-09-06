import Link from 'next/link';
import { urlFor } from '@/lib/sanity/image';
import { client } from '@/lib/sanity/client';

async function getErrorPage() {
  return client.fetch(`*[_type == "errorPage"][0]{
    visual,
    "eyebrow": eyebrow.en,
    "headline": headline.en,
    "body": body.en,
    "homeLabel": homeLabel.en,
    "projectsLabel": projectsLabel.en
  }`, {}, { cache: 'no-store' });
}

export default async function NotFound() {
  const page = await getErrorPage();
  const visualUrl = page?.visual ? urlFor(page.visual).width(900).height(900).fit('crop').url() : undefined;

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: 'clamp(28px, 7vw, 90px)', boxSizing: 'border-box' }}>
      <section style={{ width: '100%', maxWidth: 980, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: visualUrl ? 'minmax(0, 1.25fr) minmax(220px, .75fr)' : '1fr', gap: 'clamp(32px, 7vw, 90px)', alignItems: 'center' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 28 }}>{page?.eyebrow || '04 / 04'}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(72px, 15vw, 150px)', lineHeight: .8, letterSpacing: '-.08em', color: 'var(--forest)', marginBottom: 34 }}>404</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(32px, 5vw, 58px)', lineHeight: 1.05, color: 'var(--ink)', maxWidth: 720, margin: '0 0 24px' }}>{page?.headline || 'This page seems to have taken a different route.'}</h1>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--body-text)', maxWidth: 600, margin: '0 0 34px', whiteSpace: 'pre-line' }}>{page?.body || "The address you're looking for doesn't exist — or it has moved somewhere else."}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link className="btn-primary" href="/en">{page?.homeLabel || 'Back home ↗'}</Link>
              <Link className="btn-secondary" href="/en#projects">{page?.projectsLabel || 'View projects'}</Link>
            </div>
          </div>
          {visualUrl && (
            <div style={{ aspectRatio: '1', maxWidth: 420, width: '100%', justifySelf: 'end', overflow: 'hidden', borderRadius: 2 }}>
              <img src={visualUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
