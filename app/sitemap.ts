import { MetadataRoute } from 'next'
import { APP_URL } from '@config/index'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
  ]

  const sitemap = [...staticPages]

  return sitemap
}
