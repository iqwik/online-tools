export type NewsTag = 'release' | 'feature' | 'fix' | 'announcement'

export interface NewsItem {
  slug: string
  /** ISO date 'YYYY-MM-DD' */
  date: string
  tag: NewsTag
  /** Optional semver of the release, e.g. '0.21.0' */
  version?: string
  /** Optional internal link, e.g. '/percentage-calculator' */
  link?: string
}
