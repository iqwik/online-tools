'use client'

import {TooltipPositionerProps} from '@base-ui/react/tooltip'
import {cn} from 'cn'
import {useTranslations} from 'next-intl'
import {useEffect, useRef, useState} from 'react'
import {useTypewriter} from '@/hooks/use-typewriter'
import {SearchIcon, SearchIconHandle} from '../ui/search-icon'
import {Tooltip, TooltipContent, TooltipTrigger} from '../ui/tooltip'
import {useSearch} from './SearchProvider'

interface Props {
  variant?: 'full' | 'icon'
  tooltip?: boolean
  tooltipSide?: TooltipPositionerProps['side']
  /** Static placeholder. Ignored if `placeholders` is provided. */
  placeholder?: string
  /** Array of placeholders to cycle through with a typewriter animation. */
  placeholders?: string[]
  buttonClassName?: string
  kbdClassName?: string
}

export function SearchTrigger({
  variant = 'full',
  tooltip,
  tooltipSide = 'bottom',
  placeholder,
  placeholders,
  buttonClassName,
  kbdClassName,
}: Props) {
  const t = useTranslations('home')
  const {open} = useSearch()
  const [modKey, setModKey] = useState('Ctrl')

  const searchIconRef = useRef<SearchIconHandle>(null)

  useEffect(() => {
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform)
    setModKey(isMac ? '⌘' : 'Ctrl')
  }, [])

  const isFull = variant === 'full'
  const hotKey = `${modKey}+K`

  const fullPlaceholders =
    placeholders && placeholders.length > 0
      ? placeholders
      : [placeholder || t('search.label')]
  const shouldAnimate = isFull && Boolean(placeholders?.length)
  const typed = useTypewriter({
    texts: fullPlaceholders,
    enabled: shouldAnimate,
  })

  const button = (
    <button
      type="button"
      onClick={() => open()}
      aria-label={t('search.label')}
      aria-keyshortcuts="Meta+K Control+K"
      onMouseEnter={() => searchIconRef.current?.startAnimation()}
      onMouseLeave={() => searchIconRef.current?.stopAnimation()}
      className={cn(
        'group/search relative inline-flex size-9 shrink-0 items-center rounded-lg',
        'text-muted-foreground outline-none cursor-pointer bg-transparent',
        'transition-[width,background-color] duration-200 ease-linear',
        'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isFull ? 'w-full' : 'hover:bg-accent hover:text-foreground',
        buttonClassName,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 rounded-md border border-border',
          'transition-opacity duration-200 ease-linear',
          isFull ? 'opacity-100' : 'opacity-0',
        )}
      />

      <span className="relative flex size-9 shrink-0 items-center justify-center">
        <SearchIcon
          ref={searchIconRef}
          isAnimated={false}
          className="size-4.5"
        />
      </span>

      {isFull && (
        <>
          <span className="min-w-0 flex-1 truncate pr-2 text-left">
            {shouldAnimate ? typed : fullPlaceholders[0]}
            {shouldAnimate && (
              <span
                aria-hidden
                className="ml-0.5 inline-block h-[1em] w-px translate-y-[0.15em] bg-current animate-[caret-blink_1s_steps(2,start)_infinite]"
              />
            )}
          </span>

          <kbd
            data-slot="kbd"
            className={cn(
              'mr-3 hidden shrink-0 rounded border bg-background',
              'px-1.5 font-mono text-xs text-muted-foreground/80',
              'sm:inline-block sm:opacity-0 sm:group-hover/search:opacity-100',
              'transition-opacity duration-200 ease-out',
              kbdClassName,
            )}
          >
            {modKey}+K
          </kbd>
        </>
      )}
    </button>
  )

  if (!tooltip) return button

  return (
    <Tooltip>
      <TooltipTrigger render={<span className="inline-flex w-full" />}>
        {button}
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>
        {t('search.label')} {hotKey}
      </TooltipContent>
    </Tooltip>
  )
}
