import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'experience',
  title: 'Resume Entry',
  type: 'document',
  fields: [
    defineField({
      name: 'role',
      title: 'Role / Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      options: { dateFormat: 'MMM YYYY' },
    }),
    defineField({ name: 'current', title: 'Currently here', type: 'boolean', initialValue: false }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      options: { dateFormat: 'MMM YYYY' },
      hidden: ({ document }) => !!document?.current,
    }),
    defineField({
      name: 'description',
      title: 'Description (optional)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({ name: 'order', title: 'Order', type: 'number', initialValue: 0 }),
  ],
  orderings: [
    { title: 'Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: { select: { title: 'role', subtitle: 'organization' } },
});
