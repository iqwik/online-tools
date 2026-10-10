import {getLocale, getTranslations} from 'next-intl/server'
import type {NewsItem, NewsTag} from '@/data'
import {LinkWithAnimatedArrowRightIcon} from '../shared/LinkWithAnimatedArrowRightIcon'

interface Props {
  item: NewsItem
}

const TAG_CLASSES: Record<NewsTag, string> = {
  release: 'bg-primary/10 text-primary border-primary/20',
  feature:
    'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20',
  fix: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
  announcement:
    'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
}

export async function NewsCard({item}: Props) {
  const t = await getTranslations('news')
  const locale = await getLocale()

  const dateText = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(item.date))

  const title = t(`items.${item.slug}.title`)
  const text = t(`items.${item.slug}.text`)

  return (
    <article
      id={item.slug}
      className="scroll-mt-20 rounded-xl border bg-card p-5 transition-colors hover:border-foreground/20 flex flex-col gap-1.5"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span
          className={`inline-flex items-center rounded-full border px-2 py-0.5 font-medium ${TAG_CLASSES[item.tag]}`}
        >
          {t(`tags.${item.tag}`)}
        </span>
        <time dateTime={item.date}>{dateText}</time>
        {item.version && (
          <>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">v{item.version}</span>
          </>
        )}
      </div>

      <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight">
        {title}
      </h2>

      <p className="mt-2 text-sm text-muted-foreground">{text}</p>

      {item.link && (
        <LinkWithAnimatedArrowRightIcon href={item.link}>
          {t('tryIt')}
        </LinkWithAnimatedArrowRightIcon>
      )}
    </article>
  )
}
