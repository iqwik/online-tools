/**
 * Deterministic Fisher-Yates shuffle.
 * Same input + same seed = same output. Used to fix a stable order of
 * tools on the home page and on /tools without re-shuffling on every
 * render (which would look random and hurt the "position memory" UX).
 */
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = seed
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
