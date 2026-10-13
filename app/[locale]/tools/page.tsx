import type {Metadata} from 'next'
import {getTranslations} from 'next-intl/server'
import {BreadCrumbs} from '@/components/shared/BreadCrumbs'
import {ToolGrid} from '@/components/tools/ToolGrid'
import {ToolsSchema} from '@/components/tools/ToolsSchema'
import {getToolsCount} from '@/data/registry'
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
  const t = await getTranslations({locale, namespace: 'meta.tools'})
  const count = getToolsCount()
  const baseUrl = getBaseUrl()
  const localePath = locale === routing.defaultLocale ? '' : `/${locale}`
  const path = '/tools'
  const canonical = `${baseUrl}${localePath}${path}`

  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] =
      `${baseUrl}${l === routing.defaultLocale ? '' : `/${l}`}${path}`
  }

  const title = t('title')
  const description = t('description', {count})

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

export default async function ToolsPage() {
  const t = await getTranslations('tools')
  const count = getToolsCount()
  return (
    <>
      <ToolsSchema />
      <header className="page mb-2">
        <BreadCrumbs items={[{title: t('h1')}]} />
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t('h1')}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {t('description', {count})}
        </p>
      </header>
      <ToolGrid />
    </>
  )
}
