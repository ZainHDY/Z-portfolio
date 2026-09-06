import { defineType, defineField } from 'sanity';

const localizedString = (name: string, title: string) =>
  defineField({ name, title, type: 'localizedText' });

const localizedText = (name: string, title: string, rows = 3) =>
  defineField({
    name,
    title,
    type: 'object',
    fields: [
      { name: 'en', title: 'English', type: 'text', rows },
      { name: 'ar', title: 'Arabic', type: 'text', rows },
    ],
  });

export default defineType({
  name: 'errorPage',
  title: 'Error Page',
  type: 'document',
  fields: [
    defineField({
      name: 'visual',
      title: 'Error Page Visual / PFP',
      type: 'image',
      options: { hotspot: true },
      description: 'Upload the visual you want to feature on the 404 and related error pages. Leave empty to use the built-in fallback.',
    }),
    localizedString('eyebrow', 'Eyebrow / Status Label'),
    localizedString('headline', 'Headline'),
    localizedText('body', 'Description', 4),
    localizedString('homeLabel', 'Back Home Button'),
    localizedString('projectsLabel', 'Projects Button'),
  ],
  preview: {
    select: { title: 'headline.en', media: 'visual' },
  },
});
