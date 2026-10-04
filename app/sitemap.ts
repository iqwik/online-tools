import type {MetadataRoute} from 'next'
import {categories, getAllRegistryEntries} from '@/data'
import {getBaseUrl} from '@/helpers'
import {routing} from '@/i18n/routing'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl()
  const now = new Date()

  function localePath(locale: string): string {
    return locale === routing.defaultLocale ? '' : `/${locale}`
  }

  function buildAlternates(path: string) {
    const languages: Record<string, string> = {}
    for (const l of routing.locales) {
      languages[l] = `${baseUrl}${localePath(l)}${path}`
    }
    languages['x-default'] = `${baseUrl}${path}`
    return {languages}
  }

  const urls: MetadataRoute.Sitemap = []

  const staticPages: Array<{path: string; priority: number}> = [
    {path: '', priority: 1},
    {path: '/about', priority: 0.6},
    {path: '/privacy', priority: 0.6},
  ]

  for (const locale of routing.locales) {
    const prefix = localePath(locale)

    for (const {path, priority} of staticPages) {
      urls.push({
        url: `${baseUrl}${prefix}${path}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority,
        alternates: buildAlternates(path),
      })
    }

    for (const cat of categories) {
      const path = `/${cat.slug}`
      urls.push({
        url: `${baseUrl}${prefix}${path}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: buildAlternates(path),
      })
    }

    for (const entry of getAllRegistryEntries()) {
      const cfg = entry.config
      const path = `/${cfg.slug}`
      urls.push({
        url: `${baseUrl}${prefix}${path}`,
        lastModified: cfg.publishedAt ? new Date(cfg.publishedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.75,
        alternates: buildAlternates(path),
      })
    }
  }

  return urls
}
