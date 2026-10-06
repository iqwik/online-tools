'use client'

import {useTranslations} from 'next-intl'
import {CATEGORY_COLORS, categories, getRegistryEntriesByCategory} from '@/data'
import {RelatedPreview, RelatedPreviewProps} from '../shared/RelatedPreview'

export function CategoryCards() {
  const t = useTranslations('categories')
  const tCategory = useTranslations('category')

  const items = categories.map(
    cat =>
      ({
        slug: cat.slug,
        Icon: cat.Icon,
        name: t(`${cat.slug}.name`),
        count: getRegistryEntriesByCategory(cat.slug).length,
        colors: CATEGORY_COLORS[cat.slug],
      }) satisfies RelatedPreviewProps,
  )

  return (
    <section className="page">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:grid-cols-3">
        {items.map(({count, ...props}) => (
          <RelatedPreview
            {...props}
            key={props.slug}
            count={tCategory('toolsCount', {count})}
          />
        ))}
      </div>
    </section>
  )
}
