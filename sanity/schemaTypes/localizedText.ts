import { defineType } from 'sanity';

export default defineType({
  name: 'localizedText',
  title: 'Localized Text',
  type: 'object',
  fields: [
    { name: 'en', title: 'English', type: 'string' },
    { name: 'ar', title: 'Arabic', type: 'string' },
  ],
});
