# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### TODO

- **`pdf-to-image`** — translations ready in `messages/{en,ru}.json` (`config.pdf-to-image` + `searchSynonyms`), but no `data/tools/developer.ts` entry and no View. `pdfjs-dist@6.3.289` installed. Plan: `kind: 'pdf-to-image'`, category `developer`, `isWide: true`, worker via `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)`, page range parser (`1-5, 8, 11-13`), format PNG / JPEG / WebP, scale 1× / 1.5× / 2× / 3×, quality (JPEG / WebP), transparent background (PNG only), grid preview + ZIP download, `useSmoothProgress`. Destroy via `loadingTask.destroy()` (not `pdfDoc.destroy()`), `page.render({canvas, canvasContext, viewport})`. When implemented, re-add `pdf-to-image` to `related` in `images-to-pdf` (removed in 0.13.0 to avoid broken links).
- **Regression check for remaining tools** — Stage 4 of Variant C. Systematic verification: open every View, compare against final texts. Known audit issues are all fixed, but a full pass hasn't been done.
- **Rich Results Test** — after deploy: run all JSON-LD (WebApplication, FAQPage, HowTo) through Google Rich Results Test. Verify HowTo `step` has `name` + `text` in every step. Home page emits WebSite + Organization + ItemList + FAQPage — validate all four. Related tools are now 4 per page × 75 pages — check nothing broke in sitemap/schema.
- **Final EN + RU proofread** — read through all 75 tools × 2 locales one more time in the browser.
- **Category `metaDescription` review** — if Google starts truncating on desktop SERP or coverage drops, extend to 150–155 characters.
- **Category FAQ expansion** — if organic performance suggests, add a 6th question to `categories.<slug>.faq`.
- **Wave 6 — interactive trackers & builders**: `pomodoro-timer`, `habit-tracker`, `decision-maker`, `meeting-cost-calculator`, `trip-planner`, `bill-splitter`, `lead-tracker`, `resume-builder`, `visiting-card-generator`, `api-response-mock-generator`
- **Locale refactor in `data/**`:** all hardcoded `'en-US'` / `'en-IN'` (and any hardcoded locale in `toLocaleString` / `toLocaleDateString` / `Intl.*`) — replace with `ctx.locale` passed from `calculate`. Run `grep -rn "toLocaleString('en\|toLocaleDateString('en\|Intl\." data/`. Affects `finance.ts` (`formatInt`, `formatAmount`, `formatINR`), `age-calculator`, `date-difference-calculator`, `pregnancy-due-date-calculator`. After refactor — delete global `formatInt` / `formatAmount`, keep only local `fmt` inside each `calculate`.
- `SalarySlipGeneratorView`: replace `payPeriod` text input with two `<Select>` (Month + Year), localize, add `payMonth` / `payYear` to state
- Extract `CurrencySelect` — `CURRENCIES` / `CURRENCY_SYMBOLS` duplicated across 3 files (invoice, quotation, payslip)
- `ToolSchema` / `CalculatorSchema`: parametrize hardcoded `publisher.name: 'ProjectName'`
- `types/common.ts`: extract `FAQItem` (duplicated). Also consider merging `FeatureItem` and `HowToStep` — both are `{title, description}`
- Audit `placeholder` / `defaultValue` for hardcoded English
- Remove `display: contents` wrapper after `@base-ui/react` update (PR #4350)
- `CURRENT_YEAR` — wrap in `useMemo` inside the component
- `CalculatorForm`: switch `<input type="date">` to `DatePicker` for `age-calculator`
- Active category link in sidebar — slug → category (currently `===`)
- Sidebar state resets on locale switch
- Mobile sidebar (Sheet) not tested
- `meta-tag-generator`: preview titles (`"Google search preview"`, etc.) hardcoded in EN
- OG image (`og-default.jpg`), AdSense, GA
- `images-to-pdf`: PDF filename comes from `<title>`; consider setting `document.title = 'images-YYYY-MM-DD.pdf'` inside the print iframe before printing
- `images-to-pdf`: image quality slider does not affect print output (browser prints originals). If needed — recompress via Canvas before printing
- Chrome page header / footer (date, URL, page numbers) can only be disabled by the user in the print dialog — cannot be removed programmatically
- Decide on `useCases` format: keep as `string[]` (via `ContentSection`) or migrate to `{title, description}[]` (via a new `UseCaseSection`)
- **`image-compressor` target file size mode** — binary search on quality to hit a target KB. Removed from texts, implementation in tech debt (3–4 hours).
- Bonus tool: `text-to-svg-generator` (84th) — regex + shape / color / icon dictionary, offline, no dependencies. Discuss after Wave 6
- **Custom unit plural in labels** — `global.units.{months, years, days, weeks, hours, nights}` are simple strings (не ICU plural), используются как метки полей. Если понадобится согласование с числом — надо перейти на `t(unit, {count: value})` во всех `SliderField`/`CalculatorForm` и передавать значение. Отложено.

## [0.13.0] - 2026-10-06

### Related links across all 75 tools, Yandex-specific SEO, global unit translations, SliderField refactor

#### Added

**Related tools — SEO interlinking**

- **`related: Slug[]` (4 items each) added to all 75 tools** across every category. Every tool page now renders 4 cross-linked preview cards via `RelatedTools`, giving ~300 new internal links. This is the biggest single SEO improvement since the site structure was finalized.
- Categories: `finance` (15 tools), `health` (15), `business` (7), `developer` (24), `generators` (9), `text` (5).
- Link graph organized by semantic clusters:
  - **finance:** credits (loan-payment ↔ loan-eligibility ↔ rent-vs-buy), investments (compound-interest ↔ monthly-investment ↔ savings-goal ↔ fixed-deposit ↔ roi), purchases (percentage ↔ discount ↔ tip ↔ sales-tax), income (salary ↔ income-tax), utility (date-difference).
  - **health:** weight (bmi ↔ body-fat ↔ ideal-weight), nutrition (calorie ↔ tdee-macro ↔ calorie-deficit-planner), fitness (heart-rate ↔ vo2-max ↔ water-intake), sleep (sleep-cycle ↔ sleep-debt), pregnancy (pregnancy-due-date ↔ pregnancy-week-tracker ↔ menstrual-cycle).
  - **business:** documents (invoice-generator ↔ quotation-generator ↔ payslip-generator + invoice-number-generator), financial math (profit-margin ↔ break-even), marketing (utm-builder).
  - **developer:** encoding (base64 ↔ url ↔ jwt-decoder ↔ jwt-encoder), generators (uuid ↔ hash ↔ license ↔ gitignore), formatters (json ↔ sql ↔ code-minifier ↔ markdown), color (color-picker ↔ color-contrast ↔ css-generator), regex (regex-tester ↔ regex-generator), images/base64 (svg-to-base64 ↔ base64-to-image ↔ base64-image-optimizer ↔ favicon).
  - **generators:** images cluster (image-compressor ↔ bulk-image-resizer ↔ image-converter ↔ image-watermark ↔ images-to-pdf) + security (password ↔ qr-code), palette (color-palette-extractor).
  - **text:** small category, fully connected (5 tools × 4 related each).

**Yandex-specific SEO**

- **`robots.ts` — `Clean-param` directive** for Yandex. Added a separate `Yandex` user-agent block with `other: {'Clean-param': '...'}`. Yandex-specific tracking parameters scrubbed from index: `utm_source&utm_medium&utm_campaign&utm_term&utm_content&yclid&gclid&fbclid&_openstat&ysclid&yrclid`. Without this, every ad-click URL becomes a duplicate in the Yandex index.
- **`robots.ts` — removed `host: baseUrl`** — the `Host` directive was cancelled by Yandex in 2018 and never supported by Google. Canonical domain is now signaled via 301 redirects and `<link rel="canonical">`.

**Global unit translations**

- **`global.units.*` namespace** in `messages/{en,ru}.json`:
  - Physical: `km`, `m`, `cm`, `mm`, `kg`, `g`, `bpm`.
  - Temporal: `months`, `years`, `days`, `weeks`, `hours`, `minutes`, `nights`.
- **`CalculatorForm`** now resolves `input.unit` in three steps: `tConfig.has(input.unit)` → `tGlobal.has(input.unit)` → fallback to the raw string. Let `unit: 'units.cm'` resolve to `global.units.cm` without duplicating in each tool's namespace.
- **All `data/calculators/*.ts` inputs migrated** from `<slug>.units.*` to `units.*`:
  - `calorie-calculator`, `tdee-macro-calculator`, `heart-rate-zones-calculator`, `vo2-max-estimator` — `unit: 'units.years'` / `unit: 'units.bpm'` / `unit: 'units.minutes'`.
  - `water-intake-calculator` — `unit: 'units.minutes'`.
  - `sleep-debt-calculator`, `menstrual-cycle-calculator` — `unit: 'units.hours'` / `unit: 'units.days'`.
  - `calorie-deficit-planner` — `unit: 'units.weeks'`.
  - `bmi-calculator`, `body-fat-calculator`, `ideal-weight-calculator`, `calorie-deficit-planner` — already used `units.cm` / `units.kg`.
- **`heart-rate-zones-calculator`** — units `years` and `bpm` no longer render as raw translation keys (`heart-rate-zones-calculator.units.years` visible in UI before fix).

**Parametrized tool count**

- **`helpers/tool-count.ts`** — `getToolCount()` returns `getAllRegistryEntries().length`. Re-exported via `helpers/index.ts`.
- **`meta.tools.description`, `tools.description`** — replaced hardcoded `"75"` literal with `{count}` ICU placeholder.
- **`home.featured.viewAll`** — replaced hardcoded `"75"` with ICU plural:
  - EN: `"Browse all {count, plural, one {# tool} other {# tools}}"`
  - RU: `"Все {count, plural, one {# инструмент} few {# инструмента} many {# инструментов} other {# инструмента}}"`
- When `pdf-to-image` lands, all three strings update automatically. No message edits needed.

**SliderField refactor**

- **Local `min` / `max` state** — initialized from `input.min` / `input.max`, editable at runtime (previously the min/max were rendered as non-functional labels). Clamps `value` when it falls outside the new range.
- **Auto-width inputs** — `style={{width: chWidth(text)}}` via `calc(Nch + 1.25rem)`. Inputs expand and shrink with the value.
- **Pencil icon buttons** — inline-edit affordance. `focusEnd(el)` sets cursor to end via `setSelectionRange`. Icons from `@animateicons/react/lucide/pencil-icon`, `isAnimated={false}`, wrapped in `size="icon-sm"` `Button variant="ghost"`.
- **Integer parsing** — `parse(s)` strips locale separators (`1 000`, `1,000`) via `s.replace(/[^\d-]/g, '')`. Works for both `en` and `ru` without `Intl.formatToParts`. Minus preserved.
- **Cursor preservation** — `countMeaningful` / `posAfterMeaningful` / `restoreCursor` helpers track cursor position by meaningful character (digit or minus) count. Fixes the bug where typing between digits (`1|0` → `11|0`) caused a jump-to-end because React rewrote the formatted string. `useLayoutEffect` restores cursor after every commit.
- **Empty input → 0** — clearing the field calls `onChange(clamp(0))`, not a stale value.
- **`min` / `max` clamps on blur, not on change** — typing `110` when `max=100` keeps `110` visible until blur, then clamps to `100`. Prevents cursor jumps and lets the user erase a typo mid-typing.
- **Focus ring fix** — `focus-visible:ring-0` instead of `focus-visible:ring-transparent`. Ring-transparent kept the ring-width from base `Input` styles (Chrome rendered a thin outline), `ring-0` removes it entirely.
- **Text sizes fixed** — `text-xs md:text-xs` for min/max (base `Input` has `md:text-sm` which overrode `text-xs` at ≥768px).

**Sales-tax-calculator rate input**

- **`rate` field** changed from `select` (5/10/15/20/25 %) to `type: 'number'`, `min: 0`, `max: 100`, `step: 0.01`, `defaultValue: 20`. Users can now enter `33.3`, `7.25`, any decimal.
- **`calculate` guards against `NaN`** — `Number(String(rate).replace(',', '.'))` for RU-locale comma input.
- **`secondary.rate`** — `parseFloat(r.toFixed(4))` strips trailing zeros (`33.30` → `33.3`, `20.00` → `20`).

**InvoiceGeneratorView refactor**

- **Locale-aware currency formatting** — `useLocale()` + `useMemo(() => new Intl.NumberFormat(locale, {style: 'currency', currency: data.currency, minimumFractionDigits: 2, maximumFractionDigits: 2}), [locale, data.currency])`. Passed down to `InvoicePreview` as `fmt` prop. Removed hardcoded `'en-US'`.
- **Font size scaling in preview** — all `text-*` classes in `InvoicePreview` replaced with `text-[Nem]` (e.g. `text-[0.9em]`, `text-[1.35em]`, `text-[2.3em]`). Container `fontSize` from `FONT_SIZES[data.fontSize]` now actually scales every text element in the preview. Previously the Font Size select did nothing — children had their own absolute `text-xs` / `text-sm` / `text-lg`.

#### Changed

**`app/sitemap.ts`**

- **Removed `changefreq`** — Google ignores it, Yandex does not use it for crawl budget. Kept `priority` for Yandex (small signal for crawl ordering). `lastmod` stays honest: `CONTENT_LASTMOD` for static / category pages, `cfg.publishedAt` for tools.

**Search refactoring** (from previous session, included in this release)

- **`SearchProvider`** — context API `{isOpen, open(query?), close}`. Query lives in provider, survives close/reopen. `⌘K` calls `setIsOpen(true)` directly.
- **`SearchModal`** — controlled by `query` prop, no local state.
- **`SearchTrigger`** — `open()` without arguments preserves the current query.
- **`Hero.tsx`** — 6 suggestion chips call `open(tHome('suggestions.${key}'))`, seeding the modal input. Chips: `bmi`, `password`, `json`, `tip`, `word`, `compress`.

**Home restructure** (from previous session, included in this release)

- **`/tools` route** — full `ToolGrid` moved here from home. Home keeps `FeaturedTools` (18 seeded-random + CTA).
- **`HomeSchema`** — JSON-LD WebSite + Organization + ItemList (6 categories) + FAQPage (3 Q).
- **`generateMetadata` on home** — localized title/description from `meta.home`, canonical, hreflang, OG.
- **`CategoryCards`**, **`RecentlyAdded`**, **`HomeFaq`**, **`PrivacyNote`** (renamed from `Footer`).
- **Sidebar** — "All tools" entry with `LayoutGridIcon` + `totalTools` counter.
- **`Stats`** — "75+ tools" is now `<Link href="/tools">`.

#### Fixed

- **`lorem-ipsum` broken slug in `related`** — `word-counter` and `case-converter` referenced `'lorem-ipsum'`, but the tool's actual slug is `'lorem-ipsum-generator'`. Both references fixed. Would have rendered as broken cards.
- **`pdf-to-image` orphaned reference** — `images-to-pdf.related` pointed to `pdf-to-image`, which has no entry in `data/tools/developer.ts` (orphaned translations). Removed. Re-add when the View is implemented.
- **`invoice-generator` currency format in RU** — was `$1,234.56` even with `locale=ru`. Now `1 234,56 $` / `1 234,56 ₽` / `$1,234.56` depending on locale and currency.
- **`SliderField` cursor jump on delete** — pressing Delete between digits reset cursor to the end. Fixed via meaningful-char position tracking.
- **`SliderField` value clamped on every keystroke** — typing `110` when `max=100` immediately reverted to `100`, making it impossible to clear-then-retype. Now clamps on blur only.
- **`SliderField` min/max labels were not editable** — now `Input` fields with local state, clamp logic, and pencil icon affordance.
- **`sales-tax-calculator.rate`** — user could not enter `33.3`, only preset values. Now `type: 'number'`.
- **`heart-rate-zones-calculator` units** — labels rendered as raw keys (`heart-rate-zones-calculator.units.years`). Fixed via `global.units`.
- **`InvoiceGeneratorView` Font Size select** — did nothing because every child had its own absolute `text-*`. Now scales via `em`.
- **`robots.ts` — Host deprecated** — removed.

#### Removed

- **`config.<slug>.units.years` / `.bpm` / `.minutes` / `.hours` / `.days` / `.weeks`** across health calculators — replaced by `global.units.*`. Clean up the messages if not already deleted.
- **`sales-tax-calculator.options.r5` / `r10` / `r15` / `r20` / `r25`** — no longer used (rate is a number input now).
- **`robots.ts` `host` field** — deprecated by Yandex in 2018.
- **`sitemap.ts` `changefreq` field** — ignored by Google, unused by Yandex.

#### Known limitations

- **`related` uses `string[]`** — no compile-time check that slugs exist. A typo like the old `lorem-ipsum` renders as a missing card, not a TS error. Consider a `Slug[]` union type or `satisfies` assertion in a follow-up.
- **`global.units.*` plural** — currently plain strings (`"years": "лет"`), not ICU plural. Field labels like `Возраст (лет)` are grammatically neutral for any age. If per-value agreement is needed, migrate to `t(unit, {count: value})` and add plural forms.
- **`getToolCount()` is sync** — fine at 75, fine at 500. If the registry grows beyond ~1000 entries with heavy per-entry initialization, consider a cached constant or build-time inlining.
- **`pdf-to-image` cross-link gap** — `images-to-pdf` no longer links to it. Once the View lands, restore the link and re-verify the `generators` cluster is complete.

## [0.12.0] - 2026-10-05

### Home restructure (Phases A / B / C), search refactoring, sidebar "All tools"

#### Added

**Home page — new composition**

- **`components/home/HomeSchema.tsx`** — server component, emits three JSON-LD blocks: `WebSite` (with `publisher: Organization`), `ItemList` (6 categories with positions), `FAQPage` (3 questions from `home.faq.*`). `SearchAction` intentionally omitted — search is client-side only, no `?q=` URL.
- **`components/home/CategoryCards.tsx`** — six category cards below the hero. Each card links to `/{slug}`, renders icon + name + tool count (`category.toolsCount` plural ICU). Icons pulled from `data/categories.ts` via `CATEGORY_COLORS[slug]`.
- **`components/home/FeaturedTools.tsx`** — client component, 18 deterministic-random tools from `seededShuffle(all, 42)` + `slice(0, 18)`. Header row with `h2` + "Browse all {count} tools →" link.
- **`components/home/RecentlyAdded.tsx`** — server component, top 6 by `publishedAt` descending, `null` when empty.
- **`components/home/HomeFaq.tsx`** — server component, 3 questions rendered via `FAQ` with `namespace="home"`.
- **`components/home/PrivacyNote.tsx`** — renamed from `components/home/Footer.tsx`.

**`/tools` route**

- **`app/[locale]/tools/page.tsx`** — new route. `generateMetadata` from `meta.tools`, canonical / hreflang / OG. Full `ToolGrid` moved from home.

**Helpers**

- **`helpers/array.ts`** — `seededShuffle<T>(arr, seed): T[]`. Deterministic Fisher-Yates.

**Messages — new keys (EN + RU)**

- `meta.home.{title,description}`, `meta.tools.{title,description}`
- `tools.{h1,description}`
- `home.featured.{h2,viewAll}`, `home.recent.h2`, `home.faqTitle`, `home.faq.{q1..q3, a1..a3}`
- `home.suggestions.{label, bmi, password, json, tip, word, compress}`

**Sidebar**

- **"All tools" entry** above the category list. Icon `LayoutGridIcon`, count badge from `categories.reduce(...)`.

#### Changed

- **`app/[locale]/page.tsx`** — added `generateMetadata`. New component order: `HomeSchema → Hero → CategoryCards → FeaturedTools → RecentlyAdded → HomeFaq → PrivacyNote`.
- **`app/sitemap.ts`** — replaced `const now = new Date()` with `const CONTENT_LASTMOD = new Date('2026-10-05')`. Added `/tools` with priority 0.9.
- **`components/home/ToolGrid.tsx`** — now used only on `/tools`. `seededShuffle` imported from `@/helpers`.
- **`components/home/Stats.tsx`** — "75+ tools" is now a `<Link href="/tools">`.
- **`components/home/Hero.tsx`** — added suggestion chips row under search.

**Search refactoring**

- **`SearchProvider.tsx`** — context API `{isOpen, open(query?), close}`. Query lives in provider.
- **`SearchModal.tsx`** — `query` is a controlled prop.
- **`SearchTrigger.tsx`** — `open()` without arguments.

#### Fixed

- **`utm-builder` garbage keys in `messages/ru.json`** — removed stray `"useCase": []` and duplicate `"useCases"`.
- **`CategoryCards.tsx` icon import** — barrel → subpath.
- **`SearchModal.tsx` icon import** — `lucide-react` → `@animateicons/react/lucide/search-icon`.

#### Removed

- **`components/home/Footer.tsx`** — renamed to `PrivacyNote.tsx`.

## [0.11.0] - 2026-10-05

### Universal SEO content rewrite (Variant C, Stages 1–3) + `metaDescription` split

#### Added

- **`metaDescription` field in `BaseConfig`** (`types/common.ts`) — **mandatory**.
- **`generateMetadata` in `app/[locale]/[slug]/page.tsx`** — `description: t(entry.config.metaDescription)`.
- **`CalculatorSchema.tsx` / `ToolSchema.tsx`** — `webApp.description: t(config.metaDescription)`.

#### Changed

**All 75 tools × 2 locales** — full SEO rewrite: `title` (unified em dash `—`, ≤60 chars), `description` (page version, ≤200), `metaDescription` (meta tag + JSON-LD, ≤155), `features` (each description adds a new fact), `howToUse` (min 4 steps), `useCases` (live scenarios), `faq` (6 Q for most), `searchSynonyms` (rewritten).

**«Free»/«Бесплатный» policy** — removed from first phrase for ~60% of tools. Kept in 10 where paid competitors exist.

#### Fixed

- **`word-counter` texts vs View** — removed «pages», replaced with «average word length». Added TikTok to social limits.
- **`BreadCrumbs.tsx` — React key warning** — `Fragment key`.
- **`ThemeToggle.tsx` — hydration mismatch (next-themes + React 19)** — `mounted` pattern.
- **`globals.css` — scrollbar fixes**:
  - `scrollbar-width: thin` wrapped in `@supports (-moz-appearance: none)`.
  - `element > ::-webkit-scrollbar-thumb` → `element::-webkit-scrollbar-thumb`.
  - Removed transition on `::-webkit-scrollbar-thumb`.
  - Removed `no-scrollbar` class from `SidebarContent`.

#### Changed (infrastructure)

- **`.vscode/settings.json`** — `typescript.tsserver.maxTsServerMemory: 6144`, `files.watcherExclude`, `editor.minimap.enabled: false`, etc.

#### Known limitations

- **`pdf-to-image` orphaned translations** — no data entry, no View.
- **Regression check not exhaustive** — `word-counter` spot-checked.

## [0.10.0] - 2026-10-04

### Categories: unified translation block, SEO content, and static routes

#### Added

- **Unified root-level `categories` block** in `messages/en.json` and `messages/ru.json` with full SEO fields for all six categories.
- **`categories.all`** — for the "All Tools" filter.
- **Six static category routes**.
- **`namespace` prop** (default `'config'`) in `HowToUseSection`, `FeatureSection`, `ContentSection`, `FAQ`.
- **OG locale mapping** via `getOgLocale(locale)`.

#### Changed

- **`ToolGrid.tsx`**: filter list built from `categories`.
- **`CategoryPage.tsx`**: `h1` from `categories.{slug}.name`.
- **`FAQ.tsx`**: `AccordionItem` keys now `item-${i}`.

#### Removed

- **`home.categories`**, **`home.filters`**, **`category.title.*`**, **`app/[locale]/[category]/`**.

#### Fixed

- **404 on `/ru/health`, `/ru/finance`** — restored via six static routes.
- **Open Graph locale silently wrong** (`ru` instead of `ru_RU`).

## [0.9.0] - 2026-10-04

### Added

**Structured content blocks (`howToUse` / `features`)**

- `components/shared/HowToSection.tsx`, `FeatureSection.tsx`, `ContentSection.tsx` retained as fallback.
- New types: `FeatureItem`, `HowToStep`.

**JSON-LD HowTo + FAQPage for calculators**

- `CalculatorSchema.tsx` — added `FAQPage` and `HowTo`.
- `ToolSchema.tsx` — added `HowTo`.

**Content for `images-to-pdf`**

- New `howToUse` (4 steps), `features` (9 items), `useCases` (5 items). FAQ expanded from 4 to 7.

### Changed

- **`howToUse` / `features` migrated from `string[]` to `{title, description}[]`** for the 5 tools that already had blocks.
- `CalcLayout.tsx` / `ToolLayout.tsx` — replaced `<ContentSection>` calls with `<HowToSection>` / `<FeatureSection>`.

### Fixed

- **Calculator pages had no FAQPage JSON-LD**.
- **No HowTo JSON-LD anywhere**.
- **`ContentSection` was overloaded**.

## [0.8.0] - 2026-10-03

### Added

**SEO content blocks**

- `components/shared/ContentSection.tsx`.
- New content keys: `howToUseTitle` + `howToUse: string[]`, `featuresTitle` + `features: string[]`, `useCasesTitle` + `useCases: string[]`.

**JSON-LD HowTo**

- Rendered only when `howToUseTitle` and `howToUse` present.

**FAQ accordion (Base UI)**

- `openMultiple=true`, `value={`item-${i}`}`, `text-left text-base font-semibold hover:no-underline`.

**SEO texts for 5 tools (extended)** — `percentage-calculator`, `word-counter`, `json-formatter`, `password-generator`, `image-compressor`.

**Cookie consent** — `components/cookie-consent.tsx`.

### Changed

- `messages/*.json` extended for all 5 tools.
- `data/calculators/finance.ts` / `data/tools/{text,developer,generators}.ts` — `faq` arrays extended to 6.

## [0.7.0] - 2026-10-03

### Added

**Smart search (Fuse.js)**

- `hooks/use-search-index.ts` — `useSearchIndex()` builds Fuse.js index. Weights `0.5 / 0.3 / 0.15 / 0.05`, `threshold: 0.35`, `ignoreLocation: true`, `useTokenSearch: true`.
- `messages/*.json` — new `searchSynonyms` section: 3–6 curated synonyms per tool for all 75.

**Animated icons (@animateicons/react)**

- All Lucide icons replaced with `@animateicons/react@0.9.0`.
- New type exports: `IconHandle`, `IconProps`.
- Direct per-file subpath imports (no barrel).
- `components/ui/search-icon.tsx`.

**Cookie consent**, **Theme tokens**, **Custom scrollbar**.

### Changed

- `tax-regime-comparator` → `income-tax-calculator`.
- `finance.ts` — removed `calcOldRegimeTax`, `calcNewRegimeTax`, `formatINR`.
- `SidebarContent` — added `scrollbar-gutter-stable overflow-y-scroll`.

### Fixed

- **Biome LSP won't start** — `pnpm add -O @biomejs/cli-win32-x64@<version>`.
- `html { font-size: 14px }` ignored inside `@layer base` — moved outside layers.
- `Icon: ComponentType<SVGProps<SVGSVGElement>>` → `ComponentType<IconProps & RefAttributes<IconHandle>>`.
- `Functions cannot be passed directly to Client Components` — client components receive `slug: string`.

## [0.6.0] - 2026-09-29

### Added

**Generators tools (1 new)** — Images to PDF.

**Developer tools (1 new, in progress)** — PDF to Image.

**Print pattern for multi-page PDF** — iframe + `@page { size: A4 landscape }`, `print-color-adjust: exact`.

**Preview pattern** — `PreviewPage` with `ResizeObserver`.

### Changed

- `types/tool.ts`: new kinds `'images-to-pdf'` and `'pdf-to-image'`.
- `pdfjs` usage: `loadingTask.destroy()`.

### Removed

- `pdf-lib` and `@pdf-lib/fontkit`.
- `public/fonts/` (~13 MB).

### Fixed

- Print orientation always fell back to portrait.
- Page background not printed.
- Extra blank second page.
- `objectFit: 'stretch'` TypeScript error.

## [0.5.0] - 2026-09-29

### Added

**Finance calculators (5 new)** — Savings Goal, Loan Eligibility, Rent vs Buy, Fixed Deposit, Number to Words.

**Health calculators (4 new)** — Sleep Debt, Menstrual Cycle, Calorie Deficit Planner, Pregnancy Week Tracker.

**Developer tools (5 new)** — SVG to Base64, Base64 to Image, Regex Tester, Regex Generator, CSS Generator.

**Business tools (1 rename)** — `salary-slip-generator` → `payslip-generator`.

**Renamed (universalization)**:
- `emi-calculator` → `loan-payment-calculator`
- `gst-calculator` → `sales-tax-calculator`
- `sip-calculator` → `monthly-investment-calculator`

**Locale-aware calculate** — `CalcContext { locale: string }`.

**ICU params** — `Option.params` and `OperationResult.params`.

**Dependencies** — `n2words@6.2.0`.

## [0.4.0] - 2026-09-29

### Added

**Developer tools (7 new)** — Color Picker, Color Contrast Checker, Markdown Previewer, SQL Formatter, Code Minifier, Meta Tag Generator, Git Ignore Generator.

**Business tools (7 new)** — Invoice Generator, Invoice Number Generator, UTM Link Builder, Profit Margin Calculator, Break-Even Calculator, Quotation Generator, Salary Slip Generator.

**Dependencies** — `react-colorful`, `terser`, `marked`, `isomorphic-dompurify`, `@tailwindcss/typography`.

### Fixed

- Base UI focus-guards broke layout inside `space-y-*`.
- ICU `INVALID_KEY` in `license-generator.hints`.
- ICU `UNCLOSED_TAG` in `code-minifier` FAQ.
- `DOMPurify.sanitize is not a function` — switched to `isomorphic-dompurify`.

## [0.3.0] - 2026-09-28

### Added

**Developer tools (9)** — Unit Converter, JSON Formatter, Base64 Encoder/Decoder, UUID Generator, Hash Generator, URL Encoder/Decoder, Timestamp Converter, JWT Decoder, JWT Encoder.

**Text tools (4)** — Word Counter, Case Converter, Lorem Ipsum Generator, Diff Checker.

**Generator tools (3)** — Password Generator, QR Code & Barcode Generator, Image Compressor.

**Calculators — finance (10)** — Percentage, EMI, Compound Interest, Discount, Tip, GST, Salary, ROI, SIP, Date Difference.

**Calculators — health (8 new, 11 total)** — TDEE & Macro, Body Fat, Ideal Weight, Water Intake, Heart Rate Zones, Pregnancy Due Date, Sleep Cycle, VO2 Max Estimator.

**Tool system** — `ToolConfig` union with 17 kinds.

## [0.2.0] - 2026-09-27

### Added

- Tool system: `ToolConfig` union, `data/tools/`, `registry`, `ToolLayout`, `ToolView`, `ToolSchema`.
- Developer tools: Unit Converter, JSON Formatter, Base64 Encoder/Decoder.
- Shared: `FAQ`, `RelatedTools`.
- Navigation: `SearchTrigger` (`full` / `icon`).
- i18n: `setRequestLocale` → `next/root-params`.

## [0.1.0] - 2026-09-27

First working MVP.

### Added

**Architecture** — Next.js 16.3.6, React 19.2.8, TypeScript 5, Tailwind CSS 4, Biome, Husky, pnpm, next-intl v4.

**Routing** — Flat URLs `/[locale]/[slug]`, 6 SEO hubs, service pages, SSG.

**Design system** — shadcn/ui on Base UI, light/dark/system, Inter + Geist Mono.

**Navigation** — Collapsible sidebar, search modal with `⌘K`.

**Content** — BMI, Calorie, Age (all in `health`).

**SEO** — Metadata, canonical, hreflang, `sitemap.ts`, `robots.ts`, JSON-LD `WebApplication`.

### Known limitations

- Only `health` is populated.
- `<ProjectName>` not replaced.
- AdSense, GA, OG image not connected.