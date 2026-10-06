'use client'

import {useEffect, useRef, useState} from 'react'

interface UseTypewriterOptions {
  /** Lines to type in a loop. */
  texts: string[]
  /** Delay between characters while typing, ms. */
  typeSpeed?: number
  /** Delay between characters while erasing, ms. */
  eraseSpeed?: number
  /** Pause after a line is fully typed, ms. */
  holdDuration?: number
  /** Delay before the very first character, ms. */
  startDelay?: number
  /** Pause between erasing and typing the next line, ms. */
  betweenDelay?: number
  /** If false — shows texts[0] statically, no loop. */
  enabled?: boolean
}

/**
 * Loops through an array of strings, typing and erasing them character by character.
 * — Respects prefers-reduced-motion (renders the first line without animation).
 * — Restarts when texts content changes (e.g. locale switch).
 * — Safe against unstable array references (compares by content).
 */
export function useTypewriter({
  texts,
  typeSpeed = 55,
  eraseSpeed = 25,
  holdDuration = 1600,
  startDelay = 300,
  betweenDelay = 400,
  enabled = true,
}: UseTypewriterOptions): string {
  const [displayed, setDisplayed] = useState('')

  // Stable representation of the array for deps.
  const key = texts.join('\u0000')
  const textsRef = useRef(texts)
  textsRef.current = texts

  // biome-ignore lint/correctness/useExhaustiveDependencies: key is a stable representation of texts
  useEffect(() => {
    const items = textsRef.current
    if (!enabled || items.length === 0) {
      setDisplayed(items[0] ?? '')
      return
    }

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduced) {
      setDisplayed(items[0])
      return
    }

    let cancelled = false
    let timer: number | undefined
    let current = 0
    let i = 0
    let phase: 'start' | 'typing' | 'holding' | 'erasing' | 'between' = 'start'

    function tick() {
      if (cancelled) return
      const text = items[current]

      switch (phase) {
        case 'start':
        case 'between': {
          setDisplayed('')
          phase = 'typing'
          timer = window.setTimeout(tick, 20)
          return
        }
        case 'typing': {
          i += 1
          setDisplayed(text.slice(0, i))
          if (i >= text.length) {
            phase = 'holding'
            timer = window.setTimeout(tick, holdDuration)
          } else {
            timer = window.setTimeout(tick, typeSpeed)
          }
          return
        }
        case 'holding': {
          phase = 'erasing'
          timer = window.setTimeout(tick, 20)
          return
        }
        case 'erasing': {
          i -= 1
          setDisplayed(text.slice(0, i))
          if (i <= 0) {
            current = (current + 1) % items.length
            i = 0
            phase = 'between'
            timer = window.setTimeout(tick, betweenDelay)
          } else {
            timer = window.setTimeout(tick, eraseSpeed)
          }
          return
        }
      }
    }

    setDisplayed('')
    timer = window.setTimeout(tick, startDelay)

    return () => {
      cancelled = true
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [
    key,
    typeSpeed,
    eraseSpeed,
    holdDuration,
    startDelay,
    betweenDelay,
    enabled,
  ])

  return displayed
}
