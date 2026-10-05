import {getTranslations} from 'next-intl/server'
import {getAllRegistryEntries} from '@/data'
import {EntryPreview} from '../shared/EntryPreview'

const RECENT_COUNT = 6

export async function RecentlyAdded() {
  const t = await getTranslations('home.recent')

  const items = getAllRegistryEntries()
    .map(e => e.config)
    .filter(c => c.publishedAt)
    .sort((a, b) => {
      const da = new Date(a.publishedAt!).getTime()
      const db = new Date(b.publishedAt!).getTime()
      return db - da
    })
    .slice(0, RECENT_COUNT)

  if (items.length === 0) return null

  return (
    <section className="page">
      <div className="mb-4">
        <h2 className="text-xl font-bold tracking-tight">{t('h2')}</h2>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(config => (
          <div key={config.slug} className="h-full">
            <EntryPreview slug={config.slug} />
          </div>
        ))}
      </div>
    </section>
  )
}
