# TODO

Project roadmap and backlog. Updated after every release.

Legend: `[x]` done · `[ ]` pending · `[~]` in progress · `[!]` blocked

---

## 🔥 Next up (v0.14.0)

### Rich Results Test (after deploy) — TOP PRIORITY
- [ ] Run all JSON-LD (WebApplication, FAQPage, HowTo) for 5–10 representative tools through Google Rich Results Test. Suggested set: `invoice-generator`, `images-to-pdf`, `salary-slip-generator`, `income-tax-calculator`, `unit-converter`, `color-picker`, `regex-tester`, `json-formatter`.
- [ ] Verify HowTo `step` has both `name` and `text` — Google requires both.
- [ ] Verify FAQPage renders for both calculators and tools.
- [ ] Verify home — WebSite + Organization + ItemList + FAQPage.
- [ ] Verify one category page (`/finance`, `/developer`).
- [ ] Verify `related` cards don't break schema (`Related` renders `<Link>`, must not be inside JSON-LD tree).
- [ ] Fix any schema errors before submitting sitemap.

### Final EN + RU proofread
- [ ] Read through all 75 tools × 2 locales in the browser (not in JSON).
- [ ] Catch awkward phrasing, natural-language errors, inconsistency between description and metaDescription tone.
- [ ] Verify each `title` fits in mobile SERP (~50 chars visible).
- [ ] Verify `home.featured.viewAll` ICU plural renders correctly in both locales at current count (76 after pdf-to-image).
- [ ] Spot-check `home.search.placeholderTry` typewriter in both locales (EN `Try {q}` / RU `Попробуйте {q}`).

### Regression check — Variant C Stage 4
- [~] **Systematic check: every View vs. its final texts.** Pattern documented in `CONTEXT.md` → «Правило: соответствие текста и кода». Open `components/tool/<Name>View.tsx` or `data/calculators/*.ts`, list every control/result, compare against `config.<slug>` in `messages/*.json`.
- [x] `word-counter` — fixed: removed «pages» metric, added TikTok to social limits.
- [x] `password-generator` — 4 modes + entropy + bulk implemented, texts synced.
- [x] `image-compressor` — target file size removed from texts.
- [x] `images-to-pdf` — drag → «стрелки», quality removed from features.
- [x] `number-to-words-converter` — EN reformulated.
- [x] `meta-tag-generator` — inputs described in texts.
- [ ] **Remaining ~69 tools** — spot-check at least 10 random (one from each category) plus any tool mentioned as «readability», «pages», or another feature that might not exist in View.

### Related links — verification
- [ ] **Broken slug check across all 75 tools.** `related` is `string[]` — typo renders as missing card silently. Run `grep -A4 "related:" data/calculators/*.ts data/tools/*.ts`, cross-check every slug against `getRegistryEntry`.
- [ ] **Cycle check** — verify no tool references itself, no duplicates within a single array.
- [ ] Consider **stronger typing** — `Slug` union or `satisfies readonly string[]` so typos fail at build time.

### Yandex Webmaster
- [ ] Verify `Clean-param` directive is read correctly (Yandex Webmaster → Tools → robots.txt analysis).
- [ ] Verify `priority` in sitemap is parsed (Yandex uses it weakly, but confirms sitemap is valid).
- [ ] Submit sitemap to Yandex Webmaster.

### Tools
- [~] **`pdf-to-image`** — translations ready in `messages/{en,ru}.json`, but **no `data/tools/developer.ts` entry** and **no View**. Currently orphaned. `pdfjs-dist@6.3.289` installed. Plan: `kind: 'pdf-to-image'`, category `developer`, `isWide: true`, `related: ['images-to-pdf', 'image-converter', 'svg-to-base64', 'base64-to-image']`, worker via `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)`, page range parser (`1-5, 8, 11-13`), format PNG / JPEG / WebP, scale 1× / 1.5× / 2× / 3×, quality, transparent background (PNG only), grid preview + ZIP download, `useSmoothProgress`. Destroy via `loadingTask.destroy()`. **After implementing — restore `pdf-to-image` in `images-to-pdf.related` (first) and `image-converter.related` (third).**
- [ ] **Wave 6 — interactive trackers & builders** (10 tools): `pomodoro-timer`, `habit-tracker`, `decision-maker`, `meeting-cost-calculator`, `trip-planner`, `bill-splitter`, `lead-tracker`, `resume-builder`, `visiting-card-generator`, `api-response-mock-generator`. Needs architecture decision: separate `TrackerConfig` or new `ToolConfig` kinds.

### P3 mobile cleanup (deferred from v0.14.0)
- [ ] **`lucide-react` → `@animateicons/react` sweep.** Known files: `UuidGeneratorView.tsx`, `BreadCrumbs.tsx`, possibly others. Run `grep -rn "lucide-react" components/`. Replace with per-file subpath. Gotcha: `CheckCircle2` → `CircleCheck` in animateicons — verify subpath exists before bulk replace.
- [ ] **Tap targets ≥ 44px on mobile.** Toolbar buttons / inputs at `h-8` (32px) fail the guideline. Fix pattern: `h-9 sm:h-8` or `h-10 sm:h-8`. Affected: `UuidGeneratorView` toolbar, likely other View toolbars. Sweep with `grep -rn 'size="sm"' components/tool/ components/calculator/ components/shared/`.
- [ ] **Small spacing / font polish** across toolbars, forms, and previews on 320–375px. No structural issues left — only cosmetic.

### Categories — polish
- [ ] **Extend `metaDescription` to 150–155 chars** if Google starts truncating on desktop SERP. Current values deliberately short (118–142) to guarantee no truncation.
- [ ] **Add 6th FAQ question per category** if organic performance suggests.
- [ ] **OG image per category** — after `og-default.jpg` exists.

### Locale refactor in `data/**`
- [ ] Replace all hardcoded `'en-US'` / `'en-IN'` (and any hardcoded locale in `toLocaleString` / `toLocaleDateString` / `Intl.*`) with `ctx.locale` passed from `calculate`. Run `grep -rn "toLocaleString('en\|toLocaleDateString('en\|Intl\." data/`.
- [ ] Affects `finance.ts` (`formatInt`, `formatAmount`), `age-calculator`, `date-difference-calculator`, `pregnancy-due-date-calculator`, potentially `health.ts`.
- [ ] After refactor — delete global `formatInt` / `formatAmount`, keep only local `fmt` inside each `calculate`.

### Global units — follow-up
- [ ] **Cleanup** — delete unused `config.<slug>.units.*` keys from `messages/{en,ru}.json` after `global.units` migration. Run `grep -n "\.units\." messages/en.json messages/ru.json`.
- [ ] **ICU plural for units** (optional) — currently `global.units.{months, years, days, weeks, hours, nights}` are simple strings. If per-value agreement is needed in labels, migrate to `t(unit, {count: value})` and add plural forms. Deferred — labels are grammatically neutral for now.

### Tech debt (from `CONTEXT.md`)
- [ ] `SalarySlipGeneratorView`: replace `payPeriod` text input with two `<Select>` (Month + Year). Bump localStorage key to `v2`.
- [ ] Extract `CurrencySelect` — `CURRENCIES` / `CURRENCY_SYMBOLS` duplicated across 3 files (invoice, quotation, payslip).
- [ ] `ToolSchema` / `CalculatorSchema`: parametrize hardcoded `publisher.name: 'ProjectName'` — move to `NEXT_PUBLIC_SITE_NAME` env.
- [ ] `types/common.ts`: extract `FAQItem` (duplicated). Consider merging `FeatureItem` and `HowToStep`.
- [ ] Audit `placeholder` / `defaultValue` for hardcoded English across all view components.
- [ ] `CURRENT_YEAR` — wrap in `useMemo` inside the component.
- [ ] `CalculatorForm`: switch `<input type="date">` to `DatePicker` for `age-calculator`.
- [ ] Active category link in sidebar — resolve slug → category (currently strict `===`).
- [ ] Sidebar state resets on locale switch — consider hoisting `SidebarProvider` to root.
- [ ] `meta-tag-generator`: preview titles (`"Google search preview"`, etc.) hardcoded in EN.
- [ ] `images-to-pdf`: PDF filename comes from `<title>`; consider setting `document.title` inside the print iframe.
- [ ] `images-to-pdf`: image quality slider does not affect print output. If needed — recompress via Canvas before printing.
- [ ] `screenshot-beautifier`: huge images (>4000px) at 2×/3× scale may lag — consider a downscaled preview canvas.
- [ ] Chrome page header / footer (date, URL, page numbers) can only be disabled by the user in the print dialog.
- [ ] **Invoice preview font-scaling** — after the em-refactor, verify A4 width isn't exceeded at `fontSize: large`. If it is, cap the largest preset.
- [ ] **`Intl.NumberFormat` for currency** — confirm JPY produces `¥1,235` (no decimals) in both locales. Not tested in browser yet.
- [ ] **`ShareIcon` `<title>` id collision risk** — 2 ShareButton instances exist but mutually exclusive via breakpoints. If a third instance is ever added (e.g. in SidebarSettings), either drop `<title>` + `aria-hidden="true"` or switch to `useId()`.

### Decisions pending
- [ ] **`useCases` format** — keep as `string[]` (via `ContentSection`) or migrate to `{title, description}[]` (new `UseCaseSection`)?
- [ ] **Bonus tool**: `text-to-svg-generator` (84th) — regex + shape / color / icon dictionary, offline. Discuss after Wave 6.

---

## 🚀 Production

- [ ] Deploy to Vercel
- [ ] Custom domain + HTTPS
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production URL
- [ ] Set `NEXT_PUBLIC_SITE_NAME` (used by JSON-LD publisher)
- [ ] Connect Google Analytics (`NEXT_PUBLIC_GA_ID`)
- [ ] Connect Google AdSense (`NEXT_PUBLIC_ADSENSE_CLIENT`)
- [ ] Submit AdSense for review (after content is ready)
- [ ] Generate `manifest.webmanifest` + favicon set
- [ ] Create OG image (`og-default.jpg`, 1200×630)
- [ ] Submit `sitemap.xml` to Google Search Console
- [ ] Submit to Yandex Webmaster
- [ ] Add `robots.txt` verification

---

## 🎨 Polish

- [ ] Replace `<ProjectName>` with the real project name (search & replace across the repo)
- [ ] Remove leftover barrel imports, if any
- [ ] Fix `useExhaustiveDependencies` warning in `sidebar.tsx` (Biome)
- [ ] Remove `display: contents` wrapper after `@base-ui/react` update (PR #4350)
- [ ] Unify spacing and typography across pages
- [ ] Hover / focus states audit
- [ ] Verify dark theme on every page
- [ ] Verify sidebar looks correct at all breakpoints
- [ ] Category icon audit — all six match their category theme colors

---

## 🧪 Testing

- [ ] Add Playwright (or Cypress) smoke tests
- [ ] Test calculator math (unit tests for `calculate()` across all 30 calculators)
- [ ] Test Unit Converter math (factor conversions, temperature special case)
- [ ] Test JSON Formatter (valid / invalid, all three modes)
- [ ] Test Base64 (Standard vs URL-Safe, round-trip)
- [ ] Test regex tester (catastrophic backtracking, zero-length matches)
- [ ] Test pdf-to-image (page range parser, ZIP download)
- [ ] Test i18n routing (EN ↔ RU switch preserves page)
- [ ] Test theme persistence (`localStorage`)
- [ ] Test sidebar state persistence
- [ ] Test `⌘K` search modal
- [ ] Test category pages — all six under both locales
- [ ] Test canonical URLs and hreflang tags via `view-source:`
- [ ] Test OG meta tags via Facebook Debugger / Twitter Card Validator
- [ ] Run Google Rich Results Test for HowTo / FAQPage schemas
- [ ] **Test SliderField cursor preservation** — type between digits, delete mid-string, paste, clear-to-empty.
- [ ] **Test related links** — every tool renders exactly 4 cards, no broken/empty entries.
- [ ] **Test Yandex robots** — `robots.txt` Clean-param visible in Yandex Webmaster.
- [ ] **Test typewriter placeholder** — cycle of 6 strings in Hero, correct restart on locale switch, `prefers-reduced-motion` fallback.
- [ ] **Test safe-area** — CookieConsent / Footer on iPhone with notch (both orientations).

---

## 💡 Ideas / backlog

- [ ] Favorites (pin tools to sidebar)
- [ ] Recently used tools
- [x] **Share button** — implemented (`ShareButton` with `navigator.share` + clipboard fallback). Dual instance: mobile header + floating `sm:block`.
- [ ] Embed widget (`<iframe>` for calculators)
- [ ] Print-friendly styles for calculators
- [ ] Keyboard shortcuts reference page
- [ ] CSV / JSON export for calculators that produce tables
- [ ] Open Graph image per tool (dynamic via `next/og`)
- [ ] Changelog page in the app (`/changelog`)
- [ ] RSS feed for new tools
- [ ] Additional locales (`de`, `es`, `fr`)
- [ ] `output: 'export'` build option for hosting without Node.js (requires `localePrefix: 'always'` and no middleware)
- [ ] Search analytics — log top queries (privacy-friendly, aggregate only)
- [ ] Per-tool analytics dashboard for AdSense optimization

---

## ✅ Done

### v0.14.0 — 2026-10-06

**Mobile adaptation (P0–P3) + typewriter placeholder in Hero**

**Typewriter placeholder**
- [x] `hooks/use-typewriter.ts` — cyclic character-by-character typing of a string array. Phases: `start → typing → holding → erasing → between`. Respects `prefers-reduced-motion`. Restarts on locale switch via `texts.join('\u0000')` deps comparison.
- [x] `SearchTrigger` — new prop `placeholders?: string[]`, static `placeholder?: string` fallback, blinking caret `bg-current animate-pulse`.
- [x] `Hero.tsx` — builds placeholders from `SUGGESTION_KEYS` via `home.search.placeholderTry`.
- [x] `messages/{en,ru}.json` — new key `home.search.placeholderTry` (`Try {q}` / `Попробуйте {q}`).

**Viewport & safe-area**
- [x] `export const viewport: Viewport` in `app/[locale]/layout.tsx` — `viewportFit: 'cover'`.
- [x] `CookieConsent` — `pb-[calc(0.75rem+env(safe-area-inset-bottom))]`.
- [x] `Footer` — `pb-[calc(0.625rem+env(safe-area-inset-bottom))]`.

**Mobile header & ShareButton**
- [x] Mobile header (`sm:hidden`) now contains `ShareButton` (`bg-card/80 size-9 rounded-lg backdrop-blur border`) + `SearchTrigger variant="icon"` with `gap-1.5`.
- [x] Floating `ShareButton` gated behind `hidden sm:block fixed top-3 right-3 z-30`.
- [x] No more overlap with `SearchTrigger` in sticky header.

**Global layout — `.page`**
- [x] `width: 100%` added to `@utility page` — fixes overflow on every page at 320–393px.
- [x] `padding-inline: 1rem` (mobile) / `1.5rem` (sm+) — via `@media (min-width: 640px)` outside `@utility`.

**Mobile layout fixes**
- [x] `Hero.tsx` — inner div `w-full`. Badge — `flex-wrap justify-center whitespace-normal max-w-full`.
- [x] `FeaturedTools.tsx` — header `flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between`.
- [x] `Stats.tsx` — removed `•` separators, `flex-wrap items-center justify-center gap-x-6 gap-y-2`, `items-baseline`.
- [x] `PrivacyNote.tsx` — content div `min-w-0`, label + badge `flex-col sm:flex-row sm:flex-wrap`, icon `size-10 sm:size-12`.
- [x] `BreadCrumbs.tsx` — `flex-wrap items-center gap-x-1 gap-y-0.5`, `shrink-0` on icons. Fixes 3+ segment overflow.
- [x] `CookieConsent` — `w-[calc(100%-2rem)] max-w-lg`, `flex-col sm:flex-row`.
- [x] `Footer` — `flex-col gap-1.5 sm:flex-row sm:justify-between`.

**Closed from earlier backlog**
- [x] `Share button` — placement decision closed (dual instance).
- [x] Mobile sidebar (Sheet) — verified on 360px / 375px.
- [x] Footer vertical growth on `/privacy`, `/about` — resolved by mobile layout pass.

### v0.13.0 — 2026-10-06

**Related links for all 75 tools, Yandex SEO, global units, SliderField refactor**

**Related links — SEO interlinking**
- [x] Added `related: Slug[]` (4 items each) to **all 75 tools** across every category
- [x] Link graph organized by semantic clusters:
  - **finance** — credits (loan-payment ↔ loan-eligibility ↔ rent-vs-buy), investments (compound-interest ↔ monthly-investment ↔ savings-goal ↔ fixed-deposit ↔ roi), purchases (percentage ↔ discount ↔ tip ↔ sales-tax), income (salary ↔ income-tax), utility (date-difference)
  - **health** — weight (bmi ↔ body-fat ↔ ideal-weight), nutrition (calorie ↔ tdee-macro ↔ calorie-deficit-planner), fitness (heart-rate ↔ vo2-max ↔ water-intake), sleep (sleep-cycle ↔ sleep-debt), pregnancy (pregnancy-due-date ↔ pregnancy-week-tracker ↔ menstrual-cycle)
  - **business** — documents (invoice-generator ↔ quotation-generator ↔ payslip-generator + invoice-number-generator), financial math (profit-margin ↔ break-even), marketing (utm-builder)
  - **developer** — encoding (base64 ↔ url ↔ jwt-decoder ↔ jwt-encoder), generators (uuid ↔ hash ↔ license ↔ gitignore), formatters (json ↔ sql ↔ code-minifier ↔ markdown), color (color-picker ↔ color-contrast ↔ css-generator), regex (regex-tester ↔ regex-generator), images/base64 (svg-to-base64 ↔ base64-to-image ↔ base64-image-optimizer ↔ favicon)
  - **generators** — images (image-compressor ↔ bulk-image-resizer ↔ image-converter ↔ image-watermark ↔ images-to-pdf) + security (password ↔ qr-code) + palette (color-palette-extractor)
  - **text** — small category, fully connected (5 × 4)
- [x] Fixed broken slug — `word-counter` and `case-converter` referenced `lorem-ipsum`, actual slug is `lorem-ipsum-generator`
- [x] Removed `pdf-to-image` orphan reference from `images-to-pdf.related`
- [x] ~300 new internal links site-wide

**Yandex-specific SEO**
- [x] `robots.ts` — added a separate `Yandex` user-agent block with `Clean-param` directive via `other: {'Clean-param': '...'}`. Scrub params: `utm_source&utm_medium&utm_campaign&utm_term&utm_content&yclid&gclid&fbclid&_openstat&ysclid&yrclid`
- [x] Removed `host` field (deprecated by Yandex in 2018, never supported by Google)
- [x] `sitemap.ts` — removed `changefreq` (ignored by Google, unused by Yandex for crawl budget). Kept `priority` for Yandex.

**Global unit translations**
- [x] `global.units.*` namespace in `messages/{en,ru}.json` — `km`, `m`, `cm`, `mm`, `kg`, `g`, `bpm`, `months`, `years`, `days`, `weeks`, `hours`, `minutes`, `nights`
- [x] `CalculatorForm` resolves units via `tConfig.has` → `tGlobal.has` → raw string fallback
- [x] Migrated all `data/calculators/*.ts` from `<slug>.units.*` to `units.*` — `calorie-calculator`, `tdee-macro-calculator`, `heart-rate-zones-calculator`, `vo2-max-estimator`, `water-intake-calculator`, `sleep-debt-calculator`, `menstrual-cycle-calculator`, `calorie-deficit-planner`
- [x] Fixed `heart-rate-zones-calculator` — units rendered as raw translation keys before the fix

**Parametrized tool count**
- [x] `helpers/tool-count.ts` — `getToolCount()` = `getAllRegistryEntries().length`
- [x] `meta.tools.description`, `tools.description` — `{count}` placeholder instead of hardcoded «75»
- [x] `home.featured.viewAll` — ICU plural: EN `one/other`, RU `one/few/many/other`. `#` placeholder inside ICU
- [x] After `pdf-to-image` lands → all three strings update automatically

**SliderField refactor**
- [x] Local `min` / `max` state — initialized from `input`, editable at runtime, clamps `value` outside range
- [x] Auto-width inputs via `calc(Nch + 1.25rem)`
- [x] Pencil icon buttons with `focusEnd(el)` → `setSelectionRange(len, len)`
- [x] Integer parse — `s.replace(/[^\d-]/g, '')` handles locale separators (`1 000`, `1,000`)
- [x] Cursor preservation — `countMeaningful` / `posAfterMeaningful` / `restoreCursor` + `useLayoutEffect`. Fixes jump-to-end bug when typing between digits.
- [x] Empty input → 0
- [x] min/max clamp on blur, not on change — typing `110` with `max=100` keeps `110` visible until blur
- [x] `focus-visible:ring-0` instead of `focus-visible:ring-transparent` (ring-transparent kept ring-width)
- [x] `text-xs md:text-xs` for min/max — base `Input` has `md:text-sm` which overrode `text-xs`

**Sales-tax-calculator rate input**
- [x] Changed `rate` from `select` (5/10/15/20/25 %) to `type: 'number'`, `step: 0.01`
- [x] `Number(String(rate).replace(',', '.'))` for RU-locale comma input
- [x] `secondary.rate` — `parseFloat(r.toFixed(4))` strips trailing zeros

**InvoiceGeneratorView refactor**
- [x] Locale-aware currency via `useMemo(() => new Intl.NumberFormat(locale, {style: 'currency', currency, ...}))` — passed down as `fmt` prop
- [x] Font size scaling in preview — all `text-*` → `text-[Nem]` (`0.9em`, `1.35em`, `2.3em`). Font Size select now actually works.

### v0.12.0 — 2026-10-05

**Home restructure (Phases A / B / C), search refactoring, sidebar "All tools"**

- [x] `HomeSchema.tsx` — WebSite + Organization + ItemList (6 categories) + FAQPage (3 Q)
- [x] `CategoryCards.tsx` — 6 category cards, animated icons on hover
- [x] `FeaturedTools.tsx` — 18 seeded-random (seed 42) + «Browse all {count} tools →» CTA
- [x] `RecentlyAdded.tsx` — top 6 by `publishedAt`
- [x] `HomeFaq.tsx` — 3 questions, reuses `shared/FAQ` with `namespace="home"`
- [x] `PrivacyNote.tsx` — renamed from `home/Footer.tsx`
- [x] `app/[locale]/tools/page.tsx` — full catalog with `ToolGrid`, localized metadata
- [x] `helpers/array.ts` — `seededShuffle<T>(arr, seed)`
- [x] Sidebar — "All tools" entry with `LayoutGridIcon` + `totalTools` counter
- [x] `Stats.tsx` — «{count}+ tools» clickable → `/tools`
- [x] `sitemap.ts` — `CONTENT_LASTMOD` instead of `new Date()`. `/tools` priority 0.9
- [x] `generateMetadata` on home — localized, canonical, hreflang, OG
- [x] Search refactoring — `SearchProvider` context `{isOpen, open(query?), close}`, query lives in provider
- [x] `SearchModal` — controlled by `query` prop
- [x] `SearchTrigger` — `open()` without arguments preserves query
- [x] Hero suggestion chips — 6 chips, `open(tHome('suggestions.${key}'))`
- [x] Fixed: `utm-builder` garbage keys in `ru.json`
- [x] Fixed: `CategoryCards` barrel import → subpath
- [x] Fixed: `SearchModal` `lucide-react` → `@animateicons/react/lucide/search-icon`

### v0.11.0 — 2026-10-05

**Universal SEO content rewrite (Variant C, Stages 1–3) + `metaDescription` split + UI/infra fixes**

- [x] Rewrote `title` for all 75 tools — unified em dash `—`, ≤60 chars
- [x] Rewrote `description` (page version) — action verb first, up to 200 chars
- [x] **Added `metaDescription` field to `BaseConfig`** — mandatory, up to 155 chars
- [x] Filled `metaDescription` for all 75 tools
- [x] Rewrote `features`, `howToUse`, `useCases`, `faq` for all 75
- [x] Rewrote all 75 `searchSynonyms` (EN + RU)
- [x] «Free»/«Бесплатный» policy — kept in 10 tools
- [x] `generateMetadata` — `t(config.metaDescription)`
- [x] `CalculatorSchema` / `ToolSchema` — `webApp.description: t(metaDescription)`
- [x] Fixed `BreadCrumbs.tsx` React key warning
- [x] Fixed `ThemeToggle.tsx` hydration mismatch
- [x] Fixed `globals.css` scrollbar issues
- [x] `.vscode/settings.json` performance tuning

### v0.10.0 — 2026-10-04

**Categories: unified translation block, SEO content, and static routes**

- [x] Unified root-level `categories` block in `messages/{en,ru}.json`
- [x] Six static category routes
- [x] `CategoryPage.tsx` — server component
- [x] `namespace` prop in `HowToUseSection`, `FeatureSection`, `ContentSection`, `FAQ`
- [x] `getOgLocale()` + `getOgAlternateLocales()`
- [x] `ToolGrid.tsx` — filters built from `data/categories.ts`
- [x] Removed: `home.categories`, `home.filters`, `category.title.*`, `[category]/` route
- [x] Fixed 404 on `/ru/health` and other categories

### v0.9.0 — 2026-10-04

**Structured content blocks + JSON-LD HowTo + FAQPage for calculators**

- [x] `HowToUseSection.tsx`, `FeatureSection.tsx`, `ContentSection.tsx`
- [x] New types: `FeatureItem`, `HowToStep`
- [x] `CalculatorSchema.tsx` — added `FAQPage` and `HowTo`
- [x] `ToolSchema.tsx` — added `HowTo`
- [x] Migrated `howToUse` / `features` from `string[]` to `{title, description}[]` for 6 tools
- [x] `images-to-pdf`: 4-step howToUse, 9 features, 5 useCases, FAQ 4 → 7

### v0.8.0 — 2026-10-03

**SEO content blocks + FAQ accordion + SEO texts for 5 tools**

- [x] `ContentSection.tsx`
- [x] Content keys: `howToUseTitle` + `howToUse`, `featuresTitle` + `features`, `useCasesTitle` + `useCases`
- [x] JSON-LD `HowTo`
- [x] `FAQ.tsx` — Base UI Accordion, `openMultiple=true`
- [x] Extended SEO texts for 5 tools
- [x] Cookie consent banner

### v0.7.0 — 2026-10-03

**Smart search (Fuse.js) + animated icons + scrollbar + theme tokens**

- [x] `useSearchIndex` — Fuse.js index
- [x] `searchSynonyms` section for all 75 tools
- [x] All Lucide icons → `@animateicons/react@0.9.0`
- [x] New types: `IconHandle`, `IconProps`
- [x] Theme tokens, custom scrollbar
- [x] Renamed `tax-regime-comparator` → `income-tax-calculator`

### v0.6.0 — 2026-09-29

**images-to-pdf + pdf-to-image (in progress) + print pattern**

- [x] `images-to-pdf` — combine images into a single PDF
- [~] `pdf-to-image` — `pdfjs-dist` + `jszip`, page range parser
- [x] Print pattern: HTML string → hidden iframe → `print()`
- [x] `PreviewPage` — self-scaling via `ResizeObserver`
- [x] Removed `pdf-lib` and `@pdf-lib/fontkit`
- [x] Removed `public/fonts/` (13 MB)

### v0.5.0 — 2026-09-29

**15 new tools + locale-aware calculate + ICU params**

- [x] Finance (5), Health (4), Developer (5)
- [x] Renamed to universal: `emi-calculator`, `gst-calculator`, `sip-calculator`, `salary-slip-generator`
- [x] `CalcContext { locale }`
- [x] `Option.params` / `OperationResult.params`
- [x] `n2words@6.2.0` integration

### v0.4.0 — 2026-09-29

**7 developer tools + 7 business tools + ColorPicker + OutputPanel download**

- [x] Developer (7), Business (7)
- [x] `ColorPicker`, `OutputPanel` download props
- [x] Print CSS via `[id$='-preview']`

### v0.3.0 — 2026-09-28

**9 developer + 4 text + 3 generators + 18 calculators**

- [x] All tool categories populated
- [x] `ToolConfig` union with 17 kinds
- [x] `data/tools/`, `data/registry.ts`, `ToolLayout`, `ToolView`, `ToolSchema`

### v0.2.0 — 2026-09-28

- [x] Tool system — independent types, data, registry
- [x] `[slug]/page.tsx` dispatcher via registry
- [x] 3 developer tools
- [x] Shared components: `FAQ`, `RelatedTools`
- [x] `SearchTrigger` variants
- [x] `next/root-params` migration

### v0.1.0 — 2026-09-27

- [x] Stack, i18n, flat routing, 6 categories
- [x] shadcn/ui on Base UI, theme, fonts
- [x] Sidebar + search modal
- [x] Home + category pages + calculator page
- [x] About + Privacy + 404
- [x] SEO basics

---

## 📊 Progress

| Metric | Current | Target |
|---|---|---|
| Tools shipped | 75 / 83 | 83 |
| Tools with SEO blocks | 75 / 75 | 75 |
| Tools with `metaDescription` | 75 / 75 | 75 |
| Tools with `searchSynonyms` | 75 / 75 | 75 |
| Tools with `related` (4 links each) | 75 / 75 | 75 |
| Categories with SEO blocks | 6 / 6 | 6 |
| Locales | 2 / 2 | 2 (then 5) |
| SSG coverage | 100% | 100% |
| Internal links (from related) | ~300 | — |
| Mobile adaptation | Done (P0–P2) | — |
| AdSense ready | No | Yes |

---

## 🔍 Audit trail

### 2026-10-06 (v0.14.0)

**Mobile adaptation — root cause of horizontal overflow:**
1. `.page` inside `<main className="flex flex-col">` — flex item with `margin-inline: auto` did not stretch to parent width. Expanded by content when any child's `min-content` exceeded viewport. `overflow-x: clip` on `html, body` hid the symptom. Fix: `width: 100%` in `@utility page`.
2. `BreadCrumbs` — `flex items-center` without `flex-wrap` couldn't compress below `min-content`, pushed `.page` past viewport. Fix: `flex-wrap` + `gap-x-1 gap-y-0.5`.
3. `Hero` inner div — no `w-full`, `items-center` on outer flex column let it shrink-to-fit by content. Fix: `w-full`.
4. `PrivacyNote` — content div without `min-w-0` couldn't shrink, label collapsed to ~50px column, badge overlaid text. Fix: `min-w-0` + `flex-col sm:flex-row`.

**Safe-area / viewport:**
- Added `viewportFit: 'cover'` — without it `env(safe-area-inset-*)` is ignored on iPhone.
- CookieConsent and Footer overlapped home-indicator. Fixed via `pb-[calc(X+env(safe-area-inset-bottom))]`.

**ShareButton placement:**
- Floating `top-3 right-3 z-30` overlaid `SearchTrigger` in mobile header (`h-14 z-10`). Fixed: mobile instance inside header, floating gated behind `hidden sm:block`.

**Typewriter placeholder:**
- `use-typewriter.ts` — cyclic typing of 6 strings. Restart on locale switch via `texts.join('\u0000')` deps.
- Caret via `animate-pulse`.

### 2026-10-06 (v0.13.0)

**Related links fixes:**
1. `lorem-ipsum` slug — `word-counter` and `case-converter` referenced `'lorem-ipsum'`, actual slug is `'lorem-ipsum-generator'`. Fixed.
2. `pdf-to-image` orphan — `images-to-pdf.related` included an entry that has no data (translations exist, no view). Removed to prevent broken cards.

**Yandex SEO:**
- `robots.ts` — Clean-param directive for UTM/tracking param scrubbing. Removed deprecated `Host`.

**Global units:**
- `heart-rate-zones-calculator` — units rendered as raw keys `heart-rate-zones-calculator.units.years` before migration. Fixed via `global.units`.

**SliderField:**
- Cursor jumped to end when typing between digits. Fixed via meaningful-char position tracking.
- Value clamped on every keystroke — impossible to clear-then-retype. Fixed: clamp on blur.
- `focus-visible:ring-transparent` didn't remove the ring. Fixed: `ring-0`.
- `text-xs` overridden by base `md:text-sm`. Fixed: `text-xs md:text-xs`.

**Invoice generator:**
- Currency always formatted as `en-US`. Fixed via `Intl.NumberFormat` + `useLocale()`.
- Font Size select did nothing. Fixed via em-based text sizes in preview.

### 2026-10-04 → 2026-10-05

**Critical mismatches found and fixed:**
1. `word-counter` — removed «pages», replaced with «average word length». Added TikTok to social limits.
2. `password-generator` — implemented 4 modes + entropy + bulk in code.
3. `image-compressor` — target file size removed from texts (in tech debt).
4. `images-to-pdf` — drag → arrows, quality removed from features.
5. `number-to-words-converter` — EN reformulated.
6. `meta-tag-generator` — inputs described in texts.

**Infrastructure bugs fixed:**
- `BreadCrumbs.tsx` — React key warning.
- `ThemeToggle.tsx` — hydration mismatch.
- `globals.css` — scrollbar `scrollbar-width` in universal selector, `>` combinator for thumb, `no-scrollbar` in `SidebarContent`.
- `.vscode/settings.json` — TS Server memory + watcher excludes.