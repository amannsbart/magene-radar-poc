import bundleAnalyzer from '@next/bundle-analyzer'
import { withBotId } from 'botid/next/config'
import type { NextConfig } from 'next'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: true,
})

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
    ],
    minimumCacheTTL: 2678400,
  },
}

export default process.env.ANALYZE === 'true'
  ? withBundleAnalyzer(withBotId(nextConfig))
  : withBotId(nextConfig)
