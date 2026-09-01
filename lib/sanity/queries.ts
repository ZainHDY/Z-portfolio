import { client } from './client';

export type Locale = 'en' | 'ar';
const localized = (field: string, locale: Locale) => `${field}.${locale}`;

export async function getSiteSettings(locale: Locale = 'en') {
  return client.fetch(`*[_type == "siteSettings"][0]{
    "name": ${localized('name', locale)}, "role": ${localized('role', locale)},
    "heroHeadline": ${localized('heroHeadline', locale)}, "heroAccent": ${localized('heroAccent', locale)},
    "heroLede": ${localized('heroLede', locale)}, "aboutBio": ${localized('aboutBio', locale)},
    "resumeIntro": ${localized('resumeIntro', locale)}, resumeFile{asset->{url}},
    profileImage, brandMark{asset->{url}}, email, linkedin, github,
    "contactHeading": ${localized('contactHeading', locale)}, "contactBody": ${localized('contactBody', locale)},
    "footerWink": ${localized('footerWink', locale)}
  }`);
}

export async function getCategories(locale: Locale = 'en') {
  return client.fetch(`*[_type == "category"] | order(order asc){ "title": ${localized('title', locale)}, "slug": slug.current }`);
}

export async function getProjects(locale: Locale = 'en') {
  return client.fetch(`*[_type == "project" && draft != true] | order(order asc){
    "title": ${localized('title', locale)}, "slug": slug.current, "summary": ${localized('summary', locale)},
    image, link, tags, featured, "category": category->{"title": ${localized('title', locale)}, "slug": slug.current}
  }`);
}

export async function getProjectBySlug(slug: string, locale: Locale = 'en') {
  return client.fetch(`*[_type == "project" && slug.current == $slug && draft != true][0]{
    "title": ${localized('title', locale)}, "summary": ${localized('summary', locale)}, image, link, tags,
    "body": ${localized('body', locale)}, "category": category->{"title": ${localized('title', locale)}, "slug": slug.current}
  }`, { slug });
}

export async function getExperience(locale: Locale = 'en') {
  return client.fetch(`*[_type == "experience"] | order(order asc){
    "role": ${localized('role', locale)}, "organization": ${localized('organization', locale)},
    startDate, endDate, current, "description": ${localized('description', locale)}
  }`);
}
