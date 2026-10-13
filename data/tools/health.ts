import {GiftIcon as Cake} from '@animateicons/react/lucide/gift-icon'
import type {ToolConfig} from '@/types'

export const healthTools: ToolConfig[] = [
  {
    slug: 'age-calculator',
    category: 'health',
    kind: 'age-calculator',
    tags: ['calculator'],
    title: 'age-calculator.title',
    h1: 'age-calculator.h1',
    description: 'age-calculator.description',
    metaDescription: 'age-calculator.metaDescription',
    keywords: ['age-calculator.keywords'],
    Icon: Cake,
    faq: [
      {q: 'age-calculator.faq.q1', a: 'age-calculator.faq.a1'},
      {q: 'age-calculator.faq.q2', a: 'age-calculator.faq.a2'},
      {q: 'age-calculator.faq.q3', a: 'age-calculator.faq.a3'},
      {q: 'age-calculator.faq.q4', a: 'age-calculator.faq.a4'},
      {q: 'age-calculator.faq.q5', a: 'age-calculator.faq.a5'},
      {q: 'age-calculator.faq.q6', a: 'age-calculator.faq.a6'},
    ],
    publishedAt: '2026-10-02',
    related: [
      'heart-rate-zones-calculator',
      'vo2-max-estimator',
      'calorie-calculator',
      'water-intake-calculator',
    ],
  },
]
