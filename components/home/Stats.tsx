import {useTranslations} from 'next-intl'
import {getAllRegistryEntries} from '@/data'
import {Link} from '@/i18n/navigation'

export function Stats() {
  const t = useTranslations('home')
  const count = getAllRegistryEntries().length

  const items: Array<{value: string; label: string; href?: string}> = [
    {
      value: t('stats.tools.value', {count}),
      label: t('stats.tools.label').toLowerCase(),
      href: '/tools',
    },
    {value: t('stats.cost.value'), label: t('stats.cost.label').toLowerCase()},
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
    <div className="flex gap-3 m-auto py-4">
      {items.map((item, i) => {
        const inner = (
          <div className="flex items-center gap-1">
            <div className="font-extrabold">{item.value}</div>
            <div className="font-medium text-xs h-full text-muted-foreground">
              {item.label}
            </div>
          </div>
        )

        return (
          <div key={item.label} className="flex items-center gap-1 text-sm">
            {item.href ? (
              <Link
                href={item.href}
                className="transition-opacity hover:opacity-80"
              >
                {inner}
              </Link>
            ) : (
              inner
            )}
            {i < items.length - 1 && (
              <span className="text-muted-foreground/50 ml-2">•</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
