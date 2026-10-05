const META_DESCRIPTION_MAX = 155

/**
 * Resolves the meta description for a page.
 * Uses `metaDescription` if set, otherwise falls back to `description`
 * truncated to ~155 chars on a word boundary.
 */
export function resolveMetaDescription(
  t: (key: string) => string,
  config: {description: string; metaDescription?: string},
): string {
  if (config.metaDescription) return t(config.metaDescription)
  return truncate(t(config.description), META_DESCRIPTION_MAX)
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}
