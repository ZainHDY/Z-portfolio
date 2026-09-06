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
    <main className="error-page">
      <section className="error-page-inner">
        <div className={`error-page-grid${visualUrl ? ' has-visual' : ''}`}>
          <div className="error-page-copy">
            <div className="eyebrow error-page-eyebrow">{page?.eyebrow || '04 / 04'}</div>
            <div className="error-code" aria-hidden="true">404</div>
            <h1>{page?.headline || 'This page seems to have taken a different route.'}</h1>
            <p>{page?.body || "The address you're looking for doesn't exist — or it has moved somewhere else."}</p>
            <div className="error-page-actions">
              <Link className="btn-primary" href="/en">{page?.homeLabel || 'Back home ↗'}</Link>
              <Link className="btn-secondary" href="/en#projects">{page?.projectsLabel || 'View projects'}</Link>
            </div>
          </div>
          {visualUrl && (
            <div className="error-page-visual">
              <img src={visualUrl} alt="" />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
