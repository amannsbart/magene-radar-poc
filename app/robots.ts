import { MetadataRoute } from 'next'
import { APP_URL } from '@config/index'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      disallow: ['/search?q=', '/admin/'],
    },
    sitemap: [`${APP_URL}/sitemap.xml`],
  }
}
