import {getLocale, getTranslations} from 'next-intl/server'
import {getRegistryEntriesByCategory} from '@/data'
import {getBaseUrl, getPublisher} from '@/helpers'
import {routing} from '@/i18n/routing'
import type {CategorySlug} from '@/types'

interface Props {
  slug: CategorySlug
}

export async function CategorySchema({slug}: Props) {
  const t = await getTranslations('categories')
  const tConfig = await getTranslations('config')
  const tNav = await getTranslations('nav')
  const locale = await getLocale()
  const baseUrl = getBaseUrl()
  const localePath = locale === routing.defaultLocale ? '' : `/${locale}`
  const categoryUrl = `${baseUrl}${localePath}/${slug}`

  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t(`${slug}.h1`),
    description: t(`${slug}.metaDescription`),
    url: categoryUrl,
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      name: getPublisher().name,
      url: `${baseUrl}${localePath}`,
    },
    publisher: getPublisher(),
  }

  const entries = getRegistryEntriesByCategory(slug)
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t(`${slug}.name`),
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tConfig(entry.config.h1),
      url: `${baseUrl}${localePath}/${entry.config.slug}`,
    })),
  }

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [1, 2, 3, 4, 5].map(n => ({
      '@type': 'Question',
      name: t(`${slug}.faq.q${n}`),
      acceptedAnswer: {'@type': 'Answer', text: t(`${slug}.faq.a${n}`)},
    })),
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: tNav('home'),
        item: `${baseUrl}${localePath}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t(`${slug}.name`),
        item: categoryUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{__html: JSON.stringify(collection)}}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{__html: JSON.stringify(itemList)}}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{__html: JSON.stringify(faq)}}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{__html: JSON.stringify(breadcrumb)}}
      />
    </>
  )
}
