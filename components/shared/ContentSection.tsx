import {useTranslations} from 'next-intl'

interface ContentSectionProps {
  slug: string
  namespace?: string
  titleKey: string
  itemsKey: string
  ordered?: boolean
}

export function ContentSection({
  slug,
  namespace = 'config',
  titleKey,
  itemsKey,
  ordered = false,
}: ContentSectionProps) {
  const t = useTranslations(namespace)

  if (!t.has(`${slug}.${titleKey}`) || !t.has(`${slug}.${itemsKey}`)) {
    return null
  }

  const title = t(`${slug}.${titleKey}`)
  const raw = t.raw(`${slug}.${itemsKey}`)

  if (!Array.isArray(raw)) return null

  const items = raw as string[]
  const ListTag = ordered ? 'ol' : 'ul'

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <ListTag className="space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
          >
            {ordered ? (
              <span className="font-semibold text-foreground">{i + 1}.</span>
            ) : (
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ListTag>
    </section>
  )
}
