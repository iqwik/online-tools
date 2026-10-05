'use client'

import {ArrowRight02Icon} from '@animateicons/react/huge/arrow-right-0-2-icon'
import {useTranslations} from 'next-intl'
import {useRef} from 'react'
import {
  CATEGORY_COLORS,
  Category,
  categories,
  getRegistryEntriesByCategory,
} from '@/data'
import {Link} from '@/i18n/navigation'
import {IconHandle} from '@/types'

interface CategoryPreviewProps extends Category {
  name: string
  count: number | string
  colors: (typeof CATEGORY_COLORS)[keyof typeof CATEGORY_COLORS]
}

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
      }) satisfies CategoryPreviewProps,
  )

  return (
    <section className="page">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({count, ...props}) => (
          <CategoryPreview
            {...props}
            key={props.slug}
            count={tCategory('toolsCount', {count})}
          />
        ))}
      </div>
    </section>
  )
}

function CategoryPreview({
  slug,
  Icon,
  name,
  count,
  colors,
}: CategoryPreviewProps) {
  const iconRef = useRef<IconHandle>(null)
  const iconArrowRef = useRef<IconHandle>(null)

  return (
    <Link
      href={`/${slug}`}
      onMouseEnter={() => {
        iconRef.current?.startAnimation()
        iconArrowRef.current?.startAnimation()
      }}
      onMouseLeave={() => {
        iconRef.current?.stopAnimation()
        iconArrowRef.current?.stopAnimation()
      }}
      className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-all duration-300 hover:shadow-md"
    >
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${colors.background} ${colors.color}`}
      >
        <Icon ref={iconRef} isAnimated={false} className="size-5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-semibold">{name}</span>
        <span className="text-xs text-muted-foreground">{count}</span>
      </div>
      <ArrowRight02Icon
        ref={iconArrowRef}
        isAnimated={false}
        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  )
}
