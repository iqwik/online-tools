import type {MetadataRoute} from 'next'
import {getBaseUrl} from '@/helpers'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: ['/api/'],
        other: {
          'Clean-param':
            'utm_source&utm_medium&utm_campaign&utm_term&utm_content&yclid&gclid&fbclid&_openstat&ysclid&yrclid',
        },
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
