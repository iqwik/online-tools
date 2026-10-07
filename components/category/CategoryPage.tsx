import {ArrowRight02Icon} from '@animateicons/react/huge/arrow-right-0-2-icon'
import {notFound} from 'next/navigation'
import {getTranslations} from 'next-intl/server'
import {getCategory, getRegistryEntriesByCategory, getToolsCount} from '@/data'
import {Link} from '@/i18n/navigation'
import type {CategorySlug} from '@/types'
import {BreadCrumbs} from '../shared/BreadCrumbs'
import {ContentSection} from '../shared/ContentSection'
import {EntryPreview} from '../shared/EntryPreview'
import {FAQ} from '../shared/FAQ'
import {FeatureSection} from '../shared/FeatureSection'
import {HowToUseSection} from '../shared/HowToUseSection'
import {CategorySchema} from './CategorySchema'

interface Props {
  slug: CategorySlug
}

export async function CategoryPage({slug}: Props) {
  const cat = getCategory(slug)
  if (!cat) notFound()

  const t = await getTranslations('categories')
  const tHomeFeatured = await getTranslations('home.featured')
  const tCat = await getTranslations('category')

  const entries = getRegistryEntriesByCategory(slug)

  const faqItems = [
    {q: `${slug}.faq.q1`, a: `${slug}.faq.a1`},
    {q: `${slug}.faq.q2`, a: `${slug}.faq.a2`},
    {q: `${slug}.faq.q3`, a: `${slug}.faq.a3`},
    {q: `${slug}.faq.q4`, a: `${slug}.faq.a4`},
    {q: `${slug}.faq.q5`, a: `${slug}.faq.a5`},
  ]

  const count = getToolsCount()

  return (
    <>
      <CategorySchema slug={slug} />
      <div className="page">
        <BreadCrumbs items={[{title: t(`${slug}.name`)}]} />
        <article className="flex flex-col gap-8">
          <section data-role="header">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t(`${slug}.name`)}
            </h1>
            <p className="mt-2 text-base leading-relaxed text-muted-foreground">
              {t(`${slug}.intro`)}
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <p className="font-tag text-xs font-bold tracking-[0.14em] uppercase text-muted-foreground">
              {tCat('toolsCount', {count: entries.length})}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map(entry => (
                <EntryPreview
                  key={entry.config.slug}
                  slug={entry.config.slug}
                />
              ))}
            </div>
          </section>

          <div className="flex justify-center">
            <Link
              href="/tools"
              className="group flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {tHomeFeatured('viewAll', {count})}
              <ArrowRight02Icon
                isAnimated={false}
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <HowToUseSection slug={slug} namespace="categories" />
          <FeatureSection slug={slug} namespace="categories" />
          <ContentSection
            slug={slug}
            namespace="categories"
            titleKey="useCasesTitle"
            itemsKey="useCases"
          />
          <FAQ namespace="categories" items={faqItems} />
        </article>
      </div>
    </>
  )
}
