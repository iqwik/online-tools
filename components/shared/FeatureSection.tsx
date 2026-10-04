import {CheckIcon} from '@animateicons/react/lucide/check-icon'
import {useTranslations} from 'next-intl'

interface FeatureItem {
  title: string
  description: string
}

interface FeatureSectionProps {
  slug: string
  namespace?: string
  titleKey?: string
  itemsKey?: string
}

export function FeatureSection({
  slug,
  namespace = 'config',
  titleKey = 'featuresTitle',
  itemsKey = 'features',
}: FeatureSectionProps) {
  const t = useTranslations(namespace)

  if (!t.has(`${slug}.${titleKey}`) || !t.has(`${slug}.${itemsKey}`)) {
    return null
  }

  const title = t(`${slug}.${titleKey}`)
  const items = t.raw(`${slug}.${itemsKey}`) as FeatureItem[]

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3">
            <CheckIcon
              size={20}
              className="mt-0.5 shrink-0 text-primary"
              isAnimated={false}
            />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
