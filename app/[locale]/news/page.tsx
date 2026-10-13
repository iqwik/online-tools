import type {Metadata} from 'next'
import {getTranslations} from 'next-intl/server'
import {NewsPage} from '@/components/news/NewsPage'
import {
  getBaseUrl,
  getOgAlternateLocales,
  getOgLocale,
  SITE_NAME,
} from '@/helpers'
import {routing} from '@/i18n/routing'

interface PageProps {
  params: Promise<{locale: string}>
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params
  const t = await getTranslations({locale, namespace: 'news'})
  const baseUrl = getBaseUrl()
  const localePath = locale === routing.defaultLocale ? '' : `/${locale}`
  const canonical = `${baseUrl}${localePath}/news`
  const title = t('metaTitle')
  const description = t('metaDescription')

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${baseUrl}/news`,
        ru: `${baseUrl}/ru/news`,
      },
      types: {
        'application/rss+xml': `${baseUrl}${localePath}/feed.xml`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url: canonical,
      locale: getOgLocale(locale),
      alternateLocale: getOgAlternateLocales(locale),
      images: [{url: '/og-default.jpg', width: 1200, height: 630, alt: title}],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-default.jpg'],
    },
  }
}

export default async function Page() {
  return <NewsPage />
}
