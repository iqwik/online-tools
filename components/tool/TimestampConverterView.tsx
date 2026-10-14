'use client'

import {Clock, List, RefreshCw} from 'lucide-react'
import {useLocale, useTranslations} from 'next-intl'
import {useEffect, useMemo, useState} from 'react'
import {CopyButton} from '../shared/CopyButton'
import {Button} from '../ui/button'
import {SegmentedControl} from '../ui/segmented-control'

// ─── Types ─────────────────────────────────────────────────────────

type Mode = 'single' | 'batch'
type Unit = 'auto' | 'seconds' | 'milliseconds'

// ─── Constants ─────────────────────────────────────────────────────

/** Common timezones for the "other timezones" grid. */
const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Europe/Moscow',
  'Africa/Johannesburg',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Shanghai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
]

/** Default options for URL sync. */
const DEFAULT_MODE: Mode = 'single'
const DEFAULT_UNIT: Unit = 'auto'

// ─── URL sync ──────────────────────────────────────────────────────

/** Read mode, unit and input value from the current URL. */
function readFromUrl(): {mode?: Mode; unit?: Unit; ts?: string} {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const out: {mode?: Mode; unit?: Unit; ts?: string} = {}

  const mode = params.get('mode')
  if (mode === 'single' || mode === 'batch') out.mode = mode

  const unit = params.get('unit')
  if (unit === 'auto' || unit === 'seconds' || unit === 'milliseconds')
    out.unit = unit

  const ts = params.get('ts')
  if (ts) out.ts = ts

  return out
}

/**
 * Write mode, unit and input to the URL via replaceState.
 * Only non-default values are written to keep the URL short.
 */
function syncToUrl(mode: Mode, unit: Unit, ts: string) {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams()

  if (mode !== DEFAULT_MODE) params.set('mode', mode)
  if (unit !== DEFAULT_UNIT) params.set('unit', unit)
  if (ts) params.set('ts', ts)

  const qs = params.toString()
  const url = qs
    ? `${window.location.pathname}?${qs}`
    : window.location.pathname
  window.history.replaceState(null, '', url)
}

// ─── Parsing ───────────────────────────────────────────────────────

/**
 * Parse a timestamp or date string into a Date.
 * When unit is 'auto', values >= 10^12 are treated as milliseconds.
 */
function parseInput(value: string, unit: Unit): Date | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const n = Number(trimmed)
  if (Number.isFinite(n)) {
    let ms: number
    if (unit === 'seconds') ms = n * 1000
    else if (unit === 'milliseconds') ms = n
    else ms = n > 1e12 ? n : n * 1000
    const d = new Date(ms)
    return Number.isNaN(d.getTime()) ? null : d
  }

  const d = new Date(trimmed)
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * Parse a timestamp or date string and return both seconds and ms.
 * Used in batch mode where each line is auto-detected.
 */
function parseToUnits(
  value: string,
): {seconds: number; milliseconds: number} | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const n = Number(trimmed)
  if (Number.isFinite(n)) {
    const ms = n > 1e12 ? n : n * 1000
    if (Number.isNaN(new Date(ms).getTime())) return null
    return {seconds: Math.floor(ms / 1000), milliseconds: ms}
  }

  const d = new Date(trimmed)
  if (Number.isNaN(d.getTime())) return null
  return {seconds: Math.floor(d.getTime() / 1000), milliseconds: d.getTime()}
}

// ─── Formatting ────────────────────────────────────────────────────

/** Localized relative-time string (e.g. "5 seconds ago"). */
function relativeTime(
  d: Date,
  t: (key: string, values?: Record<string, number | string>) => string,
): string {
  const diff = Date.now() - d.getTime()
  const abs = Math.abs(diff)
  const sec = Math.floor(abs / 1000)
  const min = Math.floor(sec / 60)
  const hr = Math.floor(min / 60)
  const day = Math.floor(hr / 24)

  const past = diff >= 0
  const key = past ? 'past' : 'future'

  if (sec < 60)
    return t(`timestamp-converter.relative.${key}.seconds`, {n: sec})
  if (min < 60)
    return t(`timestamp-converter.relative.${key}.minutes`, {n: min})
  if (hr < 24) return t(`timestamp-converter.relative.${key}.hours`, {n: hr})
  return t(`timestamp-converter.relative.${key}.days`, {n: day})
}

/** Format a Date in a specific timezone. */
function formatInTimezone(d: Date, tz: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(d)
}

/** RFC 2822 string (e.g. "Wed, 14 Oct 2026 14:15:55 GMT"). */
function toRFC2822(d: Date): string {
  return d.toUTCString()
}

/** Human-readable full date in the browser's locale. */
function toHumanReadable(d: Date, locale: string): string {
  return d.toLocaleString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    dateStyle: 'full',
    timeStyle: 'long',
  })
}

// ─── Batch ─────────────────────────────────────────────────────────

interface BatchResult {
  input: string
  seconds: number
  milliseconds: number
  iso: string
  human: string
  relative: string
  error: boolean
}

function convertBatchLine(
  line: string,
  locale: string,
  t: (key: string, values?: Record<string, number | string>) => string,
): BatchResult | null {
  const trimmed = line.trim()
  if (!trimmed) return null

  const parsed = parseToUnits(trimmed)
  if (!parsed) {
    return {
      input: trimmed,
      seconds: 0,
      milliseconds: 0,
      iso: '',
      human: '',
      relative: '',
      error: true,
    }
  }

  const d = new Date(parsed.milliseconds)
  return {
    input: trimmed,
    seconds: parsed.seconds,
    milliseconds: parsed.milliseconds,
    iso: d.toISOString(),
    human: toHumanReadable(d, locale),
    relative: relativeTime(d, t),
    error: false,
  }
}

// ─── Component ─────────────────────────────────────────────────────

/** Bidirectional timestamp ↔ date converter with batch mode. */
export function TimestampConverterView() {
  const tConfig = useTranslations('config')
  const tGlobal = useTranslations('global')
  const locale = useLocale()

  const [mode, setMode] = useState<Mode>(DEFAULT_MODE)
  const [unit, setUnit] = useState<Unit>(DEFAULT_UNIT)
  const [input, setInput] = useState('')
  const [batch, setBatch] = useState('')
  // null until mount — prevents SSR/client time mismatch (hydration error).
  const [now, setNow] = useState<Date | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Start the live clock only after mount, so the first client render
  // matches the server-rendered placeholder exactly.
  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // On mount: read URL params and hydrate state.
  useEffect(() => {
    const fromUrl = readFromUrl()
    if (fromUrl.mode) setMode(fromUrl.mode)
    if (fromUrl.unit) setUnit(fromUrl.unit)
    if (fromUrl.ts) setInput(fromUrl.ts)
    setIsReady(true)
  }, [])

  // After mount: mirror state into the URL.
  useEffect(() => {
    if (!isReady) return
    syncToUrl(mode, unit, input)
  }, [mode, unit, input, isReady])

  const nowSeconds = now ? Math.floor(now.getTime() / 1000) : 0
  const date = useMemo(() => parseInput(input, unit), [input, unit])

  const batchResults = useMemo(() => {
    if (mode !== 'batch' || !batch) return []
    return batch
      .split('\n')
      .map(line => convertBatchLine(line, locale, tConfig))
      .filter((r): r is BatchResult => r !== null)
  }, [mode, batch, locale, tConfig])

  function handleRefresh() {
    if (now) setInput(String(nowSeconds))
  }

  function handleUseAsInput() {
    if (now) setInput(String(nowSeconds))
  }

  function handleShift(minutes: number) {
    const base = date ?? now ?? new Date()
    const shifted = new Date(base.getTime() + minutes * 60 * 1000)
    setInput(String(Math.floor(shifted.getTime() / 1000)))
  }

  const modeOptions: {value: Mode; label: string}[] = [
    {value: 'single', label: tConfig('timestamp-converter.single')},
    {value: 'batch', label: tConfig('timestamp-converter.batch')},
  ]

  const unitOptions: {value: Unit; label: string}[] = [
    {value: 'auto', label: tConfig('timestamp-converter.unitAuto')},
    {value: 'seconds', label: tConfig('timestamp-converter.unitSeconds')},
    {
      value: 'milliseconds',
      label: tConfig('timestamp-converter.unitMilliseconds'),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Live clock — placeholder until the client mounts */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border bg-card p-4 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          {tConfig('timestamp-converter.currentTime')}
        </div>
        <div className="font-mono">
          {now ? (
            <>
              {now.toISOString()}{' '}
              <span className="text-muted-foreground">({nowSeconds}s)</span>
            </>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUseAsInput}
          disabled={!now}
        >
          {tConfig('timestamp-converter.useAsInput')}
        </Button>
      </div>

      {/* Mode switcher */}
      <div className="flex justify-center">
        <SegmentedControl
          name="ts-mode"
          value={mode}
          onChange={setMode}
          options={modeOptions}
        />
      </div>

      {mode === 'single' ? (
        <>
          {/* Unit selector */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {tConfig('timestamp-converter.unit')}:
            </span>
            <SegmentedControl
              name="ts-unit"
              value={unit}
              onChange={setUnit}
              options={unitOptions}
            />
          </div>

          <div className="rounded-3xl border bg-card p-6">
            {/* Input row */}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={tConfig('timestamp-converter.inputPlaceholder')}
                className="h-10 flex-1 rounded-xl border bg-background px-4 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/30"
                spellCheck={false}
              />
              <Button
                type="button"
                size="icon"
                onClick={handleRefresh}
                aria-label={tGlobal('refresh')}
                disabled={!now}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick buttons */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => handleShift(0)}
              >
                {tConfig('timestamp-converter.quickNow')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => handleShift(-60)}
              >
                {tConfig('timestamp-converter.quickMinusHour')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => handleShift(60)}
              >
                {tConfig('timestamp-converter.quickPlusHour')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs"
                onClick={() => handleShift(-1440)}
              >
                {tConfig('timestamp-converter.quickMinusDay')}
              </Button>
            </div>

            {/* Results */}
            {date && (
              <div className="mt-6 space-y-3">
                <ResultRow
                  label={tConfig('timestamp-converter.formats.unixSeconds')}
                  value={String(Math.floor(date.getTime() / 1000))}
                />
                <ResultRow
                  label={tConfig('timestamp-converter.formats.unixMs')}
                  value={String(date.getTime())}
                />
                <ResultRow
                  label={tConfig('timestamp-converter.formats.iso')}
                  value={date.toISOString()}
                />
                <ResultRow
                  label={tConfig('timestamp-converter.formats.utc')}
                  value={toRFC2822(date)}
                />
                <ResultRow
                  label={tConfig('timestamp-converter.formats.local')}
                  value={toHumanReadable(date, locale)}
                />
                <ResultRow
                  label={tConfig('timestamp-converter.formats.relative')}
                  value={relativeTime(date, tConfig)}
                />

                {/* Other timezones */}
                <div className="pt-4">
                  <div className="mb-2 text-xs text-muted-foreground">
                    {tConfig('timestamp-converter.inOtherTimezones')}
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
                    {TIMEZONES.map(tz => (
                      <div
                        key={tz}
                        className="rounded border bg-background p-2 font-mono"
                      >
                        {tz}: {formatInTimezone(date, tz, locale)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="rounded-3xl border bg-card p-6">
          <textarea
            value={batch}
            onChange={e => setBatch(e.target.value)}
            placeholder={tConfig('timestamp-converter.batchPlaceholder')}
            spellCheck={false}
            className="h-40 w-full resize-none rounded-xl border bg-background p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />

          <div className="mt-3 flex items-center gap-2">
            <Button type="button" disabled={!batch}>
              <List className="mr-1.5 h-4 w-4" />
              {tConfig('timestamp-converter.convertBatch')}
            </Button>
            {batchResults.length > 0 && (
              <CopyButton
                getValue={() =>
                  batchResults
                    .map(r =>
                      r.error
                        ? `${r.input}\t${tConfig('timestamp-converter.batchError')}`
                        : `${r.input}\t${r.iso}\t${r.human}`,
                    )
                    .join('\n')
                }
                labelIdle={tGlobal('copyAll')}
                className="h-9 px-3"
              />
            )}
          </div>

          {batchResults.length > 0 && (
            <div className="mt-4 space-y-2 text-sm">
              {batchResults.map((r, i) => (
                <div
                  key={`${r.input}-${i}`}
                  className="rounded-2xl border bg-background p-3"
                >
                  <div className="font-mono text-muted-foreground">
                    {r.input}
                  </div>
                  <div
                    className={r.error ? 'text-red-600 dark:text-red-400' : ''}
                  >
                    {r.error
                      ? tConfig('timestamp-converter.batchError')
                      : `${r.iso} (${r.relative})`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Result row ────────────────────────────────────────────────────

interface ResultRowProps {
  label: string
  value: string
}

function ResultRow({label, value}: ResultRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border bg-background p-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2 font-mono break-all">
        {value}
        <CopyButton
          getValue={() => value}
          className="h-6 w-6 p-0"
          showLabel={false}
          tooltipSide="right"
        />
      </span>
    </div>
  )
}
