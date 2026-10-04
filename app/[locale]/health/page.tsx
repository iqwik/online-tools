import type {Metadata} from 'next'
import {CategoryPage} from '@/components/category/CategoryPage'
import {buildCategoryMetadata} from '@/helpers'

const SLUG = 'health' as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{locale: string}>
}): Promise<Metadata> {
  const {locale} = await params
  return buildCategoryMetadata(locale, SLUG)
}

export default function HealthPage() {
  return <CategoryPage slug={SLUG} />
}
