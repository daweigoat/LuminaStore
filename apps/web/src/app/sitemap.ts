import { MetadataRoute } from 'next';
import { api } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.luminastore.com';

  // In a real app, we would fetch all product slugs and categories here
  // const res = await api.get('/products');
  // const products = res.data.data;
  const products: any[] = []; // Mock for now

  const productUrls = products.map((p) => ({
    url: `${baseUrl}/products/${p.Slug}`,
    lastModified: new Date(p.UpdatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...productUrls,
  ];
}
