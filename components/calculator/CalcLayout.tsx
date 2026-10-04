import {getTranslations} from 'next-intl/server'
import {getBaseUrl} from '@/helpers'
import type {CalculatorConfig} from '@/types'
import {BreadCrumbs} from '../shared/BreadCrumbs'
import {ContentSection} from '../shared/ContentSection'
import {FAQ} from '../shared/FAQ'
import {FeatureSection} from '../shared/FeatureSection'
import {HowToUseSection} from '../shared/HowToUseSection'
import {RelatedTools} from '../shared/RelatedTools'
import {Badge} from '../ui/badge'
import {CalculatorForm} from './CalculatorForm'
import {CalculatorSchema} from './CalculatorSchema'

interface Props {
  config: CalculatorConfig
}

export async function CalcLayout({config}: Props) {
  const tConfig = await getTranslations('config')
  const tCategories = await getTranslations('categories')
  const baseUrl = getBaseUrl()

  return (
    <article className="page">
      <BreadCrumbs categorySlug={config.category} name={config.h1} />

      <header className="mb-8">
        <Badge
          variant="outline"
          className="mb-4 rounded-full border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-primary uppercase"
        >
          {tCategories(`${config.category}.shortName`)}
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {tConfig(config.h1)}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {tConfig(config.description)}
        </p>
      </header>

      <HowToUseSection slug={config.slug} />

      <div className="mt-6 rounded-xl border bg-card p-6">
        <CalculatorForm slug={config.slug} />
      </div>

      <FeatureSection slug={config.slug} />

      <ContentSection
        slug={config.slug}
        titleKey="useCasesTitle"
        itemsKey="useCases"
      />

      {config.faq && config.faq.length > 0 && <FAQ items={config.faq} />}

      {config.related && config.related.length > 0 && (
        <RelatedTools slugs={config.related} />
      )}

      <CalculatorSchema calc={config} url={`${baseUrl}/${config.slug}`} />
    </article>
  )
}
