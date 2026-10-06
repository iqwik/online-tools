import type {MetadataRoute} from 'next'
import {categories, getAllRegistryEntries} from '@/data'
import {getBaseUrl} from '@/helpers'
import {routing} from '@/i18n/routing'

export const dynamic = 'force-static'

// Bump manually on each content release. `new Date()` recomputed on every
// request makes Google distrust lastModified — it sees every page as
// "updated a minute ago". Tools with `publishedAt` use their own date.
const CONTENT_LASTMOD = new Date('2026-10-05')

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()

  function localePath(locale: string): string {
    return locale === routing.defaultLocale ? '' : `/${locale}`
  }

  function buildAlternates(path: string) {
    const languages: Record<string, string> = {}
    for (const l of routing.locales) {
      languages[l] = `${baseUrl}${localePath(l)}${path}`
    }
    // x-default points to the default-locale version (en, unprefixed).
    languages['x-default'] = `${baseUrl}${path}`
    return {languages}
  }

  const urls: MetadataRoute.Sitemap = []

  // Google ignores priority/changefreq; Yandex uses them weakly.
  // Kept minimal — only for Yandex's benefit, where priority
  // still carries a small signal for crawl ordering.
  const staticPages: Array<{path: string; priority: number}> = [
    {path: '', priority: 1},
    {path: '/tools', priority: 0.9},
    {path: '/about', priority: 0.6},
    {path: '/privacy', priority: 0.6},
  ]

  for (const locale of routing.locales) {
    const prefix = localePath(locale)

    for (const {path, priority} of staticPages) {
      urls.push({
        url: `${baseUrl}${prefix}${path}`,
        lastModified: CONTENT_LASTMOD,
        priority,
        alternates: buildAlternates(path),
      })
    }

    for (const cat of categories) {
      const path = `/${cat.slug}`
      urls.push({
        url: `${baseUrl}${prefix}${path}`,
        lastModified: CONTENT_LASTMOD,
        priority: 0.8,
        alternates: buildAlternates(path),
      })
    }

    for (const entry of getAllRegistryEntries()) {
      const cfg = entry.config
      const path = `/${cfg.slug}`
      urls.push({
        url: `${baseUrl}${prefix}${path}`,
        lastModified: cfg.publishedAt
          ? new Date(cfg.publishedAt)
          : CONTENT_LASTMOD,
        priority: 0.75,
        alternates: buildAlternates(path),
      })
    }
  }

  return urls
}
