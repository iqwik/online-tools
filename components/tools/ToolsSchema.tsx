import {getLocale, getTranslations} from 'next-intl/server'
import {getAllRegistryEntries} from '@/data'
import {getBaseUrl, getPublisher} from '@/helpers'
import {routing} from '@/i18n/routing'

export async function ToolsSchema() {
  const t = await getTranslations('tools')
  const tConfig = await getTranslations('config')
  const locale = await getLocale()
  const baseUrl = getBaseUrl()
  const localePath = locale === routing.defaultLocale ? '' : `/${locale}`
  const url = `${baseUrl}${localePath}/tools`

  const collection = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('h1'),
    description: t('description', {count: getAllRegistryEntries().length}),
    url,
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      name: getPublisher().name,
      url: `${baseUrl}${localePath}`,
    },
    publisher: getPublisher(),
  }

  const entries = getAllRegistryEntries()
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('h1'),
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: tConfig(entry.config.h1),
      url: `${baseUrl}${localePath}/${entry.config.slug}`,
    })),
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
    </>
  )
}
