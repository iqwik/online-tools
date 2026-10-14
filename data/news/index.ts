import {item as item20261008Launch} from './2026-10-08-toolyland-launch'
import {item as item20261010PercentageCalculator} from './2026-10-10-percentage-calculator-rework'
import {item as item20261011ServiceRestored} from './2026-10-11-service-restored'
import {item as item20261213AgeCalculatorRework} from './2026-10-13-age-calculator-rework'
import {item as item20261014Password} from './2026-10-14-password-generator-rework'
import {item as item20261014Timestamp} from './2026-10-14-timestamp-converter-rework'
import type {NewsItem} from './types'

export type {NewsItem, NewsTag} from './types'

const allNews: NewsItem[] = [
  item20261014Password,
  item20261014Timestamp,
  item20261213AgeCalculatorRework,
  item20261011ServiceRestored,
  item20261010PercentageCalculator,
  item20261008Launch,
]

export function getAllNews(): NewsItem[] {
  return [...allNews].sort((a, b) => (a.date < b.date ? 1 : -1))
}
