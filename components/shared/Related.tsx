'use client'

import {useTranslations} from 'next-intl'
import {CATEGORY_COLORS, getCalculatorBySlug, getToolBySlug} from '@/data'
import {RelatedPreview} from './RelatedPreview'

interface Props {
  slugs: string[]
}

export function Related({slugs}: Props) {
  const t = useTranslations('global')
  const tConfig = useTranslations('config')

  if (slugs.length === 0) return null

  const items = slugs
    .map(slug => {
      const calc = getCalculatorBySlug(slug)

      if (calc) {
        return {
          slug,
          titleKey: calc.h1,
          Icon: calc.Icon,
          colors: CATEGORY_COLORS?.[calc.category],
        }
      }
      const tool = getToolBySlug(slug)
      if (tool) {
        return {
          slug,
          titleKey: tool.h1,
          Icon: tool.Icon,
          colors: CATEGORY_COLORS?.[tool.category],
        }
      }
      return null
    })
    .filter(x => x !== null)

  if (items.length === 0) return null

  return (
    <section>
      <h2 className="mb-4 text-2xl font-semibold">{t('related')}</h2>
      <div className="grid sm:grid-cols-4 gap-2">
        {items.map(item => (
          <RelatedPreview
            key={item.slug}
            slug={item.slug}
            Icon={item.Icon}
            name={tConfig(item.titleKey)}
            colors={item?.colors}
          />
        ))}
      </div>
    </section>
  )
}
