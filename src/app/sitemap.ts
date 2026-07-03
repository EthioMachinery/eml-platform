import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase/adminClient';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://trustworthymachinery.vercel.app';

  // 1. Fetch all active machine IDs
  const { data: machines } = await supabaseAdmin
    .from('machinery')
    .select('id, updated_at')
    .eq('status', 'active');

  const machineUrls = (machines || []).map((m) => ({
    url: `${baseUrl}/machinery/${m.id}`,
    lastModified: new Date(m.updated_at),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // 2. Static Routes
  const staticRoutes = [
    '',
    '/browse',
    '/services',
    '/about',
    '/pricing',
    '/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 1.0,
  }));

  return [...staticRoutes, ...machineUrls];
}