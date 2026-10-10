export interface PercentageHistoryEntry {
  id: string
  mode: string
  values: Record<string, string>
  rendered: string
  expression: string
  timestamp: number
}

export const PERCENTAGE_HISTORY_KEY = 'toolyland:percentage-history'
export const PERCENTAGE_HISTORY_MAX = 20

export function loadPercentageHistory(): PercentageHistoryEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(PERCENTAGE_HISTORY_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isValidEntry).slice(0, PERCENTAGE_HISTORY_MAX)
  } catch {
    return []
  }
}

export function savePercentageHistory(entries: PercentageHistoryEntry[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(
      PERCENTAGE_HISTORY_KEY,
      JSON.stringify(entries.slice(0, PERCENTAGE_HISTORY_MAX)),
    )
  } catch {
    // quota exceeded or private mode — silently ignore
  }
}

export function addPercentageHistoryEntry(
  entries: PercentageHistoryEntry[],
  entry: Omit<PercentageHistoryEntry, 'id' | 'timestamp'>,
): PercentageHistoryEntry[] {
  const matchIndex = entries.findIndex(
    e => e.mode === entry.mode && sameValues(e.values, entry.values),
  )
  const filtered =
    matchIndex >= 0
      ? [...entries.slice(0, matchIndex), ...entries.slice(matchIndex + 1)]
      : entries
  const next: PercentageHistoryEntry = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  }
  return [next, ...filtered].slice(0, PERCENTAGE_HISTORY_MAX)
}

export function matchesCurrent(
  entry: PercentageHistoryEntry,
  mode: string,
  values: Record<string, string>,
): boolean {
  return entry.mode === mode && sameValues(entry.values, values)
}

export function formatRelativeTime(ts: number, now: number): string {
  const diff = Math.max(0, Math.floor((now - ts) / 1000))
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

function sameValues(
  a: Record<string, string>,
  b: Record<string, string>,
): boolean {
  const keysA = Object.keys(a).sort()
  const keysB = Object.keys(b).sort()
  if (keysA.length !== keysB.length) return false
  for (let i = 0; i < keysA.length; i++) {
    if (keysA[i] !== keysB[i]) return false
    if (a[keysA[i]] !== b[keysB[i]]) return false
  }
  return true
}

function isValidEntry(x: unknown): x is PercentageHistoryEntry {
  if (!x || typeof x !== 'object') return false
  const e = x as Record<string, unknown>
  return (
    typeof e.id === 'string' &&
    typeof e.mode === 'string' &&
    typeof e.values === 'object' &&
    typeof e.rendered === 'string' &&
    typeof e.expression === 'string' &&
    typeof e.timestamp === 'number'
  )
}
