import {getTranslations} from 'next-intl/server'
import {getBaseUrl} from '@/helpers'
import type {ToolConfig} from '@/types'
import {BreadCrumbs} from '../shared/BreadCrumbs'
import {ContentSection} from '../shared/ContentSection'
import {FAQ} from '../shared/FAQ'
import {FeatureSection} from '../shared/FeatureSection'
import {HowToUseSection} from '../shared/HowToUseSection'
import {Related} from '../shared/Related'
import {ToolSchema} from './ToolSchema'
import {ToolView} from './ToolView'

interface Props {
  config: ToolConfig
}

export async function ToolLayout({config}: Props) {
  const tConfig = await getTranslations('config')
  const tCategories = await getTranslations('categories')
  const baseUrl = getBaseUrl()

  const breadcrumbs = [
    {
      href: `/${config.category}`,
      title: tCategories(`${config.category}.name`),
    },
    {
      title: tConfig(config.h1),
    },
  ]

  return (
    <div className="page">
      <BreadCrumbs items={breadcrumbs} />

      <article className="flex flex-col gap-8">
        <section data-role="header">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {tConfig(config.h1)}
          </h1>
          <p className="mt-2 text-base leading-relaxed text-muted-foreground">
            {tConfig(config.description)}
          </p>
        </section>

        <HowToUseSection slug={config.slug} />
        <ToolView config={config} />
        <FeatureSection slug={config.slug} />
        <ContentSection
          slug={config.slug}
          titleKey="useCasesTitle"
          itemsKey="useCases"
        />

        {config.faq && config.faq.length > 0 && <FAQ items={config.faq} />}

        {config.related && config.related.length > 0 && (
          <Related slugs={config.related} />
        )}
      </article>

      <ToolSchema tool={config} url={`${baseUrl}/${config.slug}`} />
    </div>
  )
}
