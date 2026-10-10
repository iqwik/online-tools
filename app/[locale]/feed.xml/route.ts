import {getAllNews} from '@/data'
import {buildRssFeed, getBaseUrl, SITE_NAME} from '@/helpers'
import enMessages from '@/messages/en.json'

export const dynamic = 'force-static'

export async function GET() {
  const baseUrl = getBaseUrl()
  const news = enMessages.news
  const items = getAllNews().slice(0, 20)

  const xml = buildRssFeed({
    baseUrl,
    localePath: '',
    language: 'en',
    siteName: SITE_NAME,
    channelTitle: `${SITE_NAME} — ${news.h1}`,
    channelDescription: news.metaDescription,
    items: items.map(item => {
      const key = item.slug as keyof typeof news.items
      const entry = news.items[key]
      return {
        slug: item.slug,
        date: item.date,
        title: entry?.title ?? item.slug,
        description: entry?.excerpt ?? '',
      }
    }),
  })

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
