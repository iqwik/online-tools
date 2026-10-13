import type {Metadata} from 'next'
import {getTranslations} from 'next-intl/server'
import {CategoryCards} from '@/components/home/CategoryCards'
import {FeaturedTools} from '@/components/home/FeaturedTools'
import {Hero} from '@/components/home/Hero'
import {HomeFaq} from '@/components/home/HomeFaq'
import {HomeSchema} from '@/components/home/HomeSchema'
import {NewsTeaser} from '@/components/home/NewsTeaser'
import {PrivacyNote} from '@/components/home/PrivacyNote'
import {RecentlyAdded} from '@/components/home/RecentlyAdded'
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
  const t = await getTranslations({locale, namespace: 'meta.home'})
  const baseUrl = getBaseUrl()
  const localePath = locale === routing.defaultLocale ? '' : `/${locale}`
  const canonical = `${baseUrl}${localePath}`

  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = `${baseUrl}${l === routing.defaultLocale ? '' : `/${l}`}`
  }

  const title = t('title')
  const description = t('description')

  return {
    title,
    description,
    alternates: {canonical, languages},
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

export default function HomePage() {
  return (
    <>
      <HomeSchema />
      <Hero />
      <CategoryCards />
      <FeaturedTools />
      <RecentlyAdded />
      <HomeFaq />
      <NewsTeaser />
      <PrivacyNote />
    </>
  )
}
