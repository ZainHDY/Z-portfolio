import { client } from './client';

export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]{
    ...,
    resumeFile{asset->{url}}
  }`);
}

export async function getCategories() {
  return client.fetch(
    `*[_type == "category"] | order(order asc){ title, "slug": slug.current }`
  );
}

export async function getProjects() {
  return client.fetch(`
    *[_type == "project" && draft != true] | order(order asc){
      title,
      "slug": slug.current,
      summary,
      image,
      link,
      tags,
      featured,
      "category": category->{title, "slug": slug.current}
    }
  `);
}

export async function getProjectBySlug(slug: string) {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug && draft != true][0]{
      title, summary, image, link, tags, body,
      "category": category->{title, "slug": slug.current}
    }`,
    { slug }
  );
}

export async function getExperience() {
  return client.fetch(`
    *[_type == "experience"] | order(order asc){
      role, organization, startDate, endDate, current, description
    }
  `);
}
