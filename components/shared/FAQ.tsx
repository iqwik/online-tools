'use client'

import {useTranslations} from 'next-intl'
import type {FAQItem} from '@/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion'

interface Props {
  items: FAQItem[]
  namespace?: string
}

export function FAQ({items, namespace = 'config'}: Props) {
  const tGlobal = useTranslations('global')
  const t = useTranslations(namespace)

  if (items.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold">{tGlobal('faq')}</h2>
      <Accordion className="w-full" multiple>
        {items.map((item, i) => (
          <AccordionItem key={`item-${i}`} value={`item-${i}`}>
            <AccordionTrigger className="text-left text-base font-semibold hover:no-underline cursor-pointer">
              {t(item.q)}
            </AccordionTrigger>
            <AccordionContent className="leading-relaxed text-muted-foreground">
              {t(item.a)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
