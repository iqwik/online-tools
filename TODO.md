# TODO

Project roadmap and backlog. Updated after every release.

Legend: `[x]` done · `[ ]` pending · `[~]` in progress · `[!]` blocked

---

## 🔥 Next up (v0.11.0)

### Tools
- [~] **`pdf-to-image`** — `kind: 'pdf-to-image'`, category `developer`, `isWide: true`, `related: ['images-to-pdf', 'image-converter']`. `pdfjs-dist@6.3.289` (worker via `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)`) + `jszip`. Page range parser (`1-5, 8, 11-13`), format PNG / JPEG / WebP, scale 1× / 1.5× / 2× / 3×, quality (JPEG / WebP), transparent background (PNG only). Grid preview + ZIP download. `useSmoothProgress` for page processing. Destroy via `loadingTask.destroy()` (not `pdfDoc.destroy()`), `page.render({canvas, canvasContext, viewport})`. PDF only — Word (`.docx`) is out of scope.
- [ ] **Wave 6 — interactive trackers & builders** (10 tools): `pomodoro-timer`, `habit-tracker`, `decision-maker`, `meeting-cost-calculator`, `trip-planner`, `bill-splitter`, `lead-tracker`, `resume-builder`, `visiting-card-generator`, `api-response-mock-generator`. Needs architecture decision: separate `TrackerConfig` or new `ToolConfig` kinds.

### SEO content (69 tools remaining)
- [ ] **Top-10 tools by traffic** (if GSC data available), then bulk migration in order: finance (15) → health (15) → developer (26) → text (5) → generators (10) → business (7).
- [ ] Structure per tool: `howToUse` (4 steps, `{title, description}`), `features` (5–6 items, `{title, description}`), `useCases` (4–5 items, strings), FAQ up to 6 questions. Reference: timbrica.com, but write original texts.
- [ ] Update `title`, `description`, `keywords` with long-tail terms during the pass.

### Categories — polish
- [ ] **Extend `metaDescription` to 150–155 chars** if Google starts truncating on desktop SERP. Current values deliberately short (118–142) to guarantee no truncation.
- [ ] **Add 6th FAQ question per category** if organic performance suggests. Components already handle any count.
- [ ] **OG image per category** — after `og-default.jpg` exists.

### Locale refactor in `data/**`
- [ ] Replace all hardcoded `'en-US'` / `'en-IN'` (and any hardcoded locale in `toLocaleString` / `toLocaleDateString` / `Intl.*`) with `ctx.locale` passed from `calculate`. Run `grep -rn "toLocaleString('en\|toLocaleDateString('en\|Intl\." data/`.
- [ ] Affects `finance.ts` (`formatInt`, `formatAmount`, `formatINR`), `pregnancy-due-date-calculator`, potentially `health.ts`. After refactor — delete global helpers, keep only local `fmt` inside each `calculate` (rules 29–30 in `CONTEXT.md`).

### Tech debt (from `CONTEXT.md`)
- [ ] `SalarySlipGeneratorView`: replace `payPeriod` text input with two `<Select>` (Month + Year), localize, add `payMonth` / `payYear` to state. Bump localStorage key to `v2`.
- [ ] Extract `CurrencySelect` — `CURRENCIES` / `CURRENCY_SYMBOLS` duplicated across 3 files.
- [ ] `ToolSchema` / `CalculatorSchema`: parametrize hardcoded `publisher.name: 'ProjectName'` — move to `NEXT_PUBLIC_SITE_NAME` env.
- [ ] `types/common.ts`: extract `FAQItem` (duplicated). Consider merging `FeatureItem` and `HowToStep` — both are `{title, description}`.
- [ ] Audit `placeholder` / `defaultValue` for hardcoded English across all view components.
- [ ] `CURRENT_YEAR` — wrap in `useMemo` inside the component (currently computed at module import).
- [ ] `CalculatorForm`: switch `<input type="date">` to `DatePicker` for `age-calculator`.
- [ ] Active category link in sidebar — resolve slug → category (currently strict `===`).
- [ ] Sidebar state resets on locale switch (`[locale]` layout remounts) — consider hoisting `SidebarProvider` to root.
- [ ] Mobile sidebar (Sheet) not tested.
- [ ] `meta-tag-generator`: preview titles (`"Google search preview"`, etc.) hardcoded in EN.
- [ ] `images-to-pdf`: PDF filename comes from `<title>`; consider setting `document.title = 'images-YYYY-MM-DD.pdf'` inside the print iframe before printing.
- [ ] `images-to-pdf`: image quality slider does not affect print output (browser prints originals). If needed — recompress via Canvas before printing.
- [ ] `screenshot-beautifier`: huge images (>4000px) at 2×/3× scale may lag — consider a downscaled preview canvas.
- [ ] Chrome page header / footer (date, URL, page numbers) can only be disabled by the user in the print dialog — cannot be removed programmatically.

### Decisions pending
- [ ] **`useCases` format** — keep as `string[]` (via `ContentSection`) or migrate to `{title, description}[]` (new `UseCaseSection`)?
- [ ] **Bonus tool**: `text-to-svg-generator` (84th) — regex + shape / color / icon dictionary, offline, no dependencies. Discuss after Wave 6.

---

## 🚀 Production

- [ ] Deploy to Vercel
- [ ] Custom domain + HTTPS
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production URL
- [ ] Set `NEXT_PUBLIC_SITE_NAME` (used by JSON-LD publisher — see tech debt)
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
- [ ] Test calculator math (unit tests for `calculate()` functions across all 30 calculators)
- [ ] Test Unit Converter math (factor conversions, temperature special case)
- [ ] Test JSON Formatter (valid / invalid input, all three modes)
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

---

## 💡 Ideas / backlog

- [ ] Favorites (pin tools to sidebar)
- [ ] Recently used tools
- [ ] Share button on tool pages (copy URL)
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

### v0.10.0 — 2026-10-04

**Categories: unified translation block, SEO content, and static routes**

- [x] Unified root-level `categories` block in `messages/{en,ru}.json` with full SEO fields (`name`, `shortName`, `h1`, `metaTitle`, `metaDescription`, `keywords`, `intro`, `howToUse`, `features`, `useCases`, `faq` — 5 questions each)
- [x] `categories.all` for the "All Tools" filter
- [x] Six static category routes: `app/[locale]/{finance,health,text,developer,generators,business}/page.tsx`
- [x] `CategoryPage.tsx` — server component, renders header + tool grid + SEO blocks + FAQ
- [x] `generateMetadata` per category: title, description, keywords, canonical, hreflang, openGraph
- [x] `namespace` prop in `HowToUseSection`, `FeatureSection`, `ContentSection`, `FAQ` — default `'config'`, `'categories'` for hubs
- [x] `getOgLocale()` + `getOgAlternateLocales()` in `helpers/og-locale.ts` — BCP-47 → Open Graph `language_TERRITORY`
- [x] `ToolGrid.tsx` — filters built from `data/categories.ts`, filter by `item.category`
- [x] Removed: `home.categories`, `home.filters`, `category.title.*`, `app/[locale]/[category]/`
- [x] Fixed 404 on `/ru/health`, `/ru/finance`, and every other category after removing the dynamic `[category]` route

### v0.9.0 — 2026-10-04

**Structured content blocks + JSON-LD HowTo + FAQPage for calculators**

- [x] `HowToUseSection.tsx` — numbered grid with round badges, `<ol>` semantics, `{title, description}` steps
- [x] `FeatureSection.tsx` — checkmark grid with `CheckIcon`, `{title, description}` items
- [x] `ContentSection.tsx` retained as universal fallback for `useCases` (`string[]`)
- [x] New types: `FeatureItem`, `HowToStep` in `types/common.ts`
- [x] `CalculatorSchema.tsx` — added `FAQPage` (was missing) and `HowTo` (gated by `howToUseTitle` + `howToUse`)
- [x] `ToolSchema.tsx` — added `HowTo` block
- [x] Migrated `howToUse` and `features` from `string[]` to `{title, description}[]` for 6 tools: `percentage-calculator`, `word-counter`, `json-formatter`, `password-generator`, `image-compressor`, `images-to-pdf`
- [x] `images-to-pdf`: 4-step howToUse, 9 features, 5 useCases, FAQ 4 → 7

### v0.8.0 — 2026-10-03

**SEO content blocks + FAQ accordion + SEO texts for 5 tools**

- [x] `ContentSection.tsx` — universal component for `howToUse` / `features` / `useCases`, `t.has()` guard
- [x] Content keys: `howToUseTitle` + `howToUse`, `featuresTitle` + `features`, `useCasesTitle` + `useCases`
- [x] Wired into `CalcLayout` and `ToolLayout`: form → howToUse → features → useCases → FAQ → RelatedTools
- [x] JSON-LD `HowTo` in `CalculatorSchema` / `ToolSchema`
- [x] `FAQ.tsx` — replaced manual markup with `Accordion` (Base UI), `openMultiple=true`, `value={`item-${i}`}`
- [x] Extended SEO texts for `percentage-calculator`, `word-counter`, `json-formatter`, `password-generator`, `image-compressor` — FAQ up to 6, long-tail keywords
- [x] Cookie consent banner (fixed bottom, z-50), saves to `localStorage`

### v0.7.0 — 2026-10-03

**Smart search (Fuse.js) + animated icons + scrollbar + theme tokens**

- [x] `useSearchIndex` — Fuse.js index from current locale messages, weights `0.5 / 0.3 / 0.15 / 0.05`
- [x] `searchSynonyms` section in `messages/*.json` — 3–6 synonyms per tool for all 75 tools
- [x] `SearchModal` — `fuse.search(query, {limit: 20})`, results sorted by relevance
- [x] All Lucide icons → `@animateicons/react@0.9.0` (Hugeicons + Lucide animated sets)
- [x] New types: `IconHandle`, `IconProps`. Config type: `ComponentType<IconProps & RefAttributes<IconHandle>>`
- [x] Cookie consent banner (fixed bottom, z-50)
- [x] Theme tokens: `--success-custom`, `--secondary-hover`, `@utility shadow-md-primary`
- [x] `html { font-size: 14px }` — base font size
- [x] Custom thin scrollbar (DeepSeek style), 8px, transparent by default, visible on hover
- [x] `html { scrollbar-gutter: stable }`, `html, body { overflow-x: clip }`
- [x] Renamed `tax-regime-comparator` → `income-tax-calculator` (universal, custom brackets)

### v0.6.0 — 2026-09-29

**images-to-pdf + pdf-to-image (in progress) + print pattern**

- [x] `images-to-pdf` — combine JPG / PNG / WebP / GIF into a single PDF. Page size, orientation, columns, margins, gap, fit mode, rotation, background, page numbers, captions, quality slider
- [~] `pdf-to-image` — `pdfjs-dist@6.3.289` + `jszip`, page range parser, scale, quality, transparent background
- [x] New print pattern: build HTML string → hidden `<iframe>` → `iframe.contentWindow.print()`. Solves orientation, background printing, extra blank page
- [x] `PreviewPage` — self-scaling via `ResizeObserver`, no horizontal scroll
- [x] Removed `pdf-lib` and `@pdf-lib/fontkit` (no longer needed)
- [x] Removed `public/fonts/` (13 MB Inter TTF)

### v0.5.0 — 2026-09-29

**15 new tools + locale-aware calculate + ICU params**

- [x] Finance (5): savings-goal, loan-eligibility, rent-vs-buy, fixed-deposit, number-to-words
- [x] Health (4): sleep-debt, menstrual-cycle, calorie-deficit-planner, pregnancy-week-tracker
- [x] Developer (5): svg-to-base64, base64-to-image, regex-tester, regex-generator, css-generator
- [x] Renamed to universal: `emi-calculator` → `loan-payment-calculator`, `gst-calculator` → `sales-tax-calculator`, `sip-calculator` → `monthly-investment-calculator`, `salary-slip-generator` → `payslip-generator`
- [x] `CalcContext { locale }`, `calculate(values, {locale})`, local `fmt` helpers
- [x] `Option.params` / `OperationResult.params` for ICU pluralization
- [x] `n2words@6.2.0` integration

### v0.4.0 — 2026-09-29

**7 developer tools + 7 business tools + ColorPicker + OutputPanel download**

- [x] Developer (7): color-picker, color-contrast-checker, markdown-previewer, sql-formatter-minifier, code-minifier, meta-tag-generator, gitignore-generator
- [x] Business (7): invoice-generator, invoice-number-generator, utm-builder, profit-margin-calculator, break-even-calculator, quotation-generator, salary-slip-generator
- [x] `ColorPicker` in `components/ui/color-picker.tsx` — Popover + react-colorful
- [x] `OutputPanel`: `onDownload` / `downloadLabel` props
- [x] Print CSS via `[id$='-preview']`

### v0.3.0 — 2026-09-28

**9 developer tools + 4 text tools + 3 generators + 18 calculators**

- [x] Developer (9): unit-converter, json-formatter, base64-encoder-decoder, uuid-generator, hash-generator, url-encoder-decoder, timestamp-converter, jwt-decoder, jwt-encoder
- [x] Text (4): word-counter, case-converter, lorem-ipsum-generator, diff-checker
- [x] Generators (3): password-generator, qr-code-generator, image-compressor
- [x] Finance (10): percentage, emi, compound-interest, discount, tip, gst, salary, roi, sip, date-difference
- [x] Health (8 new): tdee-macro, body-fat, ideal-weight, water-intake, heart-rate-zones, pregnancy-due-date, sleep-cycle, vo2-max-estimator
- [x] `ToolConfig` union with 17 kinds
- [x] `data/tools/`, `data/registry.ts`, `ToolLayout`, `ToolView`, `ToolSchema`

### v0.2.0 — 2026-09-28

- [x] Tool system — independent types (`ToolConfig`), data (`data/tools/`), registry (`data/registry.ts`)
- [x] `[slug]/page.tsx` dispatcher — resolves via registry, renders `CalcLayout` or `ToolLayout`
- [x] 3 developer tools shipped: Unit Converter, JSON Formatter, Base64 Encoder/Decoder
- [x] Shared components moved to `components/shared/` — `FAQ`, `RelatedTools`
- [x] `RelatedTools` resolves both calculators and tools by slug
- [x] `Stats`, `ToolGrid`, `SearchModal`, `CategoryPage` use `getAllRegistryEntries()`
- [x] `messages/*/config` extended with 3 tool configs (EN + RU)
- [x] Translation namespace `calculator` → `global` (shared strings)
- [x] `SearchTrigger` — two variants (`full` / `icon`)
- [x] Search + `SidebarTrigger` moved into the sidebar
- [x] Mobile header with sidebar trigger + search icon
- [x] `next/root-params` migration — `setRequestLocale` removed, `generateStaticParams` in `[locale]/layout.tsx`
- [x] `pnpm build` — all routes SSG (`●` / `○`)
- [x] `SearchModal` — compact on empty query, fixed-height results when typing, centered empty state
- [x] `theme-provider.tsx` — dev-only console filter for React 19 `<script>` warning

### v0.1.0 — 2026-09-27

- [x] Stack: Next.js 16 + React 19 + TS + Tailwind 4 + Biome
- [x] i18n: next-intl v4, locales `en` / `ru`, `localePrefix: 'as-needed'`
- [x] Flat routing: `/[locale]/[slug]` + 6 SEO hubs
- [x] 6 categories (`finance`, `health`, `text`, `developer`, `generators`, `business`)
- [x] `data/` — new structure with `health.ts` (bmi / calorie / age) and empty `finance.ts`
- [x] shadcn/ui on Base UI
- [x] Theme: `next-themes` + light / dark / system
- [x] Fonts: Inter + Geist Mono via `next/font/google`
- [x] Sidebar with search, categories, settings popover
- [x] Search modal (`SearchModal`) + `⌘K` trigger
- [x] Home: Hero + Stats + ToolGrid
- [x] Category pages (`CategoryPage`) + "Back" button
- [x] Calculator page: form, result, range badge, FAQ, related
- [x] `CalculatorForm` receives `slug` (fixes `Functions cannot be passed…`)
- [x] `messages/en.json` and `ru.json` — all sections + `config` for 3 calculators
- [x] About + Privacy + 404
- [x] SEO: metadata, canonical, `sitemap.ts`, `robots.ts`, JSON-LD `WebApplication`
- [x] Category icons via Lucide (`CategoryIcon`)

---

## 📊 Progress

| Metric | Current | Target |
|---|---|---|
| Tools shipped | 75 / 83 | 83 |
| Tools with SEO blocks | 6 / 75 | 75 |
| Categories with SEO blocks | 6 / 6 | 6 |
| Locales | 2 / 2 | 2 (then 5) |
| SSG coverage | 100% | 100% |
| AdSense ready | No | Yes |