import type {Metadata} from 'next'
import {getTranslations} from 'next-intl/server'
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
  const t = await getTranslations({locale, namespace: 'about.meta'})
  const baseUrl = getBaseUrl()
  const localePath = locale === routing.defaultLocale ? '' : `/${locale}`
  const canonical = `${baseUrl}${localePath}/about`

  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] =
      `${baseUrl}${l === routing.defaultLocale ? '' : `/${l}`}/about`
  }

  const title = t('title')
  const description = t('description', {project: SITE_NAME})

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

export default async function AboutPage() {
  const t = await getTranslations('about')

  return (
    <article className="page flex flex-col gap-6 text-sm">
      <BreadCrumbs items={[{title: t('meta.title')}]} />
      <h1 className="text-2xl font-bold tracking-tight">
        {t('title', {project: SITE_NAME})}
      </h1>

      <p className="text-muted-foreground">
        {t('intro', {project: SITE_NAME})}
      </p>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{t('mission.title')}</h2>
        <p className="text-muted-foreground">{t('mission.text')}</p>
        <ul className="space-y-1 text-muted-foreground">
          <li>▸ {t('mission.points.free')}</li>
          <li>▸ {t('mission.points.fast')}</li>
          <li>▸ {t('mission.points.private')}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">{t('offer.title')}</h2>
        <p className="text-muted-foreground">{t('offer.text')}</p>
        <ul className="space-y-1 text-muted-foreground">
          <li>▸ {t('offer.finance')}</li>
          <li>▸ {t('offer.health')}</li>
          <li>▸ {t('offer.text')}</li>
          <li>▸ {t('offer.developer')}</li>
          <li>▸ {t('offer.generators')}</li>
          <li>▸ {t('offer.business')}</li>
        </ul>
      </section>

      {/* <section className="mt-4 rounded-xl border bg-card p-6 flex flex-col gap-2">
        <h2 className="text-xl font-semibold">{t('contact.title')}</h2>
        <p className="text-muted-foreground">{t('contact.text')}</p>
      </section> */}
    </article>
  )
}
