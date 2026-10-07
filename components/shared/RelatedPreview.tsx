'use client'

import {ArrowRight02Icon} from '@animateicons/react/huge/arrow-right-0-2-icon'
import {cn} from 'cn'
import {useRef} from 'react'
import {CATEGORY_COLORS, Category} from '@/data/categories'
import {Link} from '@/i18n/navigation'
import {IconHandle} from '@/types'

export interface RelatedPreviewProps extends Pick<Category, 'Icon'> {
  slug: string
  name: string
  count?: number | string
  colors?: (typeof CATEGORY_COLORS)[keyof typeof CATEGORY_COLORS]
}

export function RelatedPreview({
  slug,
  Icon,
  name,
  count,
  colors,
}: RelatedPreviewProps) {
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
      className="group flex items-center gap-3 overflow-hidden rounded-xl border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
    >
      <span
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-lg',
          colors?.background,
          colors?.color,
        )}
      >
        <Icon ref={iconRef} isAnimated={false} className="size-5" />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-semibold leading-4.25">{name}</span>
        {Boolean(count) && (
          <span className="text-xs text-muted-foreground">{count}</span>
        )}
      </div>
      <ArrowRight02Icon
        ref={iconArrowRef}
        isAnimated={false}
        className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  )
}
