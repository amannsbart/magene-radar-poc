import { GeistSans } from 'geist/font/sans'
import { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { APP_NAME, APP_DEFAULT_TITLE, APP_DESCRIPTION, APP_URL, APP_AUTHOR } from '@config/index'
import { ErudaLoader } from '@lib/components/eruda-loader'
import { Header } from '@lib/components/header'
import { Toaster } from '@lib/components/ui/sonner'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  applicationName: APP_NAME,
  title: {
    template: `%s | ${APP_NAME}`,
    default: `${APP_NAME} - ${APP_DEFAULT_TITLE}`,
  },
  description: APP_DESCRIPTION,
  authors: [{ name: APP_AUTHOR, url: APP_URL }],
  creator: APP_AUTHOR,
  publisher: APP_AUTHOR,
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: `${APP_NAME} - ${APP_DEFAULT_TITLE}`,
    description: APP_DESCRIPTION,
    url: APP_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} - ${APP_DEFAULT_TITLE}`,
    description: APP_DESCRIPTION,
    creator: APP_AUTHOR,
    site: APP_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: APP_URL,
  },
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning className={` ${GeistSans.className} scroll-smooth`} lang="en">
      <body className="flex min-h-dvh w-full min-w-[360px] flex-col items-center">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          themes={['light', 'dark', 'system']}
        >
          <Header />
          <main className="bg-background w-full overflow-y-auto px-4 pb-12 pt-4 2xl:max-w-7xl">
            {children}
          </main>
          <ErudaLoader />
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
