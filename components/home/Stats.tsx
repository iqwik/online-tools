import Link from 'next/link'
import {useTranslations} from 'next-intl'
import {getAllRegistryEntries} from '@/data'

export function Stats() {
  const t = useTranslations('home')
  const count = getAllRegistryEntries().length

  const items: Array<{value: string; label: string; href?: string}> = [
    {
      value: t('stats.tools.value', {count}),
      label: t('stats.tools.label').toLowerCase(),
      href: '/tools',
    },
    {
      value: t('stats.cost.value'),
      label: t('stats.cost.label').toLowerCase(),
    },
    {
      value: t('stats.signup.value'),
      label: t('stats.signup.label').toLowerCase(),
    },
    {
      value: t('stats.speed.value'),
      label: t('stats.speed.label').toLowerCase(),
    },
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-4">
      {items.map((item, i) => {
        const inner = (
          <div key={`inner-${i}`} className="flex items-baseline gap-1">
            <div className="font-extrabold">{item.value}</div>
            <div className="font-medium text-xs text-muted-foreground">
              {item.label}
            </div>
          </div>
        )

        return item.href ? (
          <Link
            key={item.label}
            href={item.href}
            className="transition-opacity hover:opacity-80"
          >
            {inner}
          </Link>
        ) : (
          <div key={item.label}>{inner}</div>
        )
      })}
    </div>
  )
}
