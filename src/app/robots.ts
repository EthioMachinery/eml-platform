import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/ceo/', 
        '/seller/verify/', // Keep sensitive documents private
        '/api/wallet/', 
        '/api/admin/'
      ],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://trustworthymachinery.vercel.app'}/sitemap.xml`,
  };
}