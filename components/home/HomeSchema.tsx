import {getLocale, getTranslations} from 'next-intl/server'
import {categories} from '@/data'
import {getBaseUrl} from '@/helpers'
import {routing} from '@/i18n/routing'

// TODO: parametrize via NEXT_PUBLIC_SITE_NAME (see tech debt)
const PUBLISHER_NAME = 'ProjectName'

export async function HomeSchema() {
  const t = await getTranslations('categories')
  const tHome = await getTranslations('home')
  const locale = await getLocale()
  const baseUrl = getBaseUrl()
  const localePath = locale === routing.defaultLocale ? '' : `/${locale}`

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: PUBLISHER_NAME,
    url: `${baseUrl}${localePath}`,
    inLanguage: locale,
    publisher: {
      '@type': 'Organization',
      name: PUBLISHER_NAME,
      url: baseUrl,
    },
  }

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('all.name'),
    numberOfItems: categories.length,
    itemListElement: categories.map((cat, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t(`${cat.slug}.name`),
      url: `${baseUrl}${localePath}/${cat.slug}`,
    })),
  }

  const faqItems = [
    {q: tHome('faq.q1'), a: tHome('faq.a1')},
    {q: tHome('faq.q2'), a: tHome('faq.a2')},
    {q: tHome('faq.q3'), a: tHome('faq.a3')},
  ]

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {'@type': 'Answer', text: item.a},
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{__html: JSON.stringify(website)}}
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
    </>
  )
}
