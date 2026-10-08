import type {Metadata, Viewport} from 'next'
import {NextIntlClientProvider} from 'next-intl'
import {getMessages, getTranslations} from 'next-intl/server'
import {ReactNode} from 'react'
import {AppSidebar} from '@/components/layout/AppSidebar'
import {ThemeProvider} from '@/components/providers/theme-provider'
import {SearchTrigger} from '@/components/search/SearchTrigger'
import {SidebarProvider, SidebarTrigger} from '@/components/ui/sidebar'
import {
  getBaseUrl,
  getOgAlternateLocales,
  getOgLocale,
  SITE_NAME,
} from '@/helpers'
import {routing} from '@/i18n/routing'
import '../globals.css'

import {GoogleAnalytics} from '@next/third-parties/google'
import {Geist_Mono, Inter, JetBrains_Mono} from 'next/font/google'
import {YandexMetrica} from '@/components/analytics/yandex-metrica'
import {CookieConsent} from '@/components/cookie-consent'
import {SidebarStateProvider} from '@/components/providers/sidebar-state-provider'
import {SearchProvider} from '@/components/search/SearchProvider'
import {Footer} from '@/components/shared/Footer'
import {ShareButton} from '@/components/shared/ShareButton'
import {TooltipProvider} from '@/components/ui/tooltip'

export function generateStaticParams() {
  return routing.locales.map(locale => ({locale}))
}

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

const geistMono = Geist_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-geist-mono',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>
}): Promise<Metadata> {
  const {locale} = await params
  const t = await getTranslations({locale, namespace: 'meta.site'})

  const title = t('title')
  const description = t('description')

  return {
    metadataBase: new URL(getBaseUrl()),
    title,
    description,
    applicationName: SITE_NAME,
    authors: [{name: SITE_NAME}],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    icons: {
      icon: [
        {url: '/favicon.ico', sizes: 'any'},
        {url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png'},
        {url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
        {url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png'},
        {url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png'},
      ],
      apple: {url: '/apple-touch-icon.png', sizes: '180x180'},
      other: [
        {
          rel: 'icon',
          url: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          rel: 'icon',
          url: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    manifest: '/site.webmanifest',
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      locale: getOgLocale(locale),
      alternateLocale: getOgAlternateLocales(locale),
      images: [
        {
          url: '/og-default.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-default.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#ffffff'},
    {media: '(prefers-color-scheme: dark)', color: '#0F172A'},
  ],
}

interface LayoutProps {
  children: ReactNode
  params: Promise<{locale: string}>
}

export default async function LocaleLayout({children, params}: LayoutProps) {
  const {locale} = await params
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            <TooltipProvider>
              <SearchProvider>
                <SidebarProvider defaultOpen>
                  <SidebarStateProvider>
                    <AppSidebar />
                    <main className="flex flex-col flex-1 overflow-y-auto">
                      <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4 sm:hidden">
                        <SidebarTrigger />
                        <div className="flex flex-1 items-center justify-end gap-1.5">
                          <SearchTrigger variant="icon" />
                          <ShareButton className="bg-card/80 size-9 rounded-lg backdrop-blur border" />
                        </div>
                      </header>
                      <div className="hidden sm:block fixed top-3 right-3 z-30 print:hidden">
                        <ShareButton className="bg-card/80 backdrop-blur border shadow-sm" />
                      </div>
                      <div className="flex flex-col flex-1">{children}</div>
                      <Footer />
                      <CookieConsent />
                    </main>
                  </SidebarStateProvider>
                </SidebarProvider>
              </SearchProvider>
            </TooltipProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        ) : null}
        {process.env.NEXT_PUBLIC_YM_ID ? (
          <YandexMetrica counterId={Number(process.env.NEXT_PUBLIC_YM_ID)} />
        ) : null}
      </body>
    </html>
  )
}
