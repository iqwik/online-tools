'use client'

import {useLocale, useTranslations} from 'next-intl'
import {useEffect, useState} from 'react'
import {OutputPanel} from '../shared/OutputPanel'
import {DatePicker} from '../ui/date-picker'
import {Label} from '../ui/label'

// ─── Compute ─────────────────────────────────────────────

interface AgeResult {
  years: number
  months: number
  days: number
  totalMonths: number
  totalWeeks: number
  totalDays: number
  totalHours: number
  totalMinutes: number
  totalSeconds: number
  heartbeats: number
  breaths: number
  newYears: number
  sleepHours: number
  fullMoons: number
}

const MS_PER_DAY = 1000 * 60 * 60 * 24

const PLANET_ORBITS = {
  mercury: 87.97,
  venus: 224.7,
  mars: 686.98,
  jupiter: 4332.59,
  saturn: 10759.22,
} as const

type PlanetKey = keyof typeof PLANET_ORBITS

function parseIsoDate(iso: string): Date | null {
  if (!iso) return null
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return null
  const date = new Date(y, m - 1, d)
  return Number.isNaN(date.getTime()) ? null : date
}

function computeAge(from: string, to: string): AgeResult | null {
  const birth = parseIsoDate(from)
  if (!birth) return null
  const target = to ? parseIsoDate(to) : new Date()
  if (!target) return null
  if (target.getTime() < birth.getTime()) return null

  let years = target.getFullYear() - birth.getFullYear()
  let months = target.getMonth() - birth.getMonth()
  let days = target.getDate() - birth.getDate()

  if (days < 0) {
    months--
    const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  const totalDays = Math.floor(
    (target.getTime() - birth.getTime()) / MS_PER_DAY,
  )
  const totalWeeks = Math.floor(totalDays / 7)
  const totalMonths = years * 12 + months
  const totalHours = totalDays * 24
  const totalMinutes = totalHours * 60
  const totalSeconds = totalMinutes * 60

  // Approximations
  const heartbeats = totalMinutes * 70 // 70 bpm average
  const breaths = totalMinutes * 15 // 15 breaths/min average
  const sleepHours = totalDays * 8 // 8 hours/day average
  const fullMoons = Math.floor(totalDays / 29.53)
  const newYears = years

  return {
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    totalMinutes,
    totalSeconds,
    heartbeats,
    breaths,
    newYears,
    sleepHours,
    fullMoons,
  }
}

function computeNextBirthday(
  birth: Date,
  reference: Date,
): {daysUntil: number; turningAge: number; date: Date} {
  const thisYear = reference.getFullYear()
  const next = new Date(thisYear, birth.getMonth(), birth.getDate())
  next.setHours(0, 0, 0, 0)
  const ref = new Date(reference)
  ref.setHours(0, 0, 0, 0)
  if (next.getTime() < ref.getTime()) {
    next.setFullYear(thisYear + 1)
  }
  const daysUntil = Math.round((next.getTime() - ref.getTime()) / MS_PER_DAY)
  const turningAge = next.getFullYear() - birth.getFullYear()
  return {daysUntil, turningAge, date: next}
}

// ─── Component ───────────────────────────────────────────

export function AgeCalculatorView() {
  const locale = useLocale()
  const t = useTranslations('config.age-calculator')

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  // Hydrate from URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const f = params.get('from')
    const tt = params.get('to')
    if (f) setFrom(f)
    if (tt) setTo(tt)
  }, [])

  // Sync state → URL
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    const search = params.toString()
    const url = search
      ? `${window.location.pathname}?${search}`
      : window.location.pathname
    window.history.replaceState(null, '', url)
  }, [from, to])

  const result = computeAge(from, to)

  const nextBirthday = (() => {
    const birth = parseIsoDate(from)
    if (!birth) return null
    const reference = to ? parseIsoDate(to) : new Date()
    if (!reference) return null
    if (reference.getTime() < birth.getTime()) return null
    return computeNextBirthday(birth, reference)
  })()

  const fmtInt = (n: number) => new Intl.NumberFormat(locale).format(n)
  const fmtDec1 = (n: number) =>
    new Intl.NumberFormat(locale, {maximumFractionDigits: 1}).format(n)

  const planetEntries: [PlanetKey, number][] = result
    ? (Object.keys(PLANET_ORBITS) as PlanetKey[]).map(k => [
        k,
        result.totalDays / PLANET_ORBITS[k],
      ])
    : []

  return (
    <div className="flex flex-col gap-6">
      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="age-from">{t('fields.from')}</Label>
          <DatePicker id="age-from" value={from} onChange={setFrom} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="age-to">{t('fields.to')}</Label>
          <DatePicker
            id="age-to"
            value={to}
            onChange={setTo}
            placeholder={t('fields.toPlaceholder')}
          />
        </div>
      </div>

      {result && (
        <>
          <OutputPanel
            value={t('result.main', {
              years: result.years,
              months: result.months,
              days: result.days,
            })}
            title={t('resultLabel')}
            rawContent
            heightClass="min-h-0"
          >
            <div className="flex flex-col gap-3">
              <div className="text-3xl font-bold tabular-nums">
                {t('result.main', {
                  years: result.years,
                  months: result.months,
                  days: result.days,
                })}
              </div>
              <dl className="mt-1 grid gap-1.5 text-sm sm:grid-cols-2">
                <Stat
                  label={t('units.totalMonths')}
                  value={fmtInt(result.totalMonths)}
                />
                <Stat
                  label={t('units.totalWeeks')}
                  value={fmtInt(result.totalWeeks)}
                />
                <Stat
                  label={t('units.totalDays')}
                  value={fmtInt(result.totalDays)}
                />
                <Stat
                  label={t('units.totalHours')}
                  value={fmtInt(result.totalHours)}
                />
                <Stat
                  label={t('units.totalMinutes')}
                  value={fmtInt(result.totalMinutes)}
                />
                <Stat
                  label={t('units.totalSeconds')}
                  value={fmtInt(result.totalSeconds)}
                />
              </dl>
            </div>
          </OutputPanel>

          {/* next birthday */}
          {nextBirthday && (
            <section className="rounded-xl border bg-card p-4 sm:p-5">
              <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {t('nextBirthday.title')}
              </h2>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    {t('nextBirthday.date')}
                  </span>
                  <span className="text-lg font-semibold tabular-nums">
                    {nextBirthday.date.toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    {t('nextBirthday.turning')}
                  </span>
                  <span className="text-lg font-semibold tabular-nums">
                    {nextBirthday.turningAge}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-muted-foreground">
                    {t('nextBirthday.daysLeft')}
                  </span>
                  <span className="text-lg font-semibold tabular-nums">
                    {fmtInt(nextBirthday.daysUntil)}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* Planets */}
          <section className="rounded-xl border bg-card p-4 sm:p-5">
            <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {t('planets.title')}
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {planetEntries.map(([planet, years]) => (
                <div
                  key={planet}
                  className="flex items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2"
                >
                  <span className="text-sm">{t(`planets.${planet}`)}</span>
                  <span className="text-sm font-medium tabular-nums">
                    {fmtDec1(years)} {t('planets.unit')}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Fun facts */}
          <section className="rounded-xl border bg-card p-4 sm:p-5">
            <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              {t('facts.title')}
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <Fact
                label={t('facts.heartbeats')}
                value={fmtInt(result.heartbeats)}
              />
              <Fact label={t('facts.breaths')} value={fmtInt(result.breaths)} />
              <Fact
                label={t('facts.newYears')}
                value={fmtInt(result.newYears)}
              />
              <Fact
                label={t('facts.sleep')}
                value={fmtInt(result.sleepHours)}
              />
              <Fact
                label={t('facts.fullMoons')}
                value={fmtInt(result.fullMoons)}
              />
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function Stat({label, value}: {label: string; value: string}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  )
}

function Fact({label, value}: {label: string; value: string}) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  )
}
