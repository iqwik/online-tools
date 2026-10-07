import {getBaseUrl} from './get-base-url'

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'ProjectName'

export function getPublisher() {
  return {
    '@type': 'Organization' as const,
    name: SITE_NAME,
    url: getBaseUrl(),
  }
}
