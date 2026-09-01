import { defineType } from 'sanity';

export default defineType({
  name: 'localizedPortableText',
  title: 'Localized Rich Text',
  type: 'object',
  fields: [
    {
      name: 'en',
      title: 'English',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    },
    {
      name: 'ar',
      title: 'Arabic',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    },
  ],
});
