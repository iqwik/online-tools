import type {Metadata} from 'next'
import {getLocale, getTranslations} from 'next-intl/server'
import {BreadCrumbs} from '@/components/shared/BreadCrumbs'
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
  const t = await getTranslations({locale, namespace: 'privacy.meta'})
  const baseUrl = getBaseUrl()
  const localePath = locale === routing.defaultLocale ? '' : `/${locale}`
  const canonical = `${baseUrl}${localePath}/privacy`

  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] =
      `${baseUrl}${l === routing.defaultLocale ? '' : `/${l}`}/privacy`
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
      images: [
        {url: '/og-default.jpg', width: 1200, height: 630, alt: SITE_NAME},
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

export default async function PrivacyPage() {
  const t = await getTranslations('privacy')
  const locale = await getLocale()

  const sections = [
    // 'data',
    'storage',
    'analytics',
    // 'thirdparty',
    'changes',
    'contact',
  ] as const

  return (
    <article className="page flex flex-col gap-6 text-sm">
      <BreadCrumbs items={[{title: t('meta.title')}]} />
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-xs text-muted-foreground">
          {t('updated', {
            date: new Date('2026-09-29').toLocaleDateString(locale),
          })}
        </p>
      </div>

      <p className="text-md text-muted-foreground p-4 rounded-xl border bg-card">
        {t('intro')}
      </p>

      <ul className="space-y-6 list-none">
        {sections.map(key => (
          <li
            key={key}
            className="flex items-start gap-1 before:content-['▸_']"
          >
            <div className="flex flex-col gap-1">
              <div className="text-md font-semibold">
                {t(`sections.${key}.title`)}
              </div>
              <p className="text-muted-foreground">
                {t(`sections.${key}.text`)}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
}
