import {PercentIcon as Percent} from '@animateicons/react/lucide/percent-icon'
import type {ToolConfig} from '@/types'

export const financeTools: ToolConfig[] = [
  {
    slug: 'percentage-calculator',
    category: 'finance',
    kind: 'percentage-calculator',
    tags: ['calculator'],
    priority: 1,
    title: 'percentage-calculator.title',
    h1: 'percentage-calculator.h1',
    description: 'percentage-calculator.description',
    metaDescription: 'percentage-calculator.metaDescription',
    keywords: ['percentage-calculator.keywords'],
    Icon: Percent,
    faq: [
      {q: 'percentage-calculator.faq.q1', a: 'percentage-calculator.faq.a1'},
      {q: 'percentage-calculator.faq.q2', a: 'percentage-calculator.faq.a2'},
      {q: 'percentage-calculator.faq.q3', a: 'percentage-calculator.faq.a3'},
      {q: 'percentage-calculator.faq.q4', a: 'percentage-calculator.faq.a4'},
      {q: 'percentage-calculator.faq.q5', a: 'percentage-calculator.faq.a5'},
      {q: 'percentage-calculator.faq.q6', a: 'percentage-calculator.faq.a6'},
    ],
    publishedAt: '2026-10-10',
    related: [
      'discount-calculator',
      'tip-calculator',
      'sales-tax-calculator',
      'roi-calculator',
    ],
  },
]
