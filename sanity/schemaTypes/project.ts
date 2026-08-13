import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'summary',
      title: 'Short Summary',
      description: 'Shown on the project card. Keep it under ~240 characters.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(240),
    }),
    defineField({
      name: 'image',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'link', title: 'External Link (optional)', type: 'url' }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
    defineField({
      name: 'draft',
      title: 'Hide from site',
      description: 'Toggle on to keep this project unpublished.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'body',
      title: 'Full Write-up (optional)',
      description: 'Shown on the project detail page. Leave empty to just show the summary.',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    }),
  ],
  orderings: [
    { title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category.title', media: 'image' },
  },
});
