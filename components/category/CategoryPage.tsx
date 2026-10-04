import {ArrowLeft} from 'lucide-react'
import {notFound} from 'next/navigation'
import {getTranslations} from 'next-intl/server'
import {getCategory, getRegistryEntriesByCategory} from '@/data'
import {Link} from '@/i18n/navigation'
import type {CategorySlug} from '@/types'
import {ContentSection} from '../shared/ContentSection'
import {EntryPreview} from '../shared/EntryPreview'
import {FAQ} from '../shared/FAQ'
import {FeatureSection} from '../shared/FeatureSection'
import {HowToUseSection} from '../shared/HowToUseSection'
import {Button} from '../ui/button'

interface Props {
  slug: CategorySlug
}

export async function CategoryPage({slug}: Props) {
  const cat = getCategory(slug)
  if (!cat) notFound()

  const t = await getTranslations('categories')
  const tCat = await getTranslations('category')
  const tGlobal = await getTranslations('global')

  const entries = getRegistryEntriesByCategory(slug)

  const faqItems = [
    {q: `${slug}.faq.q1`, a: `${slug}.faq.a1`},
    {q: `${slug}.faq.q2`, a: `${slug}.faq.a2`},
    {q: `${slug}.faq.q3`, a: `${slug}.faq.a3`},
    {q: `${slug}.faq.q4`, a: `${slug}.faq.a4`},
    {q: `${slug}.faq.q5`, a: `${slug}.faq.a5`},
  ]

  return (
    <div className="page flex flex-col gap-8">
      <div data-role="header" className="flex items-center">
        <Button
          size="sm"
          variant="link"
          render={<Link href="/" />}
          nativeButton={false}
          className="h-11.5 gap-1.5 text-muted-foreground hover:text-muted-foreground/80"
        >
          <ArrowLeft className="size-6" />
        </Button>

        <h1 className="text-2xl  font-bold tracking-tight sm:text-3xl">
          {t(`${slug}.name`)}
        </h1>
      </div>

      <section>
        <p className="text-base leading-relaxed text-muted-foreground">
          {t(`${slug}.intro`)}
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <p className="font-tag text-xs font-bold tracking-[0.14em] uppercase text-muted-foreground">
          {tCat('toolsCount', {count: entries.length})}
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(entry => (
            <EntryPreview key={entry.config.slug} slug={entry.config.slug} />
          ))}
        </div>
      </section>

      <HowToUseSection slug={slug} namespace="categories" />

      <FeatureSection slug={slug} namespace="categories" />

      <ContentSection
        slug={slug}
        namespace="categories"
        titleKey="useCasesTitle"
        itemsKey="useCases"
      />

      <FAQ namespace="categories" items={faqItems} />
    </div>
  )
}
