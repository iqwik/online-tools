'use client'

import {useLocale, useTranslations} from 'next-intl'
import {useEffect, useState} from 'react'
import {OutputPanel} from '../shared/OutputPanel'
import {Input} from '../ui/input'
import {Label} from '../ui/label'
import {SegmentedControl} from '../ui/segmented-control'

// ─── Types ───────────────────────────────────────────────

type Mode = 'smart' | 'of' | 'what' | 'ofwhat' | 'change' | 'plusminus'
type Operation = 'plus' | 'minus'

const MODES: Mode[] = ['smart', 'of', 'what', 'ofwhat', 'change', 'plusminus']

interface FieldSpec {
  name: string
  labelKey: string
  placeholder?: string
}

const MODE_FIELDS: Record<Mode, FieldSpec[]> = {
  smart: [],
  of: [
    {name: 'x', labelKey: 'fields.x.percent', placeholder: '20'},
    {name: 'y', labelKey: 'fields.y', placeholder: '100'},
  ],
  what: [
    {name: 'x', labelKey: 'fields.x.number', placeholder: '25'},
    {name: 'y', labelKey: 'fields.y', placeholder: '100'},
  ],
  ofwhat: [
    {name: 'x', labelKey: 'fields.x.number', placeholder: '50'},
    {name: 'p', labelKey: 'fields.p', placeholder: '25'},
  ],
  change: [
    {name: 'a', labelKey: 'fields.a', placeholder: '100'},
    {name: 'b', labelKey: 'fields.b', placeholder: '120'},
  ],
  plusminus: [
    {name: 'base', labelKey: 'fields.base', placeholder: '100'},
    {name: 'p', labelKey: 'fields.p', placeholder: '20'},
  ],
}

const MODE_PARAMS: Record<Mode, string[]> = {
  smart: ['q'],
  of: ['x', 'y'],
  what: ['x', 'y'],
  ofwhat: ['x', 'p'],
  change: ['a', 'b'],
  plusminus: ['base', 'p', 'operation'],
}

const DEFAULT_VALUES: Record<Mode, Record<string, string>> = {
  smart: {q: ''},
  of: {x: '20', y: '100'},
  what: {x: '25', y: '100'},
  ofwhat: {x: '50', p: '25'},
  change: {a: '100', b: '120'},
  plusminus: {base: '100', p: '20', operation: 'plus'},
}

// ─── Helpers ─────────────────────────────────────────────

function isMode(s: string | null): s is Mode {
  return s !== null && (MODES as string[]).includes(s)
}

function parseNum(s: string | undefined): number | null {
  if (s == null) return null
  const cleaned = s.replace(',', '.').replace(/[^\d.-]/g, '')
  if (cleaned === '' || cleaned === '-' || cleaned === '.') return null
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : null
}

function fmtNum(n: number, locale: string): string {
  return new Intl.NumberFormat(locale, {maximumFractionDigits: 4}).format(n)
}

// ─── Smart parser ────────────────────────────────────────

type ParsedMode = Exclude<Mode, 'smart'>

interface ParsedSmart {
  mode: ParsedMode
  values: Record<string, string>
}

const NUM = String.raw`(-?\d+(?:[.,]\d+)?)`
const PCT = String.raw`(?:%|процент(?:ов|а)?|percent(?:s)?)`
const SP = String.raw`\s*`

const RE_PLUSMINUS = new RegExp(
  `^${NUM}${SP}(\\+|плюс|-|минус)${SP}${NUM}${SP}${PCT}?$`,
)
const RE_OFWHAT = new RegExp(
  `^${NUM}${SP}(?:is|это|составляет)?${SP}${NUM}${SP}${PCT}${SP}(?:of${SP}what|от${SP}чего|какого${SP}числа)$`,
)
const RE_WHAT_1 = new RegExp(
  `^${NUM}${SP}(?:is|это|составляет)?${SP}what${SP}(?:percent|%|процент(?:ов|а)?)${SP}(?:of|от)${SP}${NUM}$`,
)
const RE_WHAT_2 = new RegExp(
  `^${NUM}${SP}от${SP}${NUM}${SP}в${SP}процент(?:ах|е)?$`,
)
const RE_WHAT_3 = new RegExp(
  `^сколько${SP}процент(?:ов|а)?${SP}${NUM}${SP}от${SP}${NUM}$`,
)
const RE_WHAT_4 = new RegExp(
  `^${NUM}${SP}(?:это|составляет)${SP}сколько${SP}процент(?:ов|а)?${SP}от${SP}${NUM}$`,
)
const RE_CHANGE_1 = new RegExp(
  `^(?:from|с|от)${SP}${NUM}${SP}(?:to|на|до|к)${SP}${NUM}$`,
)
const RE_CHANGE_2 = new RegExp(`^${NUM}${SP}(?:→|->|to)${SP}${NUM}$`)
const RE_OF_1 = new RegExp(`^${NUM}${SP}${PCT}${SP}(?:of|от)${SP}${NUM}$`)
const RE_OF_2 = new RegExp(
  `^(?:сколько${SP}(?:будет|это)?${SP})?${NUM}${SP}${PCT}${SP}от${SP}${NUM}$`,
)

function normNum(s: string): string {
  return s.replace(',', '.')
}

function parseSmart(input: string): ParsedSmart | null {
  if (!input) return null

  let s = input.trim().toLowerCase()
  s = s.replace(/[?!.]+$/g, '').trim()
  s = s.replace(/\s+/g, ' ')
  if (!s) return null

  let m = s.match(RE_PLUSMINUS)
  if (m) {
    const opRaw = m[2]
    const operation: Operation =
      opRaw === '+' || opRaw === 'плюс' ? 'plus' : 'minus'
    return {
      mode: 'plusminus',
      values: {base: normNum(m[1]), p: normNum(m[3]), operation},
    }
  }

  m = s.match(RE_OFWHAT)
  if (m) {
    return {mode: 'ofwhat', values: {x: normNum(m[1]), p: normNum(m[2])}}
  }

  m = s.match(RE_WHAT_1)
  if (m) return {mode: 'what', values: {x: normNum(m[1]), y: normNum(m[2])}}

  m = s.match(RE_WHAT_2)
  if (m) return {mode: 'what', values: {x: normNum(m[1]), y: normNum(m[2])}}

  m = s.match(RE_WHAT_3)
  if (m) return {mode: 'what', values: {x: normNum(m[1]), y: normNum(m[2])}}

  m = s.match(RE_WHAT_4)
  if (m) return {mode: 'what', values: {x: normNum(m[1]), y: normNum(m[2])}}

  m = s.match(RE_CHANGE_1)
  if (m) return {mode: 'change', values: {a: normNum(m[1]), b: normNum(m[2])}}

  m = s.match(RE_CHANGE_2)
  if (m) return {mode: 'change', values: {a: normNum(m[1]), b: normNum(m[2])}}

  m = s.match(RE_OF_1)
  if (m) return {mode: 'of', values: {x: normNum(m[1]), y: normNum(m[2])}}

  m = s.match(RE_OF_2)
  if (m) return {mode: 'of', values: {x: normNum(m[1]), y: normNum(m[2])}}

  return null
}

// ─── Compute ─────────────────────────────────────────────

interface CalcStep {
  label: string
  value: string
}

interface ComputeResult {
  value: number
  rendered: string
  expression: string
  secondary?: {label: string; value: string}[]
  steps?: CalcStep[]
}

type Translator = (key: string) => string

function compute(
  mode: Mode,
  v: Record<string, string>,
  locale: string,
  t: Translator,
): ComputeResult | null {
  if (mode === 'smart') {
    const parsed = parseSmart(v.q ?? '')
    if (!parsed) return null
    return compute(parsed.mode, parsed.values, locale, t)
  }

  if (mode === 'of') {
    const x = parseNum(v.x)
    const y = parseNum(v.y)
    if (x === null || y === null) return null
    const res = (x / 100) * y
    const resText = fmtNum(res, locale)
    return {
      value: res,
      rendered: resText,
      expression: `${fmtNum(x, locale)}% × ${fmtNum(y, locale)} = ${resText}`,
      steps: [
        {label: 'steps.formula', value: t('steps.formulas.of')},
        {
          label: 'steps.substitution',
          value: `X = ${fmtNum(x, locale)} × ${fmtNum(y, locale)} ÷ 100`,
        },
        {
          label: 'steps.calculation',
          value: `X = ${fmtNum(x * y, locale)} ÷ 100`,
        },
        {label: 'steps.answer', value: resText},
      ],
    }
  }

  if (mode === 'what') {
    const x = parseNum(v.x)
    const y = parseNum(v.y)
    if (x === null || y === null || y === 0) return null
    const ratio = x / y
    const res = ratio * 100
    const resText = `${fmtNum(res, locale)}%`
    return {
      value: res,
      rendered: resText,
      expression: `${fmtNum(x, locale)} ÷ ${fmtNum(y, locale)} × 100 = ${resText}`,
      steps: [
        {label: 'steps.formula', value: t('steps.formulas.what')},
        {
          label: 'steps.substitution',
          value: `P% = ${fmtNum(x, locale)} ÷ ${fmtNum(y, locale)} × 100`,
        },
        {
          label: 'steps.calculation',
          value: `P% = ${fmtNum(ratio, locale)} × 100`,
        },
        {label: 'steps.answer', value: resText},
      ],
    }
  }

  if (mode === 'ofwhat') {
    const x = parseNum(v.x)
    const p = parseNum(v.p)
    if (x === null || p === null || p === 0) return null
    const pFrac = p / 100
    const res = x / pFrac
    const resText = fmtNum(res, locale)
    return {
      value: res,
      rendered: resText,
      expression: `${fmtNum(x, locale)} ÷ (${fmtNum(p, locale)} ÷ 100) = ${resText}`,
      steps: [
        {label: 'steps.formula', value: t('steps.formulas.ofwhat')},
        {
          label: 'steps.substitution',
          value: `Y = ${fmtNum(x, locale)} ÷ (${fmtNum(p, locale)} ÷ 100)`,
        },
        {
          label: 'steps.calculation',
          value: `Y = ${fmtNum(x, locale)} ÷ ${fmtNum(pFrac, locale)}`,
        },
        {label: 'steps.answer', value: resText},
      ],
    }
  }

  if (mode === 'change') {
    const a = parseNum(v.a)
    const b = parseNum(v.b)
    if (a === null || b === null || a === 0) return null
    const diff = b - a
    const absA = Math.abs(a)
    const res = (diff / absA) * 100
    const sign = res > 0 ? '+' : res < 0 ? '−' : ''
    const resText = `${sign}${fmtNum(Math.abs(res), locale)}%`
    return {
      value: res,
      rendered: resText,
      expression: `(${fmtNum(b, locale)} − ${fmtNum(a, locale)}) ÷ ${fmtNum(absA, locale)} × 100 = ${resText}`,
      secondary: [
        {label: t('secondary.change.diff'), value: fmtNum(diff, locale)},
        {label: t('secondary.change.from'), value: fmtNum(a, locale)},
        {label: t('secondary.change.to'), value: fmtNum(b, locale)},
      ],
      steps: [
        {label: 'steps.formula', value: t('steps.formulas.change')},
        {
          label: 'steps.substitution',
          value: `Δ% = (${fmtNum(b, locale)} − ${fmtNum(a, locale)}) ÷ ${fmtNum(absA, locale)} × 100`,
        },
        {
          label: 'steps.calculation',
          value: `Δ% = ${fmtNum(diff, locale)} ÷ ${fmtNum(absA, locale)} × 100`,
        },
        {label: 'steps.answer', value: resText},
      ],
    }
  }

  if (mode === 'plusminus') {
    const base = parseNum(v.base)
    const p = parseNum(v.p)
    const op: Operation = v.operation === 'minus' ? 'minus' : 'plus'
    if (base === null || p === null) return null
    const delta = (base * p) / 100
    const res = op === 'plus' ? base + delta : base - delta
    const resText = fmtNum(res, locale)
    const sign = op === 'plus' ? '+' : '−'
    const opSign = op === 'plus' ? '+' : '−'
    const multiplier = op === 'plus' ? 1 + p / 100 : 1 - p / 100
    return {
      value: res,
      rendered: resText,
      expression: `${fmtNum(base, locale)} ${sign} ${fmtNum(Math.abs(delta), locale)} = ${resText}`,
      secondary: [
        {label: t('secondary.plusminus.base'), value: fmtNum(base, locale)},
        {
          label: t('secondary.plusminus.delta'),
          value: `${sign}${fmtNum(Math.abs(delta), locale)}`,
        },
        {
          label: t('secondary.plusminus.percent'),
          value: `${fmtNum(p, locale)}%`,
        },
      ],
      steps: [
        {
          label: 'steps.formula',
          value:
            op === 'plus'
              ? t('steps.formulas.plusminusPlus')
              : t('steps.formulas.plusminusMinus'),
        },
        {
          label: 'steps.substitution',
          value: `R = ${fmtNum(base, locale)} × (1 ${opSign} ${fmtNum(p, locale)} ÷ 100)`,
        },
        {
          label: 'steps.calculation',
          value: `R = ${fmtNum(base, locale)} × ${fmtNum(multiplier, locale)}`,
        },
        {label: 'steps.answer', value: resText},
      ],
    }
  }

  return null
}

// ─── Component ───────────────────────────────────────────

export function PercentageCalculatorView() {
  const locale = useLocale()
  const t = useTranslations('config.percentage-calculator')

  const [mode, setMode] = useState<Mode>('smart')
  const [values, setValues] = useState<Record<string, string>>(() => ({
    ...DEFAULT_VALUES.smart,
  }))

  // Hydrate from URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const m = params.get('mode')
    if (!isMode(m)) return
    const next: Record<string, string> = {...DEFAULT_VALUES[m]}
    for (const key of MODE_PARAMS[m]) {
      const val = params.get(key)
      if (val !== null && val !== '') next[key] = val
    }
    setMode(m)
    setValues(next)
  }, [])

  // Sync state → URL
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams()
    params.set('mode', mode)
    for (const key of MODE_PARAMS[mode]) {
      const val = values[key]
      if (val !== undefined && val !== '') params.set(key, val)
    }
    const url = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', url)
  }, [mode, values])

  // ─── History ────────────────────────────────────────────
  // const [history, setHistory] = useState<PercentageHistoryEntry[]>([])
  // const [historyHydrated, setHistoryHydrated] = useState(false)

  // // Load from localStorage on mount
  // useEffect(() => {
  //   setHistory(loadPercentageHistory())
  //   setHistoryHydrated(true)
  // }, [])

  // // Persist to localStorage on change
  // useEffect(() => {
  //   if (!historyHydrated) return
  //   savePercentageHistory(history)
  // }, [history, historyHydrated])

  // // Add entry (debounced) when result is stable
  // // biome-ignore lint/correctness/useExhaustiveDependencies: result derived from mode+values
  // useEffect(() => {
  //   if (!result) return
  //   const timeout = window.setTimeout(() => {
  //     setHistory(prev =>
  //       addPercentageHistoryEntry(prev, {
  //         mode,
  //         values: {...values},
  //         rendered: result.rendered,
  //         expression: result.expression,
  //       }),
  //     )
  //   }, 700)
  //   return () => window.clearTimeout(timeout)
  // }, [mode, values])

  // function handleHistorySelect(entry: PercentageHistoryEntry) {
  //   setMode(entry.mode as Mode)
  //   setValues({...entry.values})
  // }

  // function handleHistoryClear() {
  //   setHistory([])
  // }

  function handleModeChange(next: Mode) {
    setMode(next)
    setValues(prev => {
      const merged: Record<string, string> = {...DEFAULT_VALUES[next]}
      for (const key of MODE_PARAMS[next]) {
        if (prev[key] !== undefined) merged[key] = prev[key]
      }
      return merged
    })
  }

  function handleValueChange(name: string, value: string) {
    setValues(prev => ({...prev, [name]: value}))
  }

  const result = compute(mode, values, locale, t)

  const modeOptions = MODES.map(m => ({value: m, label: t(`modes.${m}`)}))
  const fields = MODE_FIELDS[mode]
  const examples = t.raw('smartExamples') as string[]

  return (
    <div className="flex flex-col gap-6">
      <SegmentedControl
        value={mode}
        options={modeOptions}
        onChange={handleModeChange}
        name="percentage-mode"
        className="w-full flex-wrap sm:w-auto"
        buttonClassName="flex-1 sm:flex-none justify-center"
      />

      {mode === 'smart' ? (
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pct-smart">{t('fields.q')}</Label>
            <Input
              id="pct-smart"
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={values.q ?? ''}
              placeholder={t('smartPlaceholder')}
              onChange={e => handleValueChange('q', e.target.value)}
              className="h-11 text-base sm:h-12"
            />
          </div>
          {examples.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {examples.map(ex => (
                <li key={ex}>
                  <button
                    type="button"
                    onClick={() => handleValueChange('q', ex)}
                    className="rounded-full border bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground cursor-pointer"
                  >
                    {ex}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {fields.map(field => (
            <div key={field.name} className="flex flex-col gap-1.5">
              <Label htmlFor={`pct-${field.name}`}>{t(field.labelKey)}</Label>
              <Input
                id={`pct-${field.name}`}
                type="text"
                inputMode="decimal"
                autoComplete="off"
                value={values[field.name] ?? ''}
                placeholder={field.placeholder}
                onChange={e => handleValueChange(field.name, e.target.value)}
              />
            </div>
          ))}

          {mode === 'plusminus' && (
            <div className="flex flex-col gap-1.5">
              <Label>{t('fields.operation.label')}</Label>
              <SegmentedControl
                value={values.operation === 'minus' ? 'minus' : 'plus'}
                options={[
                  {value: 'plus', label: t('fields.operation.plus')},
                  {value: 'minus', label: t('fields.operation.minus')},
                ]}
                onChange={v => handleValueChange('operation', v)}
                name="percentage-operation"
                className="w-full sm:w-auto"
                buttonClassName="flex-1 sm:flex-none justify-center"
              />
            </div>
          )}
        </div>
      )}

      {result && (
        <OutputPanel
          value={result.rendered}
          title={t('resultLabel')}
          rawContent
          heightClass="min-h-0"
        >
          <div className="flex flex-col gap-3">
            <div className="text-3xl font-bold tabular-nums">
              {result.rendered}
            </div>
            <div className="text-xs text-muted-foreground">
              {result.expression}
            </div>
            {result.secondary && result.secondary.length > 0 && (
              <dl className="mt-1 grid gap-1.5 text-sm">
                {result.secondary.map(item => (
                  <div key={item.label} className="flex justify-between gap-4">
                    <dt className="text-muted-foreground">{item.label}</dt>
                    <dd className="font-medium tabular-nums">{item.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </OutputPanel>
      )}

      {result?.steps && result.steps.length > 0 && (
        <details className="group rounded-xl border bg-card">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium [&::-webkit-details-marker]:hidden">
            <span className="flex items-center gap-2">
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                className="size-3.5 text-muted-foreground"
                fill="currentColor"
              >
                <path d="M4 3.5 12 8l-8 4.5v-9Z" />
              </svg>
              {t('steps.title')}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m4 6 4 4 4-4" />
            </svg>
          </summary>

          <ol className="border-t">
            {result.steps.map((step, i) => (
              <li
                key={step.label}
                className="flex items-start gap-3 border-b border-dashed px-4 py-3 last:border-b-0"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold tabular-nums text-primary">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1 text-sm leading-relaxed">
                  <span className="font-medium">{t(step.label)}: </span>
                  <span className="break-words tabular-nums">{step.value}</span>
                </div>
              </li>
            ))}
          </ol>
        </details>
      )}

      {/* <PercentageHistory
        entries={history}
        currentMode={mode}
        currentValues={values}
        onSelect={handleHistorySelect}
        onClear={handleHistoryClear}
      /> */}
    </div>
  )
}

// interface PercentageHistoryProps {
//   entries: PercentageHistoryEntry[]
//   currentMode: string
//   currentValues: Record<string, string>
//   onSelect: (entry: PercentageHistoryEntry) => void
//   onClear: () => void
// }

// function PercentageHistory({
//   entries,
//   currentMode,
//   currentValues,
//   onSelect,
//   onClear,
// }: PercentageHistoryProps) {
//   const t = useTranslations('config.percentage-calculator.history')
//   const [now, setNow] = useState(() => Date.now())

//   useEffect(() => {
//     if (entries.length === 0) return
//     const id = window.setInterval(() => setNow(Date.now()), 10_000)
//     return () => window.clearInterval(id)
//   }, [entries.length])

//   if (entries.length === 0) return null

//   return (
//     <div className="rounded-xl border bg-card">
//       <div className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-muted/60">
//         <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground">
//           <span>{t('title')}</span>
//           <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] tabular-nums">
//             {entries.length}
//           </span>
//         </div>
//         <Button
//           size="sm"
//           variant="ghost"
//           onClick={onClear}
//           className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
//         >
//           {t('clear')}
//         </Button>
//       </div>

//       <ul className="divide-y">
//         {entries.map(entry => {
//           const active = matchesCurrent(entry, currentMode, currentValues)
//           return (
//             <li key={entry.id}>
//               <button
//                 type="button"
//                 onClick={() => onSelect(entry)}
//                 className={cn(
//                   'flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted/50',
//                   active && 'bg-primary/5',
//                 )}
//               >
//                 <span className="min-w-0 flex-1 truncate tabular-nums">
//                   {entry.expression}
//                 </span>
//                 <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
//                   {formatRelativeTime(entry.timestamp, now)}
//                 </span>
//               </button>
//             </li>
//           )
//         })}
//       </ul>
//     </div>
//   )
// }
