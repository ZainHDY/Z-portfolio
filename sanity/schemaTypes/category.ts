import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'category',
  title: 'Project Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'localizedText', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.en' }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title.en' } },
});
