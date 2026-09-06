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
    ? { eyebrow: '04 / 04', headline: 'يبدو أن هذه الصفحة سلكت طريقاً آخر.', body: 'العنوان الذي تبحث عنه غير موجود، أو ربما انتقل إلى مكان آخر.', home: 'العودة للرئيسية ↗', projects: 'عرض المشاريع' }
    : { eyebrow: '04 / 04', headline: 'This page seems to have taken a different route.', body: "The address you're looking for doesn't exist — or it has moved somewhere else.", home: 'Back home ↗', projects: 'View projects' };

  return (
    <main className="error-page" dir={isAr ? 'rtl' : 'ltr'}>
      <section className="error-page-inner">
        <div className={`error-page-grid${visualUrl ? ' has-visual' : ''}`}>
          <div className="error-page-copy">
            <div className="eyebrow error-page-eyebrow">{page?.eyebrow || fallback.eyebrow}</div>
            <div className="error-identity">
              <div className="error-code" aria-hidden="true">404</div>
              {visualUrl && <div className="error-page-visual error-page-visual-mobile"><img src={visualUrl} alt="" /></div>}
            </div>
            <h1>{page?.headline || fallback.headline}</h1>
            <p>{page?.body || fallback.body}</p>
            <div className="error-page-actions">
              <Link className="btn-primary" href={`/${locale}`}>{page?.homeLabel || fallback.home}</Link>
              <Link className="btn-secondary" href={`/${locale}#projects`}>{page?.projectsLabel || fallback.projects}</Link>
            </div>
          </div>
          {visualUrl && (
            <div className="error-page-visual error-page-visual-desktop">
              <img src={visualUrl} alt="" />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
