// helpers/hidden-chars.ts

export type HiddenCharIssue = 'invisible' | 'homoglyph' | 'mixed'

export interface HiddenChar {
  index: number
  char: string
  code: number
  hex: string
  name: string
  script: string
  issue: HiddenCharIssue
  lookalike?: string
}

const INVISIBLE = new Map<number, string>([
  [0x200b, 'Zero Width Space'],
  [0x200c, 'Zero Width Non-Joiner'],
  [0x200d, 'Zero Width Joiner'],
  [0x200e, 'Left-to-Right Mark'],
  [0x200f, 'Right-to-Left Mark'],
  [0x202a, 'Left-to-Right Embedding'],
  [0x202b, 'Right-to-Left Embedding'],
  [0x202c, 'Pop Directional Formatting'],
  [0x202d, 'Left-to-Right Override'],
  [0x202e, 'Right-to-Left Override'],
  [0x2060, 'Word Joiner'],
  [0x2061, 'Function Application'],
  [0x2062, 'Invisible Times'],
  [0x2063, 'Invisible Separator'],
  [0x2064, 'Invisible Plus'],
  [0xfeff, 'Byte Order Mark'],
  [0x00ad, 'Soft Hyphen'],
  [0x180e, 'Mongolian Vowel Separator'],
  [0x034f, 'Combining Grapheme Joiner'],
  [0x115f, 'Hangul Choseong Filler'],
  [0x1160, 'Hangul Jungseong Filler'],
])

const HOMOGLYPHS = new Map<string, string>([
  ['а', 'a'],
  ['е', 'e'],
  ['о', 'o'],
  ['р', 'p'],
  ['с', 'c'],
  ['у', 'y'],
  ['х', 'x'],
  ['і', 'i'],
  ['ј', 'j'],
  ['ѕ', 's'],
  ['ԁ', 'd'],
  ['ɡ', 'g'],
  ['һ', 'h'],
  ['ӏ', 'l'],
  ['м', 'm'],
  ['н', 'h'],
  ['к', 'k'],
  ['в', 'b'],
  ['т', 't'],
  ['А', 'A'],
  ['В', 'B'],
  ['Е', 'E'],
  ['К', 'K'],
  ['М', 'M'],
  ['Н', 'H'],
  ['О', 'O'],
  ['Р', 'P'],
  ['С', 'C'],
  ['Т', 'T'],
  ['У', 'Y'],
  ['Х', 'X'],
  ['І', 'I'],
  ['Ј', 'J'],
  ['Ѕ', 'S'],
  ['ο', 'o'],
  ['ρ', 'p'],
  ['ν', 'v'],
  ['α', 'a'],
  ['ε', 'e'],
  ['ι', 'i'],
  ['κ', 'k'],
  ['τ', 't'],
  ['υ', 'u'],
  ['χ', 'x'],
  ['Α', 'A'],
  ['Β', 'B'],
  ['Ε', 'E'],
  ['Ζ', 'Z'],
  ['Η', 'H'],
  ['Ι', 'I'],
  ['Κ', 'K'],
  ['Μ', 'M'],
  ['Ν', 'N'],
  ['Ο', 'O'],
  ['Ρ', 'P'],
  ['Τ', 'T'],
  ['Υ', 'Y'],
  ['Χ', 'X'],
])

function getScript(char: string): string {
  if (/\p{Script=Cyrillic}/u.test(char)) return 'Cyrillic'
  if (/\p{Script=Latin}/u.test(char)) return 'Latin'
  if (/\p{Script=Greek}/u.test(char)) return 'Greek'
  if (/\p{Script=Arabic}/u.test(char)) return 'Arabic'
  if (/\p{Script=Hebrew}/u.test(char)) return 'Hebrew'
  if (/\p{Script=Han}/u.test(char)) return 'Han'
  if (/\p{Script=Hiragana}/u.test(char)) return 'Hiragana'
  if (/\p{Script=Katakana}/u.test(char)) return 'Katakana'
  return 'Common'
}

function toHex(code: number): string {
  return `U+${code.toString(16).toUpperCase().padStart(4, '0')}`
}

export function analyzeText(text: string): HiddenChar[] {
  const results: HiddenChar[] = []
  const reported = new Set<number>()
  let index = 0

  for (const char of text) {
    const code = char.codePointAt(0)!
    const hex = toHex(code)

    const invisibleName = INVISIBLE.get(code)
    if (invisibleName) {
      results.push({
        index,
        char,
        code,
        hex,
        name: invisibleName,
        script: 'Common',
        issue: 'invisible',
      })
      reported.add(index)
      index += char.length
      continue
    }

    if (code < 0x20 && code !== 0x09 && code !== 0x0a && code !== 0x0d) {
      results.push({
        index,
        char,
        code,
        hex,
        name: 'Control Character',
        script: 'Common',
        issue: 'invisible',
      })
      reported.add(index)
      index += char.length
      continue
    }

    if (code === 0x7f) {
      results.push({
        index,
        char,
        code,
        hex,
        name: 'Delete',
        script: 'Common',
        issue: 'invisible',
      })
      reported.add(index)
      index += char.length
      continue
    }

    const lookalike = HOMOGLYPHS.get(char)
    if (lookalike) {
      results.push({
        index,
        char,
        code,
        hex,
        name: hex,
        script: getScript(char),
        issue: 'homoglyph',
        lookalike,
      })
      reported.add(index)
      index += char.length
      continue
    }

    index += char.length
  }

  const wordRegex = /[\p{L}\p{M}]+/gu
  let match: RegExpExecArray | null = wordRegex.exec(text)
  while (match !== null) {
    const word = match[0]
    const scripts = new Set<string>()
    for (const c of word) {
      const s = getScript(c)
      if (s !== 'Common') scripts.add(s)
    }
    if (scripts.size > 1) {
      let localIndex = match.index
      for (const c of word) {
        if (!reported.has(localIndex)) {
          const code = c.codePointAt(0)!
          results.push({
            index: localIndex,
            char: c,
            code,
            hex: toHex(code),
            name: toHex(code),
            script: getScript(c),
            issue: 'mixed',
          })
          reported.add(localIndex)
        }
        localIndex += c.length
      }
    }
    match = wordRegex.exec(text)
  }

  return results.sort((a, b) => a.index - b.index)
}

export function cleanText(text: string): string {
  let result = ''
  for (const char of text) {
    const code = char.codePointAt(0)!
    if (INVISIBLE.has(code)) continue
    if (code < 0x20 && code !== 0x09 && code !== 0x0a && code !== 0x0d) continue
    if (code === 0x7f) continue
    result += char
  }
  return result
}
