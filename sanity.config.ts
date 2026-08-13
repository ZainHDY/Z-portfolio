import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { ChartUpwardIcon } from '@sanity/icons';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/structure';
import StatsTool from './sanity/components/StatsTool';

export default defineConfig({
  name: 'default',
  title: 'Portfolio Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
  tools: (prev) => [
    ...prev,
    {
      name: 'stats',
      title: 'Visit Stats',
      icon: ChartUpwardIcon,
      component: StatsTool,
    },
  ],
});
