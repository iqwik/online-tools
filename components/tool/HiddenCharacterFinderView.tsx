'use client'

import {FileDownIcon} from '@animateicons/react/lucide/file-down-icon'
import {useTranslations} from 'next-intl'
import type {ReactNode} from 'react'
import {useMemo, useState} from 'react'
import {Button} from '@/components/ui/button'
import {Label} from '@/components/ui/label'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {InputPanel} from '../shared/InputPanel'

type ScriptKey = 'cyrillic' | 'latin' | 'greek' | 'invisible'

interface Match {
  index: number
  length: number
  char: string
  script: ScriptKey
}

const SCRIPT_KEYS: ScriptKey[] = ['cyrillic', 'latin', 'greek', 'invisible']

const INVISIBLE_CODES = new Set<number>([
  0x200b, 0x200c, 0x200d, 0x200e, 0x200f, 0x202a, 0x202b, 0x202c, 0x202d,
  0x202e, 0x2060, 0x2061, 0x2062, 0x2063, 0x2064, 0xfeff, 0x00ad, 0x180e,
  0x034f,
])

function isInvisible(code: number): boolean {
  if (INVISIBLE_CODES.has(code)) return true
  if (code < 0x20 && code !== 0x09 && code !== 0x0a && code !== 0x0d)
    return true
  if (code === 0x7f) return true
  return false
}

function getScriptKey(char: string): ScriptKey | 'common' {
  if (/\p{Script=Cyrillic}/u.test(char)) return 'cyrillic'
  if (/\p{Script=Latin}/u.test(char)) return 'latin'
  if (/\p{Script=Greek}/u.test(char)) return 'greek'
  return 'common'
}

function analyze(text: string, target: ScriptKey): Match[] {
  const matches: Match[] = []
  let index = 0
  for (const char of text) {
    const code = char.codePointAt(0)!
    if (target === 'invisible') {
      if (isInvisible(code)) {
        matches.push({index, length: char.length, char, script: 'invisible'})
      }
    } else {
      if (getScriptKey(char) === target) {
        matches.push({index, length: char.length, char, script: target})
      }
    }
    index += char.length
  }
  return matches
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildWordHtml(text: string, matches: Match[], color: string): string {
  let html = ''
  let cursor = 0
  for (const m of matches) {
    if (m.index < cursor) continue
    if (m.index > cursor) html += escapeHtml(text.slice(cursor, m.index))
    html += `<span style="background-color:${color}">${escapeHtml(m.char)}</span>`
    cursor = m.index + m.length
  }
  if (cursor < text.length) html += escapeHtml(text.slice(cursor))

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>Hidden Character Finder</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
</w:WordDocument>
</xml>
<![endif]-->
<style>
@page { size: A4; margin: 2cm; }
body { font-family: 'Consolas', 'Courier New', monospace; font-size: 11pt; line-height: 1.5; }
span { padding: 0 1px; }
</style>
</head>
<body>
<pre style="white-space:pre-wrap;word-wrap:break-word;font-family:inherit;margin:0;">${html}</pre>
</body>
</html>`
}

export function HiddenCharacterFinderView() {
  const t = useTranslations('config')
  const [text, setText] = useState('')
  const [target, setTarget] = useState<ScriptKey>('latin')
  const [highlightColor, setHighlightColor] = useState('#FEF08A')

  const matches = useMemo(() => analyze(text, target), [text, target])

  function handleExportWord() {
    const html = buildWordHtml(text, matches, highlightColor)
    const blob = new Blob([html], {type: 'application/msword'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hidden-character-finder.doc'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">
            {t('hidden-character-finder.searchFor')}
          </span>
          <RadioGroup
            value={target}
            onValueChange={v => setTarget(v as ScriptKey)}
            className="flex flex-wrap gap-x-6 gap-y-2"
          >
            {SCRIPT_KEYS.map(key => (
              <div key={key} className="flex items-center gap-2">
                <RadioGroupItem value={key} id={`script-${key}`} />
                <Label
                  htmlFor={`script-${key}`}
                  className="cursor-pointer text-sm font-normal"
                >
                  {t(`hidden-character-finder.script.${key}`)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">
            {t('hidden-character-finder.highlightColor')}
          </span>
          <input
            type="color"
            value={highlightColor}
            onChange={e => setHighlightColor(e.target.value)}
            className="h-8 w-12 cursor-pointer rounded border bg-transparent"
            aria-label={t('hidden-character-finder.highlightColor')}
          />
        </div>
      </div>

      <InputPanel
        title={t('hidden-character-finder.inputLabel')}
        value={text}
        onChange={setText}
        placeholder={t('hidden-character-finder.inputPlaceholder')}
        heightClass="h-[240px]"
      />

      {text && (
        <>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full border bg-muted/50 px-3 py-1 font-medium">
              {t('hidden-character-finder.matchesCount', {
                count: matches.length,
              })}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportWord}
              disabled={matches.length === 0}
            >
              <FileDownIcon size={14} className="mr-1.5" />
              {t('hidden-character-finder.exportWord')}
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="border-b bg-muted/50 px-3 py-2 text-xs font-medium text-muted-foreground">
              {t('hidden-character-finder.resultTitle')}
            </div>
            <div className="max-h-[360px] overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-sm leading-relaxed">
              <HighlightedText
                text={text}
                matches={matches}
                color={highlightColor}
              />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function HighlightedText({
  text,
  matches,
  color,
}: {
  text: string
  matches: Match[]
  color: string
}) {
  const nodes: ReactNode[] = []
  let cursor = 0
  for (const m of matches) {
    if (m.index < cursor) continue
    if (m.index > cursor) nodes.push(text.slice(cursor, m.index))
    nodes.push(
      <mark
        key={`m-${m.index}`}
        style={{backgroundColor: color, color: 'inherit'}}
        className="rounded px-0.5"
      >
        {m.char}
      </mark>,
    )
    cursor = m.index + m.length
  }
  if (cursor < text.length) nodes.push(text.slice(cursor))
  return <>{nodes}</>
}
