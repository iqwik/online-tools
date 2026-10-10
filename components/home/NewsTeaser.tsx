import {getLocale, getTranslations} from 'next-intl/server'
import {getAllNews, type NewsTag} from '@/data'
import {Link} from '@/i18n/navigation'
import {LinkWithAnimatedArrowRightIcon} from '../shared/LinkWithAnimatedArrowRightIcon'

const TAG_CLASSES: Record<NewsTag, string> = {
  release: 'bg-primary/10 text-primary border-primary/20',
  feature:
    'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  fix: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  announcement:
    'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
}

export async function NewsTeaser() {
  const t = await getTranslations('news')
  const locale = await getLocale()
  const items = getAllNews().slice(0, 2)

  if (items.length === 0) return null

  return (
    <section className="page">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">{t('h1')}</h2>
        <LinkWithAnimatedArrowRightIcon href="/news">
          {t('seeAll')}
        </LinkWithAnimatedArrowRightIcon>
      </div>

      <ul className="flex flex-col gap-3.5">
        {items.map(item => {
          const dateText = new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date(item.date))

          return (
            <li key={item.slug}>
              <Link
                href={`/news#${item.slug}`}
                className="flex flex-col gap-2 rounded-xl border bg-card px-4 py-3 transition-colors hover:border-foreground/20 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:w-52 sm:shrink-0">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 font-medium ${TAG_CLASSES[item.tag]}`}
                  >
                    {t(`tags.${item.tag}`)}
                  </span>
                  <time dateTime={item.date}>{dateText}</time>
                </div>
                <span className="min-w-0 flex-1 text-sm font-medium leading-snug">
                  {t(`items.${item.slug}.title`)}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
