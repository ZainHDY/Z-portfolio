import { defineType } from 'sanity';

export default defineType({
  name: 'localizedTextArray',
  title: 'Localized Rich Text',
  type: 'object',
  fields: [
    {
      name: 'en',
      title: 'English',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'ar',
      title: 'Arabic',
      type: 'array',
      of: [{ type: 'block' }],
    },
  ],
});
