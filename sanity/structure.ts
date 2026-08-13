import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings')
        ),
      S.divider(),
      S.documentTypeListItem('category').title('Project Categories'),
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('experience').title('Resume / Experience'),
    ]);
