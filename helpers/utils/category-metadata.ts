// helpers/category-metadata.ts
import type {Metadata} from 'next'
import {getTranslations} from 'next-intl/server'
import {routing} from '@/i18n/routing'
import type {CategorySlug} from '@/types'
import {getBaseUrl} from './get-base-url'
import {getOgAlternateLocales, getOgLocale} from './og-locale'

export async function buildCategoryMetadata(
  locale: string,
  slug: CategorySlug,
): Promise<Metadata> {
  const t = await getTranslations({locale, namespace: 'categories'})
  const baseUrl = getBaseUrl()
  const localePath = locale === routing.defaultLocale ? '' : `/${locale}`
  const path = `/${slug}`
  const canonical = `${baseUrl}${localePath}${path}`

  const languages: Record<string, string> = {}
  for (const loc of routing.locales) {
    const locPath = loc === routing.defaultLocale ? '' : `/${loc}`
    languages[loc] = `${baseUrl}${locPath}${path}`
  }

  const title = t(`${slug}.metaTitle`)
  const description = t(`${slug}.metaDescription`)

  return {
    title,
    description,
    keywords: t(`${slug}.keywords`),
    alternates: {canonical, languages},
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      locale: getOgLocale(locale),
      alternateLocale: getOgAlternateLocales(locale),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
