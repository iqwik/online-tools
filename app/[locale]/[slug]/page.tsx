import type {Metadata} from 'next'
import {notFound} from 'next/navigation'
import {getTranslations} from 'next-intl/server'
import {CalcLayout} from '@/components/calculator/CalcLayout'
import {ToolLayout} from '@/components/tool/ToolLayout'
import {getAllRegistryEntries, getRegistryEntry} from '@/data'
import {
  getBaseUrl,
  getOgAlternateLocales,
  getOgLocale,
  SITE_NAME,
} from '@/helpers'
import {routing} from '@/i18n/routing'

interface PageProps {
  params: Promise<{locale: string; slug: string}>
}

export async function generateStaticParams() {
  return getAllRegistryEntries().map(entry => ({slug: entry.config.slug}))
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale, slug} = await params
  const entry = getRegistryEntry(slug)
  if (!entry) return {}

  const t = await getTranslations({locale, namespace: 'config'})
  const baseUrl = getBaseUrl()
  const localePath = locale === routing.defaultLocale ? '' : `/${locale}`

  const title = t(entry.config.title)
  const description = t(entry.config.metaDescription)
  const url = `${baseUrl}${localePath}/${entry.config.slug}`

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/${entry.config.slug}`,
        ru: `${baseUrl}/ru/${entry.config.slug}`,
      },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title,
      description,
      url,
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
  }
}

export default async function Page({params}: PageProps) {
  const {slug} = await params
  const entry = getRegistryEntry(slug)
  if (!entry) notFound()

  if (entry.type === 'calculator') {
    return <CalcLayout config={entry.config} />
  }

  return <ToolLayout config={entry.config} />
}
