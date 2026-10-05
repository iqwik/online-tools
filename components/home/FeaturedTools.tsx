'use client'

import {ArrowRightIcon as ArrowRight} from '@animateicons/react/lucide/arrow-right-icon'
import {motion} from 'motion/react'
import {useTranslations} from 'next-intl'
import {useMemo} from 'react'
import {getAllRegistryEntries} from '@/data'
import {seededShuffle} from '@/helpers'
import {Link} from '@/i18n/navigation'
import {EntryPreview} from '../shared/EntryPreview'

const FEATURED_COUNT = 18
const SHUFFLE_SEED = 42

export function FeaturedTools() {
  const t = useTranslations('home.featured')

  const items = useMemo(() => {
    const all = getAllRegistryEntries().map(e => e.config)
    return seededShuffle(all, SHUFFLE_SEED).slice(0, FEATURED_COUNT)
  }, [])

  return (
    <section className="page">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-xl font-bold tracking-tight">{t('h2')}</h2>
        <Link
          href="/tools"
          className="group flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          {t('viewAll')}
          <ArrowRight
            isAnimated={false}
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <motion.div
        layout
        initial={false}
        className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map(config => (
          <div key={config.slug} className="h-full">
            <EntryPreview slug={config.slug} />
          </div>
        ))}
      </motion.div>
    </section>
  )
}
