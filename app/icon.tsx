import { ImageResponse } from 'next/og'
import { IconImage } from '@lib/components/icon-image'

export const dynamic = 'force-static'

const variants = [
  {
    id: 'small',
    size: {
      width: 128,
      height: 128,
    },
    contentType: 'image/png',
  },
  {
    id: 'medium',
    size: {
      width: 256,
      height: 256,
    },
    contentType: 'image/png',
  },
  {
    id: 'large',
    size: {
      width: 512,
      height: 512,
    },
    contentType: 'image/png',
  },
] as const

export function generateImageMetadata() {
  return variants
}

export default function Icon({ id }: { id: (typeof variants)[number]['id'] }) {
  const variant = variants.find((variant) => variant.id === id)!
  return new ImageResponse(<IconImage width={variant.size.width} height={variant.size.height} />, {
    ...variant.size,
  })
}
