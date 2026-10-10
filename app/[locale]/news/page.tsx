import type {Metadata} from 'next'
import {getTranslations} from 'next-intl/server'
import {NewsPage} from '@/components/news/NewsPage'
import {getBaseUrl} from '@/helpers'
import {routing} from '@/i18n/routing'

interface PageProps {
  params: Promise<{locale: string}>
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params
  const t = await getTranslations({locale, namespace: 'news'})
  const baseUrl = getBaseUrl()
  const localePath = locale === routing.defaultLocale ? '' : `/${locale}`

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: {
      canonical: `${baseUrl}${localePath}/news`,
      languages: {
        en: `${baseUrl}/news`,
        ru: `${baseUrl}/ru/news`,
      },
      types: {
        'application/rss+xml': `${baseUrl}${localePath}/feed.xml`,
      },
    },
  }
}

export default async function Page() {
  return <NewsPage />
}
