import {getTranslations} from 'next-intl/server'
import {getAllNews} from '@/data'
import {buildRssFeed, getBaseUrl, SITE_NAME} from '@/helpers'

export const dynamic = 'force-static'

export async function GET() {
  const baseUrl = getBaseUrl()
  const t = await getTranslations({locale: 'en', namespace: 'news'})
  const items = getAllNews().slice(0, 20)

  const xml = buildRssFeed({
    baseUrl,
    localePath: '',
    language: 'en',
    siteName: SITE_NAME,
    channelTitle: `${SITE_NAME} — ${t('h1')}`,
    channelDescription: t('metaDescription'),
    items: items.map(item => ({
      slug: item.slug,
      date: item.date,
      title: t(`items.${item.slug}.title`),
      description: t(`items.${item.slug}.excerpt`),
    })),
  })

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
