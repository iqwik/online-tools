'use client'

import {useTranslations} from 'next-intl'
import {useSearch} from '../search/SearchProvider'
import {SearchTrigger} from '../search/SearchTrigger'
import {Badge} from '../ui/badge'
import {Stats} from './Stats'

const SUGGESTION_KEYS = [
  'bmi',
  'password',
  'json',
  'tip',
  'word',
  'compress',
] as const

export function Hero() {
  const tHome = useTranslations('home')
  const {open} = useSearch()

  // Built from the same keys as the chips below, so the typewriter
  // stays in sync with what the user actually sees.
  const placeholders = SUGGESTION_KEYS.map(key =>
    tHome('search.placeholderTry', {q: tHome(`suggestions.${key}`)}),
  )

  return (
    <section
      className="page text-center flex flex-col items-center gap-4 pb-0"
      data-testid="home-hero"
    >
      <Badge
        variant="outline"
        className="font-tag gap-2 rounded-full bg-muted/25 text-muted-foreground px-3 my-3 text-[11px] font-semibold uppercase shadow-xs max-w-full flex-wrap justify-center whitespace-normal text-center"
      >
        <span className="relative flex size-1.25">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex size-1.25 rounded-full bg-emerald-500" />
        </span>
        {tHome('badge.free')}
        <span className="text-muted-foreground/25">{' • '}</span>
        {tHome('badge.no-signup')}
        <span className="text-muted-foreground/25">{' • '}</span>
        {tHome('badge.privacy')}
      </Badge>

      <div className="w-full flex flex-col gap-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {tHome('h1')}
        </h1>

        <p className="text-muted-foreground">{tHome('subtitle')}</p>

        <div className="flex flex-col gap-3">
          <SearchTrigger
            variant="full"
            placeholders={placeholders}
            buttonClassName="m-auto h-11 outline sm:h-14 shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl transition-[shadow] duration-200 ease-linear"
            kbdClassName="inline-block opacity-100!"
          />

          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-muted-foreground/70 mr-1">
              {tHome('suggestions.label')}
            </span>
            {SUGGESTION_KEYS.map(key => (
              <button
                key={key}
                type="button"
                onClick={() => open(tHome(`suggestions.${key}`))}
                className="rounded-full border bg-secondary/50 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer"
              >
                {tHome(`suggestions.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <Stats />
      </div>
    </section>
  )
}
