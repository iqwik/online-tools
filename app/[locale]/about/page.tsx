import type {Metadata} from 'next'
import {getTranslations} from 'next-intl/server'
import {BreadCrumbs} from '@/components/shared/BreadCrumbs'
import {SITE_NAME} from '@/helpers'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('about.meta')
  return {
    title: t('title'),
    description: t('description', {project: SITE_NAME}),
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
