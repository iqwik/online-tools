'use client'

import {CheckIcon} from '@animateicons/react/lucide/check-icon'
import {CopyIcon} from '@animateicons/react/lucide/copy-icon'
import {Trash2Icon} from '@animateicons/react/lucide/trash-2-icon'
import {useTranslations} from 'next-intl'
import type {ReactNode} from 'react'
import {useMemo, useState} from 'react'
import {Button} from '@/components/ui/button'
import {
  analyzeText,
  cleanText,
  type HiddenChar,
  type HiddenCharIssue,
} from '@/helpers'
import {InputPanel} from '../shared/InputPanel'

const ISSUE_CLASS: Record<HiddenCharIssue, string> = {
  invisible: 'bg-blue-500/20 text-blue-900 dark:text-blue-200 rounded px-0.5',
  homoglyph:
    'bg-amber-500/30 text-amber-900 dark:text-amber-100 rounded px-0.5',
  mixed: 'bg-rose-500/25 text-rose-900 dark:text-rose-100 rounded px-0.5',
}

export function HiddenCharacterFinderView() {
  const t = useTranslations('config')
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  const results = useMemo(() => analyzeText(text), [text])
  const hasResults = results.length > 0

  async function handleCopyCleaned() {
    try {
      await navigator.clipboard.writeText(cleanText(text))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  function handleClear() {
    setText('')
  }

  return (
    <div className="space-y-5">
      <InputPanel
        title={t('hidden-character-finder.inputLabel')}
        value={text}
        onChange={setText}
        placeholder={t('hidden-character-finder.inputPlaceholder')}
        heightClass="h-[240px]"
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyCleaned}
              disabled={!text}
            >
              {copied ? (
                <CheckIcon size={14} className="mr-1.5" />
              ) : (
                <CopyIcon size={14} className="mr-1.5" />
              )}
              {copied
                ? t('hidden-character-finder.copyCleanedDone')
                : t('hidden-character-finder.copyCleanedButton')}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={!text}
              className="text-destructive hover:text-destructive"
            >
              <Trash2Icon size={14} className="mr-1.5" />
              {t('hidden-character-finder.clearButton')}
            </Button>
          </>
        }
      />

      {text && !hasResults && (
        <div className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
          {t('hidden-character-finder.noResults')}
        </div>
      )}

      {hasResults && (
        <>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <LegendChip
              className="bg-blue-500/20 text-blue-900 dark:text-blue-200"
              label={t('hidden-character-finder.legendInvisible')}
            />
            <LegendChip
              className="bg-amber-500/30 text-amber-900 dark:text-amber-100"
              label={t('hidden-character-finder.legendHomoglyph')}
            />
            <LegendChip
              className="bg-rose-500/25 text-rose-900 dark:text-rose-100"
              label={t('hidden-character-finder.legendMixed')}
            />
          </div>

          <HighlightedText text={text} results={results} />
          <ResultsTable results={results} />
        </>
      )}
    </div>
  )
}

function LegendChip({className, label}: {className: string; label: string}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 font-medium ${className}`}
    >
      {label}
    </span>
  )
}

function HighlightedText({
  text,
  results,
}: {
  text: string
  results: HiddenChar[]
}) {
  const t = useTranslations('config')
  const nodes: ReactNode[] = []
  let cursor = 0

  for (const r of results) {
    if (r.index < cursor) continue
    if (r.index > cursor) nodes.push(text.slice(cursor, r.index))
    const title = r.lookalike
      ? `${r.hex} · ${r.lookalike}`
      : `${r.hex} · ${r.name}`
    nodes.push(
      <span key={`h-${r.index}`} className={ISSUE_CLASS[r.issue]} title={title}>
        {r.char}
      </span>,
    )
    cursor = r.index + r.char.length
  }
  if (cursor < text.length) nodes.push(text.slice(cursor))

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
        {t('hidden-character-finder.resultsTitle')}
      </div>
      <div className="max-h-[360px] overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-sm leading-relaxed">
        {nodes}
      </div>
    </div>
  )
}

function ResultsTable({results}: {results: HiddenChar[]}) {
  const t = useTranslations('config')
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">
                {t('hidden-character-finder.tablePosition')}
              </th>
              <th className="px-3 py-2 text-left font-medium">
                {t('hidden-character-finder.tableChar')}
              </th>
              <th className="px-3 py-2 text-left font-medium">
                {t('hidden-character-finder.tableCode')}
              </th>
              <th className="px-3 py-2 text-left font-medium">
                {t('hidden-character-finder.tableName')}
              </th>
              <th className="px-3 py-2 text-left font-medium">
                {t('hidden-character-finder.tableScript')}
              </th>
              <th className="px-3 py-2 text-left font-medium">
                {t('hidden-character-finder.tableIssue')}
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map(r => (
              <tr key={r.index} className="border-b last:border-b-0">
                <td className="px-3 py-2 font-mono text-xs">{r.index}</td>
                <td className="px-3 py-2">
                  <span className={`font-mono ${ISSUE_CLASS[r.issue]}`}>
                    {r.char}
                  </span>
                </td>
                <td className="px-3 py-2 font-mono text-xs">{r.hex}</td>
                <td className="px-3 py-2 text-xs">{r.name}</td>
                <td className="px-3 py-2 text-xs">{r.script}</td>
                <td className="px-3 py-2 text-xs">
                  {r.issue === 'invisible'
                    ? t('hidden-character-finder.issueInvisible')
                    : r.issue === 'homoglyph'
                      ? t('hidden-character-finder.issueHomoglyph')
                      : t('hidden-character-finder.issueMixed')}
                  {r.lookalike ? ` → ${r.lookalike}` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
