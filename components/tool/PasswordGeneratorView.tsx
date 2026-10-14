'use client'

import {Download, RefreshCw} from 'lucide-react'
import {useTranslations} from 'next-intl'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {CopyButton} from '../shared/CopyButton'
import {Button} from '../ui/button'
import {Input} from '../ui/input'
import {Label} from '../ui/label'
import {SegmentedControl} from '../ui/segmented-control'
import {Slider} from '../ui/slider'

/** Available generation modes. */
type Mode = 'random' | 'pronounceable' | 'pin' | 'pattern'

/** User-configurable generator options. */
interface Options {
  mode: Mode
  length: number
  count: number
  lowercase: boolean
  uppercase: boolean
  numbers: boolean
  symbols: boolean
  excludeAmbiguous: boolean
  excludeAwkward: boolean
  pattern: string
}

/** Default options — also used as the base when URL params are missing. */
const DEFAULT_OPTIONS: Options = {
  mode: 'random',
  length: 16,
  count: 1,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: false,
  excludeAwkward: false,
  pattern: 'Cccdds',
}

/** Boolean option keys, in URL order. */
const BOOL_KEYS = [
  'lowercase',
  'uppercase',
  'numbers',
  'symbols',
  'excludeAmbiguous',
  'excludeAwkward',
] as const

/** Character pools per class. */
const CHARSETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?/',
}

/** Characters that look similar and are easy to confuse. */
const AMBIGUOUS = 'il1Lo0O'

/** Characters that are hard to type or easy to break in shells. */
const AWKWARD = '{}[]/\\\'"`'

/** Consonants and vowels used for pronounceable mode. */
const CONSONANTS = 'bcdfghjklmnpqrstvwxyz'
const VOWELS = 'aeiou'

// ─── URL sync ──────────────────────────────────────────────────────

/**
 * Read generator options from the current URL search params.
 * Only valid values are returned; invalid ones fall back to defaults.
 */
function readOptionsFromUrl(): Partial<Options> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const out: Partial<Options> = {}

  const mode = params.get('mode')
  if (
    mode === 'random' ||
    mode === 'pronounceable' ||
    mode === 'pin' ||
    mode === 'pattern'
  ) {
    out.mode = mode
  }

  const length = params.get('length')
  if (length) {
    const n = Number(length)
    if (Number.isFinite(n) && n >= 4 && n <= 128) out.length = Math.round(n)
  }

  const count = params.get('count')
  if (count) {
    const n = Number(count)
    if (Number.isFinite(n) && n >= 1 && n <= 500) out.count = Math.round(n)
  }

  for (const key of BOOL_KEYS) {
    const v = params.get(key)
    if (v === '1') out[key] = true
    else if (v === '0') out[key] = false
  }

  const pattern = params.get('pattern')
  if (pattern) out.pattern = pattern

  return out
}

/**
 * Write generator options to the URL via replaceState.
 * Only non-default values are written to keep the URL short.
 * Uses replaceState (not pushState) to avoid flooding browser history.
 */
function syncOptionsToUrl(options: Options) {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams()

  if (options.mode !== DEFAULT_OPTIONS.mode) params.set('mode', options.mode)
  if (options.length !== DEFAULT_OPTIONS.length)
    params.set('length', String(options.length))
  if (options.count !== DEFAULT_OPTIONS.count)
    params.set('count', String(options.count))

  for (const key of BOOL_KEYS) {
    if (options[key] !== DEFAULT_OPTIONS[key]) {
      params.set(key, options[key] ? '1' : '0')
    }
  }

  if (
    options.mode === 'pattern' &&
    options.pattern !== DEFAULT_OPTIONS.pattern
  ) {
    params.set('pattern', options.pattern)
  }

  const qs = params.toString()
  const url = qs
    ? `${window.location.pathname}?${qs}`
    : window.location.pathname
  window.history.replaceState(null, '', url)
}

// ─── Random helpers ────────────────────────────────────────────────

/**
 * Uniform random integer in [0, max) using rejection sampling.
 * Prevents modulo bias when max does not divide 2^32 evenly.
 */
function randomInt(max: number): number {
  const limit = Math.floor(0xffffffff / max) * max
  const arr = new Uint32Array(1)
  let val: number
  do {
    crypto.getRandomValues(arr)
    val = arr[0]
  } while (val >= limit)
  return val % max
}

// ─── Generators ────────────────────────────────────────────────────

/** Build the active character pool from the current options. */
function buildCharset(options: Options): string {
  let charset = ''
  if (options.lowercase) charset += CHARSETS.lowercase
  if (options.uppercase) charset += CHARSETS.uppercase
  if (options.numbers) charset += CHARSETS.numbers
  if (options.symbols) charset += CHARSETS.symbols

  let exclude = ''
  if (options.excludeAmbiguous) exclude += AMBIGUOUS
  if (options.excludeAwkward) exclude += AWKWARD

  if (exclude) {
    charset = charset
      .split('')
      .filter(c => !exclude.includes(c))
      .join('')
  }
  return charset
}

/** Generate a random password from the active character pool. */
function generateRandom(options: Options): string {
  const charset = buildCharset(options)
  if (!charset) return ''
  let out = ''
  for (let i = 0; i < options.length; i++) {
    out += charset[randomInt(charset.length)]
  }
  return out
}

/** Alternates consonant-vowel pairs so the result is easy to pronounce. */
function generatePronounceable(length: number): string {
  let out = ''
  let useConsonant = randomInt(2) === 0
  for (let i = 0; i < length; i++) {
    out += useConsonant
      ? CONSONANTS[randomInt(CONSONANTS.length)]
      : VOWELS[randomInt(VOWELS.length)]
    useConsonant = !useConsonant
  }
  return out
}

/** Generate a numeric PIN of the given length. */
function generatePin(length: number): string {
  let out = ''
  for (let i = 0; i < length; i++) {
    out += CHARSETS.numbers[randomInt(10)]
  }
  return out
}

/**
 * Pattern tokens: c = lowercase, C = uppercase, d = digit,
 * s = symbol, x = any alphanumeric. Other chars are literal.
 */
function generatePattern(pattern: string): string {
  let out = ''
  for (const ch of pattern) {
    switch (ch) {
      case 'c':
        out += CHARSETS.lowercase[randomInt(26)]
        break
      case 'C':
        out += CHARSETS.uppercase[randomInt(26)]
        break
      case 'd':
        out += CHARSETS.numbers[randomInt(10)]
        break
      case 's':
        out += CHARSETS.symbols[randomInt(CHARSETS.symbols.length)]
        break
      case 'x':
        out += (CHARSETS.lowercase + CHARSETS.numbers)[randomInt(36)]
        break
      default:
        out += ch
    }
  }
  return out
}

/** Dispatch to the generator matching the current mode. */
function generateOne(options: Options): string {
  switch (options.mode) {
    case 'pronounceable':
      return generatePronounceable(options.length)
    case 'pin':
      return generatePin(options.length)
    case 'pattern':
      return generatePattern(options.pattern)
    default:
      return generateRandom(options)
  }
}

/** Shannon entropy in bits. Approximate for non-random modes. */
function estimateEntropy(options: Options): number {
  if (options.mode === 'pin') {
    return options.length * Math.log2(10)
  }
  if (options.mode === 'pronounceable') {
    // ~20 distinct symbols across the consonant/vowel alphabet
    return options.length * Math.log2(20)
  }
  if (options.mode === 'pattern') {
    return options.pattern.length * Math.log2(36)
  }
  const charset = buildCharset(options)
  if (!charset) return 0
  return options.length * Math.log2(charset.length)
}

/** Minimal shape of a next-intl translator function. */
type TFunc = (key: string, values?: Record<string, number>) => string

/**
 * Localized crack-time string from entropy in bits.
 * Assumes 100 billion guesses/sec — a realistic GPU rig against MD5.
 */
function crackTime(entropy: number, t: TFunc): string {
  const attemptsPerSec = 1e11
  const seconds = 2 ** entropy / attemptsPerSec
  if (seconds < 1) return t('password-generator.crack.instant')
  if (seconds < 60)
    return t('password-generator.crack.seconds', {n: Math.round(seconds)})
  if (seconds < 3600)
    return t('password-generator.crack.minutes', {n: Math.round(seconds / 60)})
  if (seconds < 86400)
    return t('password-generator.crack.hours', {n: Math.round(seconds / 3600)})
  if (seconds < 31536000)
    return t('password-generator.crack.days', {n: Math.round(seconds / 86400)})
  if (seconds < 31536000 * 1000)
    return t('password-generator.crack.years', {
      n: Math.round(seconds / 31536000),
    })
  return t('password-generator.crack.forever')
}

// ─── Component ─────────────────────────────────────────────────────

/** Password generator with four modes, bulk export, and URL sync. */
export function PasswordGeneratorView() {
  const t = useTranslations('config')

  const [options, setOptions] = useState<Options>(DEFAULT_OPTIONS)
  const [passwords, setPasswords] = useState<string[]>([])
  const [isReady, setIsReady] = useState(false)

  // On mount: read options from URL, then mark state as ready.
  // The two setStates batch into one rerender, so the effect below
  // runs only once with the URL-derived options.
  useEffect(() => {
    const fromUrl = readOptionsFromUrl()
    setOptions(prev => ({...prev, ...fromUrl}))
    setIsReady(true)
  }, [])

  // After mount: mirror options into the URL on every change.
  // Skipped until isReady — otherwise the first sync would write defaults.
  useEffect(() => {
    if (!isReady) return
    syncOptionsToUrl(options)
  }, [options, isReady])

  const regenerate = useCallback(() => {
    const result: string[] = []
    for (let i = 0; i < options.count; i++) {
      result.push(generateOne(options))
    }
    setPasswords(result)
  }, [options])

  useEffect(() => {
    regenerate()
  }, [regenerate])

  const entropy = useMemo(() => estimateEntropy(options), [options])
  const crack = useMemo(() => crackTime(entropy, t), [entropy, t])

  function update<K extends keyof Options>(key: K, value: Options[K]) {
    setOptions(prev => ({...prev, [key]: value}))
  }

  function toggle(key: keyof Options) {
    setOptions(prev => ({...prev, [key]: !prev[key]}))
  }

  /** Download all generated passwords as a plain text file, one per line. */
  function downloadTxt() {
    const content = passwords.join('\n')
    const blob = new Blob([content], {type: 'text/plain;charset=utf-8'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `passwords-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /** Length is derived from the pattern, so the slider is hidden. */
  const showLength = options.mode !== 'pattern'

  const modeOptions: {value: Mode; label: string}[] = [
    {value: 'random', label: t('password-generator.modeRandom')},
    {value: 'pronounceable', label: t('password-generator.modePronounceable')},
    {value: 'pin', label: t('password-generator.modePin')},
    {value: 'pattern', label: t('password-generator.modePattern')},
  ]

  return (
    <div className="space-y-5">
      {/* Mode tabs */}
      <SegmentedControl
        name="pw-mode"
        value={options.mode}
        options={modeOptions}
        onChange={next => update('mode', next)}
        variant="primary"
        className="w-full"
        buttonClassName="flex-1 justify-center py-2"
      />

      {/* Settings */}
      <div className="space-y-4 rounded-2xl border bg-card p-6">
        {/* Length slider (hidden in pattern mode) */}
        {showLength && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="pw-length">
                {t('password-generator.length')}
              </Label>
              <Input
                id="pw-length"
                type="number"
                min={4}
                max={128}
                value={options.length}
                onChange={e => {
                  const n = Math.max(
                    4,
                    Math.min(128, Number(e.target.value) || 4),
                  )
                  update('length', n)
                }}
                className="h-8 w-20 text-right tabular-nums"
              />
            </div>
            <Slider
              value={[options.length]}
              min={4}
              max={128}
              step={1}
              onValueChange={next =>
                update('length', Array.isArray(next) ? next[0] : next)
              }
            />
          </div>
        )}

        {/* Pattern input (pattern mode only) */}
        {options.mode === 'pattern' && (
          <div className="space-y-2">
            <Label htmlFor="pw-pattern">
              {t('password-generator.patternLabel')}
            </Label>
            <Input
              id="pw-pattern"
              value={options.pattern}
              onChange={e => update('pattern', e.target.value)}
              placeholder="Cccdds"
              className="font-mono"
            />
            <p className="text-xs text-muted-foreground">
              {t('password-generator.patternHint')}
            </p>
          </div>
        )}

        {/* Batch count */}
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="pw-count">{t('password-generator.count')}</Label>
            <Input
              id="pw-count"
              type="number"
              min={1}
              max={500}
              value={options.count}
              onChange={e => {
                const n = Math.max(
                  1,
                  Math.min(500, Number(e.target.value) || 1),
                )
                update('count', n)
              }}
              className="h-8 w-20 text-right tabular-nums"
            />
          </div>
        </div>

        {/* Character toggles (random mode only) */}
        {options.mode === 'random' && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <ToggleRow
              id="pw-lowercase"
              label={t('password-generator.lowercase')}
              checked={options.lowercase}
              onToggle={() => toggle('lowercase')}
            />
            <ToggleRow
              id="pw-uppercase"
              label={t('password-generator.uppercase')}
              checked={options.uppercase}
              onToggle={() => toggle('uppercase')}
            />
            <ToggleRow
              id="pw-numbers"
              label={t('password-generator.numbers')}
              checked={options.numbers}
              onToggle={() => toggle('numbers')}
            />
            <ToggleRow
              id="pw-symbols"
              label={t('password-generator.symbols')}
              checked={options.symbols}
              onToggle={() => toggle('symbols')}
            />
            <ToggleRow
              id="pw-ambiguous"
              label={t('password-generator.excludeAmbiguous')}
              checked={options.excludeAmbiguous}
              onToggle={() => toggle('excludeAmbiguous')}
            />
            <ToggleRow
              id="pw-awkward"
              label={t('password-generator.excludeAwkward')}
              checked={options.excludeAwkward}
              onToggle={() => toggle('excludeAwkward')}
            />
          </div>
        )}
      </div>

      {/* Generated passwords + actions */}
      <div className="rounded-2xl border bg-card p-4">
        <div className="space-y-2">
          {passwords.map((pw, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="text"
                value={pw}
                readOnly
                spellCheck={false}
                className="h-11 flex-1 rounded-lg border bg-background px-4 font-mono text-base outline-none focus:ring-2 focus:ring-primary/30"
                aria-label={`${t('password-generator.passwordLabel')} ${i + 1}`}
              />
              <CopyButton
                getValue={() => pw}
                showLabel={false}
                className="h-11 w-11 border bg-background p-0 text-foreground hover:bg-accent"
              />
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            size="sm"
            onClick={regenerate}
            className="flex-1"
          >
            <RefreshCw />
            {t('password-generator.generate')}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={downloadTxt}
            disabled={passwords.length === 0}
            className="flex-1"
          >
            <Download />
            {t('password-generator.downloadTxt')}
          </Button>
        </div>

        {/* Entropy and crack time */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {t('password-generator.entropy')}
            </span>
            <span className="font-medium tabular-nums">
              {entropy.toFixed(1)} {t('password-generator.bits')}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {t('password-generator.crackTime')}
            </span>
            <span className="font-medium">{crack}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/** Toggle row rendered as a switch button. */
interface ToggleRowProps {
  id: string
  label: string
  checked: boolean
  onToggle: () => void
}

function ToggleRow({id, label, checked, onToggle}: ToggleRowProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-sm transition ${
        checked
          ? 'border-primary/40 bg-primary/5'
          : 'border-border bg-background hover:bg-muted/40'
      }`}
      id={id}
    >
      <span className={checked ? 'font-medium' : 'text-muted-foreground'}>
        {label}
      </span>
      <span
        className={`h-4 w-4 shrink-0 rounded-full border-2 transition ${
          checked
            ? 'border-primary bg-primary'
            : 'border-muted-foreground/40 bg-transparent'
        }`}
      />
    </button>
  )
}
