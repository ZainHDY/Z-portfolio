import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title', title: 'Title', type: 'localizedText', validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.en' }, validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'category', title: 'Category', type: 'reference', to: [{ type: 'category' }] }),
    defineField({
      name: 'summary', title: 'Short Summary', description: 'Shown on the project card. Keep each language under ~240 characters.', type: 'localizedText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'image', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'link', title: 'External Link (optional)', type: 'url' }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }], options: { layout: 'tags' } }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
    defineField({ name: 'draft', title: 'Hide from site', description: 'Toggle on to keep this project unpublished.', type: 'boolean', initialValue: false }),
    defineField({
      name: 'body', title: 'Full Write-up (optional)', description: 'Provide the write-up in English and Arabic.', type: 'object',
      fields: [
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
        { name: 'ar', title: 'Arabic', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
      ],
    }),
  ],
  orderings: [{ title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'title.en', subtitle: 'category.title', media: 'image' } },
});
