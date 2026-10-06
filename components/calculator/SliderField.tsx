'use client'

import {PencilIcon} from '@animateicons/react/lucide/pencil-icon'
import {useLocale, useTranslations} from 'next-intl'
import {useLayoutEffect, useRef, useState} from 'react'
import {useEvent} from '@/hooks/use-event'
import type {InputField} from '@/types'
import {Button} from '../ui/button'
import {Input} from '../ui/input'
import {Slider} from '../ui/slider'

interface Props {
  input: InputField
  label: string
  value: number
  onChange: (value: number) => void
}

function focusEnd(el: HTMLInputElement | null) {
  if (!el) return
  el.focus({preventScroll: true})
  const len = el.value.length
  el.setSelectionRange(len, len)
}

function chWidth(text: string): string {
  return `calc(${Math.max(text.length, 1)}ch + 1.25rem)`
}

function countMeaningful(s: string): number {
  let n = 0
  for (const c of s) {
    if (c === '-' || (c >= '0' && c <= '9')) n++
  }
  return n
}

function posAfterMeaningful(s: string, n: number): number {
  if (n <= 0) return 0
  let count = 0
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '-' || (c >= '0' && c <= '9')) {
      count++
      if (count === n) return i + 1
    }
  }
  return s.length
}

function restoreCursor(
  el: HTMLInputElement | null,
  ref: {current: number | null},
) {
  if (!el || ref.current === null) return
  el.setSelectionRange(ref.current, ref.current)
  ref.current = null
}

export function SliderField({input, label, value, onChange}: Props) {
  const locale = useLocale()
  const t = useTranslations('config')
  const tGlobal = useTranslations('global')

  const configMin = input.min ?? 0
  const configMax = input.max ?? 100
  const step = input.step ?? 1

  const [min, setMin] = useState(configMin)
  const [max, setMax] = useState(configMax)

  const valueRef = useRef<HTMLInputElement>(null)
  const minRef = useRef<HTMLInputElement>(null)
  const maxRef = useRef<HTMLInputElement>(null)

  const valueCursor = useRef<number | null>(null)
  const minCursor = useRef<number | null>(null)
  const maxCursor = useRef<number | null>(null)

  const format = useEvent((n: number) => {
    const formatter = new Intl.NumberFormat(locale)
    return formatter.format(n)
  })

  function parse(s: string): number | null {
    const cleaned = s.replace(/[^\d-]/g, '')
    if (cleaned === '' || cleaned === '-') return null
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : null
  }

  function clamp(n: number): number {
    return Math.max(min, Math.min(max, n))
  }

  const safeValue = Number.isFinite(value) ? value : configMin
  const valueText = format(safeValue)
  const minText = format(min)
  const maxText = format(max)

  useLayoutEffect(() => {
    restoreCursor(valueRef.current, valueCursor)
    restoreCursor(minRef.current, minCursor)
    restoreCursor(maxRef.current, maxCursor)
  })

  function handleValueChange(raw: string, cursor: number) {
    const before = countMeaningful(raw.slice(0, cursor))
    const n = parse(raw)
    const newValue = n ?? 0
    valueCursor.current = posAfterMeaningful(format(newValue), before)
    onChange(newValue)
  }

  function handleValueBlur() {
    const clamped = clamp(safeValue)
    if (clamped !== safeValue) onChange(clamped)
  }

  function handleMinChange(raw: string, cursor: number) {
    const before = countMeaningful(raw.slice(0, cursor))
    const n = parse(raw)
    const next = n ?? 0
    minCursor.current = posAfterMeaningful(format(next), before)
    setMin(next)
    if (value < next) onChange(next)
  }

  function handleMinBlur() {
    const next = Math.min(min, max - step)
    if (next !== min) setMin(next)
    if (value < next) onChange(next)
  }

  function handleMaxChange(raw: string, cursor: number) {
    const before = countMeaningful(raw.slice(0, cursor))
    const n = parse(raw)
    const next = n ?? 0
    maxCursor.current = posAfterMeaningful(format(next), before)
    setMax(next)
    if (value > next) onChange(next)
  }

  function handleMaxBlur() {
    const next = Math.max(max, min + step)
    if (next !== max) setMax(next)
    if (value > next) onChange(next)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-4">
        <label htmlFor={input.name} className="text-sm font-medium">
          {label}
          {input.unit && (
            <span className="ml-1 text-muted-foreground">
              ({t.has(input.unit) ? t(input.unit) : input.unit})
            </span>
          )}
        </label>
        <div className="relative inline-flex items-center">
          <Input
            ref={valueRef}
            id={input.name}
            type="text"
            inputMode="numeric"
            value={valueText}
            onChange={e =>
              handleValueChange(
                e.target.value,
                e.target.selectionStart ?? e.target.value.length,
              )
            }
            onBlur={handleValueBlur}
            style={{width: chWidth(valueText)}}
            className="h-8 mr-2 rounded-none border-none p-0 tabular-nums focus-visible:ring-0"
          />
          <Button
            size="icon-sm"
            variant="ghost"
            aria-label={tGlobal('edit')}
            onClick={() => focusEnd(valueRef.current)}
            className="absolute -right-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <PencilIcon isAnimated={false} className="size-3.5" />
          </Button>
        </div>
      </div>

      <Slider
        value={[clamp(safeValue)]}
        min={min}
        max={max}
        step={step}
        onValueChange={next => onChange(Array.isArray(next) ? next[0] : next)}
      />

      <div className="flex justify-between text-xs text-muted-foreground">
        <div className="relative inline-flex items-end gap-1">
          <span>{tGlobal('min')}</span>
          <Input
            ref={minRef}
            type="text"
            inputMode="numeric"
            value={minText}
            style={{width: chWidth(minText)}}
            onChange={e =>
              handleMinChange(
                e.target.value,
                e.target.selectionStart ?? e.target.value.length,
              )
            }
            onBlur={handleMinBlur}
            className="h-4 rounded-none border-none p-0 text-xs tabular-nums focus-visible:ring-0 md:text-xs"
          />
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label={tGlobal('edit')}
            onClick={() => focusEnd(minRef.current)}
            className="absolute -right-1 -top-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <PencilIcon isAnimated={false} className="size-3" />
          </Button>
        </div>
        <div className="inline-flex items-end gap-1 relative">
          <span>{tGlobal('max')}</span>
          <Input
            ref={maxRef}
            type="text"
            inputMode="numeric"
            value={maxText}
            style={{width: chWidth(maxText)}}
            onChange={e =>
              handleMaxChange(
                e.target.value,
                e.target.selectionStart ?? e.target.value.length,
              )
            }
            onBlur={handleMaxBlur}
            className="h-4 rounded-none border-none p-0 text-xs tabular-nums focus-visible:ring-0 md:text-xs"
          />
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label={tGlobal('edit')}
            onClick={() => focusEnd(maxRef.current)}
            className="absolute -right-1 -top-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <PencilIcon isAnimated={false} className="size-3" />
          </Button>
        </div>
      </div>

      {input.hint && (
        <p className="text-xs text-muted-foreground">{t(input.hint)}</p>
      )}
    </div>
  )
}
