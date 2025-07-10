import type { MetadataRoute } from 'next'
import { APP_DEFAULT_TITLE, APP_NAME } from '@config/index'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${APP_NAME} - ${APP_DEFAULT_TITLE}`,
    short_name: APP_NAME,
    icons: [
      {
        src: '/icon/large',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    theme_color: '#0A0A0A',
    background_color: '#0A0A0A',
    display: 'standalone',
  }
}
