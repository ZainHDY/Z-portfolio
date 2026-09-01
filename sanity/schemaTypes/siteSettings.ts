import { defineType, defineField } from 'sanity';

const localizedString = (name: string, title: string) =>
  defineField({ name, title, type: 'localizedText' });

const localizedText = (name: string, title: string, rows = 3) =>
  defineField({ name, title, type: 'object', fields: [
    { name: 'en', title: 'English', type: 'text', rows },
    { name: 'ar', title: 'Arabic', type: 'text', rows },
  ] });

export default defineType({
  name: 'siteSettings', title: 'Site Settings', type: 'document',
  fields: [
    localizedString('name', 'Your Name'),
    localizedString('role', 'Tagline / Role'),
    localizedString('heroHeadline', 'Hero Headline'),
    localizedString('heroAccent', 'Hero Accent Word'),
    localizedText('heroLede', 'Hero Subtext'),
    defineField({ name: 'aboutBio', title: 'About / Bio', type: 'object', fields: [
      { name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }] },
      { name: 'ar', title: 'Arabic', type: 'array', of: [{ type: 'block' }] },
    ] }),
    localizedText('resumeIntro', 'Resume Intro (optional)', 2),
    defineField({ name: 'resumeFile', title: 'Resume PDF (optional)', type: 'file', options: { accept: '.pdf' } }),
    defineField({ name: 'profileImage', title: 'Profile Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'brandMark', title: 'Brand Mark / Favicon (ZH)', type: 'image', options: { hotspot: true }, description: 'Upload your ZH star mark. This can replace the favicon/brand mark later without changing code.' }),
    defineField({ name: 'email', title: 'Contact Email', type: 'string' }),
    defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'github', title: 'GitHub URL (optional)', type: 'url' }),
    defineField({ name: 'googleScholar', title: 'Google Scholar URL (optional)', type: 'url' }),
    localizedString('contactHeading', 'Contact Heading'),
    localizedText('contactBody', 'Contact Body', 2),
    localizedString('footerWink', 'Footer Tagline (optional)'),
  ],
  preview: { select: { title: 'name.en', media: 'profileImage' } },
});
