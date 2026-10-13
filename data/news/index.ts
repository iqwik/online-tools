import {item as itemLaunch} from './2026-10-08-toolyland-launch'
import {item as itemPercentageCalculator} from './2026-10-10-percentage-calculator-rework'
import {item as itemServiceRestored} from './2026-10-11-service-restored'
import {item as itemAgeCalculatorRework} from './2026-10-13-age-calculator-rework'
import type {NewsItem} from './types'

export type {NewsItem, NewsTag} from './types'

const allNews: NewsItem[] = [
  itemAgeCalculatorRework,
  itemServiceRestored,
  itemPercentageCalculator,
  itemLaunch,
]

export function getAllNews(): NewsItem[] {
  return [...allNews].sort((a, b) => (a.date < b.date ? 1 : -1))
}
