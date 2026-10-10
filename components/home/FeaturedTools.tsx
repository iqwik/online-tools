'use client'

import {motion} from 'motion/react'
import {useTranslations} from 'next-intl'
import {useMemo} from 'react'
import {getAllRegistryEntries, getToolsCount} from '@/data'
import {seededShuffle} from '@/helpers'
import {EntryPreview} from '../shared/EntryPreview'
import {LinkWithAnimatedArrowRightIcon} from '../shared/LinkWithAnimatedArrowRightIcon'

const FEATURED_COUNT = 18
const SHUFFLE_SEED = 42

export function FeaturedTools() {
  const t = useTranslations('home.featured')
  const count = getToolsCount()

  const items = useMemo(() => {
    const all = getAllRegistryEntries().map(e => e.config)
    return seededShuffle(all, SHUFFLE_SEED).slice(0, FEATURED_COUNT)
  }, [])

  return (
    <section className="page">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{t('h2')}</h2>
        <LinkWithAnimatedArrowRightIcon href="/tools">
          {t('viewAll', {count})}
        </LinkWithAnimatedArrowRightIcon>
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
