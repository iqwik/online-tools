export interface RssItem {
  slug: string
  date: string
  title: string
  description: string
}

export interface RssOptions {
  baseUrl: string
  localePath: string
  language: string
  siteName: string
  channelTitle: string
  channelDescription: string
  items: RssItem[]
}

export function buildRssFeed(options: RssOptions): string {
  const {
    baseUrl,
    localePath,
    language,
    siteName,
    channelTitle,
    channelDescription,
    items,
  } = options

  const feedUrl = `${baseUrl}${localePath}/feed.xml`
  const siteUrl = `${baseUrl}${localePath}/news`
  const lastBuildDate = new Date().toUTCString()

  const itemsXml = items
    .map(item => {
      const link = `${baseUrl}${localePath}/news#${item.slug}`
      const pubDate = new Date(item.date).toUTCString()
      return [
        '    <item>',
        `      <title>${escapeXml(item.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="false">${escapeXml(item.slug)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${escapeXml(item.description)}</description>`,
        '    </item>',
      ].join('\n')
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>${language}</language>
    <copyright>${escapeXml(siteName)}</copyright>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>
`
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
