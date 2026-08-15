import { createClient } from 'next-sanity';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2024-01-01';

// Public read client — used for all public-site data fetching.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

// Server-only write client — used ONLY inside API routes (never sent to the browser).
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
