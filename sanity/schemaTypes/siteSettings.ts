import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Your Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'role', title: 'Tagline / Role', type: 'string' }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline', type: 'string' }),
    defineField({
      name: 'heroAccent',
      title: 'Hero Accent Word',
      description:
        'A word or short phrase inside the headline to highlight in green italics. Must match text in the headline exactly.',
      type: 'string',
    }),
    defineField({ name: 'heroLede', title: 'Hero Subtext', type: 'text', rows: 3 }),
    defineField({
      name: 'aboutBio',
      title: 'About / Bio',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({ name: 'resumeIntro', title: 'Resume Intro (optional)', type: 'text', rows: 2 }),
    defineField({
      name: 'resumeFile',
      title: 'Resume PDF (optional)',
      type: 'file',
      options: { accept: '.pdf' },
    }),
    defineField({ name: 'email', title: 'Contact Email', type: 'string' }),
    defineField({ name: 'linkedin', title: 'LinkedIn URL', type: 'url' }),
    defineField({ name: 'github', title: 'GitHub URL (optional)', type: 'url' }),
    defineField({ name: 'contactHeading', title: 'Contact Heading', type: 'string' }),
    defineField({ name: 'contactBody', title: 'Contact Body', type: 'text', rows: 2 }),
    defineField({ name: 'footerWink', title: 'Footer Tagline (optional)', type: 'string' }),
  ],
  preview: { select: { title: 'name' } },
});
