import { getProjects, getSiteSettings } from '@/lib/sanity/queries';

export const dynamic = 'force-dynamic';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const [settings, projects] = await Promise.all([getSiteSettings(), getProjects()]);

  const lines = [
    '# Zain Hamidy',
    '',
    `> ${settings?.role || 'Marketing Specialist'} — personal portfolio of Zain Hamidy.`,
    '',
    '## Pages',
    '',
    `- [Home](${siteUrl}/): Professional profile, about, projects, experience, resume, and contact information.`,
    '',
    '## Projects',
    '',
    ...projects.map((project: any) => {
      const description = project.summary || `${project.title} project by Zain Hamidy.`;
      return `- [${project.title}](${siteUrl}/projects/${project.slug}): ${description}`;
    }),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
