import {getLocale, getTranslations} from 'next-intl/server'
import {getAllNews} from '@/data'
import {routing} from '@/i18n/routing'
import {BreadCrumbs} from '../shared/BreadCrumbs'
import {NewsCard} from './NewsCard'

export async function NewsPage() {
  const t = await getTranslations('news')
  const locale = await getLocale()
  const localePath = locale === routing.defaultLocale ? '' : `/${locale}`
  const items = getAllNews()

  const breadcrumbs = [{title: t('h1')}]

  return (
    <div className="page">
      <BreadCrumbs items={breadcrumbs} />

      <article className="flex flex-col gap-8">
        <header data-role="header" className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t('h1')}
              </h1>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                {t('description')}
              </p>
            </div>
            <a
              href={localePath ? `${localePath}/feed.xml` : '/feed.xml'}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md border bg-card px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              title={t('rssLabel')}
            >
              <RssIcon className="size-3.5" />
              <span>RSS</span>
            </a>
          </div>
        </header>

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('empty')}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map(item => (
              <li key={item.slug}>
                <NewsCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </article>
    </div>
  )
}

function RssIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.18 17.82a2.18 2.18 0 1 1-4.36 0 2.18 2.18 0 0 1 4.36 0zM1.82 8.64v3.08a8.46 8.46 0 0 1 8.46 8.46h3.08c0-6.37-5.17-11.54-11.54-11.54zM1.82 1.82v3.08c8.47 0 15.28 6.81 15.28 15.28h3.08c0-10.18-8.18-18.36-18.36-18.36z" />
    </svg>
  )
}
