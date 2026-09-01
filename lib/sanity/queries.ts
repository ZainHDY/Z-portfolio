import { client } from './client';

export type Locale = 'en' | 'ar';

const localized = (field: string, locale: Locale) => `${field}{${locale}}`;

export async function getSiteSettings(locale: Locale = 'en') {
  return client.fetch(`*[_type == "siteSettings"][0]{
    name->{},
    "name": name.${locale},
    "role": role.${locale},
    "heroHeadline": heroHeadline.${locale},
    "heroAccent": heroAccent.${locale},
    "heroLede": heroLede.${locale},
    "aboutBio": aboutBio.${locale},
    "resumeIntro": resumeIntro.${locale},
    resumeFile{asset->{url}},
    email, linkedin, github,
    "contactHeading": contactHeading.${locale},
    "contactBody": contactBody.${locale},
    "footerWink": footerWink.${locale}
  }`);
}

export async function getCategories(locale: Locale = 'en') {
  return client.fetch(
    `*[_type == "category"] | order(order asc){ "title": title.${locale}, "slug": slug.current }`
  );
}

export async function getProjects(locale: Locale = 'en') {
  return client.fetch(`
    *[_type == "project" && draft != true] | order(order asc){
      "title": title.${locale},
      "slug": slug.current,
      "summary": summary.${locale},
      image,
      link,
      tags,
      featured,
      "category": category->{"title": title.${locale}, "slug": slug.current}
    }
  `);
}

export async function getProjectBySlug(slug: string, locale: Locale = 'en') {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug && draft != true][0]{
      "title": title.${locale},
      "summary": summary.${locale},
      image, link, tags,
      "body": body.${locale},
      "category": category->{"title": title.${locale}, "slug": slug.current}
    }`,
    { slug }
  );
}

export async function getExperience(locale: Locale = 'en') {
  return client.fetch(`
    *[_type == "experience"] | order(order asc){
      "role": role.${locale},
      "organization": organization.${locale},
      startDate, endDate, current,
      "description": description.${locale}
    }
  `);
}
