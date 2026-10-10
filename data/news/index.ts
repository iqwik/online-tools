import {item as itemLaunch} from './2026-10-08-toolyland-launch'
import {item as itemPercentageCalculator} from './2026-10-10-percentage-calculator-rework'
import type {NewsItem} from './types'

export type {NewsItem, NewsTag} from './types'

const allNews: NewsItem[] = [itemPercentageCalculator, itemLaunch]

export function getAllNews(): NewsItem[] {
  return [...allNews].sort((a, b) => (a.date < b.date ? 1 : -1))
}
