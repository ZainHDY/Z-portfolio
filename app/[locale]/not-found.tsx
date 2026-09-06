import Link from 'next/link';
import { urlFor } from '@/lib/sanity/image';
import { client } from '@/lib/sanity/client';
import type { Locale } from '@/lib/sanity/queries';

const locales: Locale[] = ['en', 'ar'];

async function getErrorPage(locale: Locale) {
  return client.fetch(`*[_type == "errorPage"][0]{
    visual,
    "eyebrow": eyebrow.${locale},
    "headline": headline.${locale},
    "body": body.${locale},
    "homeLabel": homeLabel.${locale},
    "projectsLabel": projectsLabel.${locale}
  }`, {}, { cache: 'no-store' });
}

export default async function NotFound({ params }: { params: { locale: string } }) {
  const locale: Locale = locales.includes(params.locale as Locale) ? params.locale as Locale : 'en';
  const page = await getErrorPage(locale);
  const isAr = locale === 'ar';
  const visualUrl = page?.visual ? urlFor(page.visual).width(900).height(900).fit('crop').url() : undefined;

  const fallback = isAr
    ? {
        eyebrow: '04 / 04',
        headline: 'يبدو أن هذه الصفحة سلكت طريقاً آخر.',
        body: 'العنوان الذي تبحث عنه غير موجود، أو ربما انتقل إلى مكان آخر.',
        home: 'العودة للرئيسية ↗',
        projects: 'عرض المشاريع',
      }
    : {
        eyebrow: '04 / 04',
        headline: 'This page seems to have taken a different route.',
        body: "The address you're looking for doesn't exist — or it has moved somewhere else.",
        home: 'Back home ↗',
        projects: 'View projects',
      };

  return (
    <main dir={isAr ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: 'clamp(28px, 7vw, 90px)', boxSizing: 'border-box' }}>
      <section style={{ width: '100%', maxWidth: 980, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: visualUrl ? 'minmax(0, 1.25fr) minmax(220px, .75fr)' : '1fr', gap: 'clamp(32px, 7vw, 90px)', alignItems: 'center' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 28 }}>{page?.eyebrow || fallback.eyebrow}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(72px, 15vw, 150px)', lineHeight: .8, letterSpacing: '-.08em', color: 'var(--forest)', marginBottom: 34 }}>404</div>
            <h1 style={{ fontFamily: isAr ? 'var(--font-arabic)' : 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(32px, 5vw, 58px)', lineHeight: 1.05, color: 'var(--ink)', maxWidth: 720, margin: '0 0 24px' }}>{page?.headline || fallback.headline}</h1>
            <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--body-text)', maxWidth: 600, margin: '0 0 34px', whiteSpace: 'pre-line' }}>{page?.body || fallback.body}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <Link className="btn-primary" href={`/${locale}`}>{page?.homeLabel || fallback.home}</Link>
              <Link className="btn-secondary" href={`/${locale}#projects`}>{page?.projectsLabel || fallback.projects}</Link>
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
