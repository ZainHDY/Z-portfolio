import { getProjects, getSiteSettings } from '@/lib/sanity/queries';

export const dynamic = 'force-dynamic';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const [enSettings, arSettings, enProjects, arProjects] = await Promise.all([
    getSiteSettings('en'), getSiteSettings('ar'), getProjects('en'), getProjects('ar'),
  ]);

  const lines = [
    '# Zain Hamidy',
    '',
    `> ${enSettings?.role || 'Marketing Specialist'} — personal portfolio of Zain Hamidy.`,
    '',
    '## English',
    '',
    `- [Home](${siteUrl}/en): ${enSettings?.heroLede || 'Professional profile, about, projects, experience, resume, and contact information.'}`,
    '',
    '### Projects',
    '',
    ...enProjects.map((project: any) => `- [${project.title}](${siteUrl}/en/projects/${project.slug}): ${project.summary || `${project.title} project by Zain Hamidy.`}`),
    '',
    '## العربية',
    '',
    `- [الرئيسية](${siteUrl}/ar): ${arSettings?.heroLede || 'الملف الشخصي والمشاريع والخبرة والسيرة الذاتية ومعلومات التواصل.'}`,
    '',
    '### المشاريع',
    '',
    ...arProjects.map((project: any) => `- [${project.title}](${siteUrl}/ar/projects/${project.slug}): ${project.summary || `مشروع ${project.title} بواسطة Zain Hamidy.`}`),
    '',
  ];

  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
