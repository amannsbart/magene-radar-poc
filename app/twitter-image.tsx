import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { SocialImage } from '@lib/components/social-image'

export const alt = 'Doremus Advisors'
export default async function Image() {
  const dmSerif = await readFile(join(process.cwd(), 'public/fonts/DMSerifText-Regular.ttf'))
  const geistSans = await readFile(join(process.cwd(), 'public/fonts/Geist-Regular.ttf'))

  return new ImageResponse(<SocialImage />, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'DM Serif Text',
        data: dmSerif,
        style: 'normal',
        weight: 400,
      },
      {
        name: 'Geist Sans',
        data: geistSans,
        style: 'normal',
        weight: 400,
      },
    ],
  })
}
