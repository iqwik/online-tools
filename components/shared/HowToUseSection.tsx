import {useTranslations} from 'next-intl'

export interface HowToUseStep {
  title: string
  description: string
}

interface HowToUseSectionProps {
  slug: string
  namespace?: string
  titleKey?: string
  itemsKey?: string
}

export function HowToUseSection({
  slug,
  namespace = 'config',
  titleKey = 'howToUseTitle',
  itemsKey = 'howToUse',
}: HowToUseSectionProps) {
  const t = useTranslations(namespace)

  if (!t.has(`${slug}.${titleKey}`) || !t.has(`${slug}.${itemsKey}`)) {
    return null
  }

  const title = t(`${slug}.${titleKey}`)
  const steps = t.raw(`${slug}.${itemsKey}`) as HowToUseStep[]

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4 rounded-xl border bg-card p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {i + 1}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
