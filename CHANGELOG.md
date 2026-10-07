## [Unreleased]

### TODO

- **Deploy to Amvera** — create project, connect GitHub, choose "Начальный" tariff (290 ₽/mo, SLA). In Amvera → get A-record IP + TXT verification value. In Timeweb → add A `@` → Amvera IP, A `www` → same IP, TXT `@` → verification value. Wait for automatic Let's Encrypt. Test from RU (home + mobile) and world (VPN). Set env in Amvera: `NEXT_PUBLIC_SITE_URL=https://toolyland.com`, `NEXT_PUBLIC_SITE_NAME=Toolyland`. Rebuild after env set (`NEXT_PUBLIC_*` inlined at build time). Verify JSON-LD url = canonical = `https://toolyland.com/...`.
- **OG image** — `og-default.jpg` (1200×630) based on Toolyland logo. Place in `public/`, wire up in `generateMetadata` on home, `/tools`, categories, tools.
- **Favicon set** — generate full set via realfavicongenerator.net from 512×512 master. Files: `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`, `android-chrome-{192,512}.png`, `site.webmanifest`. Wire in `metadata.icons` at `app/[locale]/layout.tsx`.
- **`pdf-to-image`** — translations ready in `messages/{en,ru}.json` (`config.pdf-to-image` + `searchSynonyms`), but no `data/tools/developer.ts` entry and no View. `pdfjs-dist@6.3.289` installed. Plan: `kind: 'pdf-to-image'`, category `developer`, `isWide: true`, worker via `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)`, page range parser (`1-5, 8, 11-13`), format PNG / JPEG / WebP, scale 1× / 1.5× / 2× / 3×, quality (JPEG / WebP), transparent background (PNG only), grid preview + ZIP download, `useSmoothProgress`. Destroy via `loadingTask.destroy()` (not `pdfDoc.destroy()`), `page.render({canvas, canvasContext, viewport})`. When implemented, re-add `pdf-to-image` to `related` in `images-to-pdf` (removed in 0.13.0 to avoid broken links).
- **Rich Results Test** — after deploy: run all JSON-LD (WebApplication, FAQPage, HowTo, CollectionPage, ItemList, BreadcrumbList) through Google Rich Results Test. Pages to test: `/`, `/tools`, `/finance`, `/ru/finance`, `/bmi-calculator`, `/ru/bmi-calculator`, `/invoice-generator`, `/json-formatter`, `/images-to-pdf`, `/income-tax-calculator`, `/unit-converter`, `/salary-slip-generator`. Verify URL in JSON-LD matches canonical (with locale prefix on RU pages). **Top of queue after deploy.**
- **Regression check for remaining tools** — Stage 4 of Variant C. Systematic verification: open every View, compare against final texts. Known audit issues are all fixed, but a full pass hasn't been done. Suggested set: `InvoiceGeneratorView`, `SalarySlipGeneratorView`, `ColorPickerView`, `RegexTesterView`, `JsonFormatterView`.
- **Final EN + RU proofread** — read through all 75 tools × 2 locales one more time in the browser.
- **`lucide-react` cleanup** — remaining imports in `UuidGeneratorView.tsx`, `BreadCrumbs.tsx` and possibly other View / shared components. Replace with `@animateicons/react/lucide/<name>-icon`. Run `grep -rn "lucide-react" components/` for the full list. Note: in `UuidGeneratorView` `CheckCircle2` renamed to `CircleCheck` in animateicons — verify subpath.
- **Tap targets on mobile** — toolbar buttons / inputs at `h-8` (32px) fail the ≥44px guideline. Apply `h-9 sm:h-8` or `h-10 sm:h-8` on mobile. Affected: `UuidGeneratorView` toolbar, likely other View toolbars. Sweep with `grep -rn 'size="sm"' components/tool/ components/calculator/`.
- **P3 mobile cosmetics** — deferred items from the 0.14.0 review: spacing tweaks, font sizes in toolbars, small tap-area polish. No structural issues left.
- **Category `metaDescription` review** — if Google starts truncating on desktop SERP or coverage drops, extend to 150–155 characters.
- **Category FAQ expansion** — if organic performance suggests, add a 6th question to `categories.<slug>.faq`.
- **Wave 6 — interactive trackers & builders**: `pomodoro-timer`, `habit-tracker`, `decision-maker`, `meeting-cost-calculator`, `trip-planner`, `bill-splitter`, `lead-tracker`, `resume-builder`, `visiting-card-generator`, `api-response-mock-generator`
- **Locale refactor in `data/**`:** all hardcoded `'en-US'` / `'en-IN'` (and any hardcoded locale in `toLocaleString` / `toLocaleDateString` / `Intl.*`) — replace with `ctx.locale` passed from `calculate`. Run `grep -rn "toLocaleString('en\|toLocaleDateString('en\|Intl\." data/`. Affects `finance.ts` (`formatInt`, `formatAmount`, `formatINR`), `age-calculator`, `date-difference-calculator`, `pregnancy-due-date-calculator`. After refactor — delete global `formatInt` / `formatAmount`, keep only local `fmt` inside each `calculate`.
- `SalarySlipGeneratorView`: replace `payPeriod` text input with two `<Select>` (Month + Year), localize, add `payMonth` / `payYear` to state
- Extract `CurrencySelect` — `CURRENCIES` / `CURRENCY_SYMBOLS` duplicated across 3 files (invoice, quotation, payslip)
- `types/common.ts`: extract `FAQItem` (duplicated). Also consider merging `FeatureItem` and `HowToStep` — both are `{title, description}`
- Audit `placeholder` / `defaultValue` for hardcoded English
- Remove `display: contents` wrapper after `@base-ui/react` update (PR #4350)
- `CURRENT_YEAR` — wrap in `useMemo` inside the component
- `CalculatorForm`: switch `<input type="date">` to `DatePicker` for `age-calculator`
- Active category link in sidebar — slug → category (currently `===`)
- Sidebar state resets on locale switch
- `meta-tag-generator`: preview titles (`"Google search preview"`, etc.) hardcoded in EN
- AdSense, GA
- `images-to-pdf`: PDF filename comes from `<title>`; consider setting `document.title = 'images-YYYY-MM-DD.pdf'` inside the print iframe before printing
- `images-to-pdf`: image quality slider does not affect print output (browser prints originals). If needed — recompress via Canvas before printing
- Chrome page header / footer (date, URL, page numbers) can only be disabled by the user in the print dialog — cannot be removed programmatically
- Decide on `useCases` format: keep as `string[]` (via `ContentSection`) or migrate to `{title, description}[]` (via a new `UseCaseSection`)
- **`image-compressor` target file size mode** — binary search on quality to hit a target KB. Removed from texts, implementation in tech debt (3–4 hours).
- Bonus tool: `text-to-svg-generator` (84th) — regex + shape / color / icon dictionary, offline, no dependencies. Discuss after Wave 6
- **Custom unit plural in labels** — `global.units.{months, years, days, weeks, hours, nights}` are simple strings (не ICU plural), используются как метки полей. Если понадобится согласование с числом — надо перейти на `t(unit, {count: value})` во всех `SliderField`/`CalculatorForm` и передавать значение. Отложено.
- **Related slug typization** — `string[]` doesn't catch typos (like the old `lorem-ipsum`). Consider `Slug` union type or `satisfies readonly string[]` assertion so typos fail at build time.
- **`getToolCount()` is sync** — fine at 75, fine at 500. If the registry grows beyond ~1000 entries with heavy per-entry initialization, consider a cached constant or build-time inlining.

## [0.15.0] - 2026-10-07

### SEO finalization (static part) + domain + hosting + brand identity

#### Added

**JSON-LD on all page types**

- **`components/tools/ToolsSchema.tsx`** — new. `CollectionPage` + `ItemList` (all 75 tools). Mounted on `/tools` before the page header. Uses `getAllRegistryEntries()` for the item list, `tools.description` with `{count}` for the description.
- **`components/category/CategorySchema.tsx`** — new. Four JSON-LD blocks per category: `CollectionPage` + `ItemList` (5–24 items) + `FAQPage` (5 questions) + `BreadcrumbList` (Home → Category). Mounted in `CategoryPage.tsx` before `.page` div.
- **`helpers/site.ts`** — new. `SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Toolyland'`, `getPublisher()` returns `{type: 'Organization', name: SITE_NAME, url: getBaseUrl()}`. Re-exported from `helpers/index.ts`.

**Brand identity**

- Logo: rounded square, navy background `#0F172A`, teal letter T `#14B8A6`, coral dot in top-right corner `#FB7185`.
- Wordmark: "toolyland" in bold sans-serif.

**Env vars**

- `NEXT_PUBLIC_SITE_URL=https://toolyland.com`
- `NEXT_PUBLIC_SITE_NAME=Toolyland`

**Messages**

- New key `categories.all.title` — "Categories" / "Категории". Used by `HomeSchema.ItemList.name`.

#### Changed

**JSON-LD refactor — unified publisher**

- `HomeSchema.tsx`, `CategorySchema.tsx`, `ToolsSchema.tsx`, `CalculatorSchema.tsx`, `ToolSchema.tsx` — all import `getPublisher()` from `@/helpers` instead of hardcoding `'ProjectName'`.
- `HomeSchema` — `WebSite` now has `@id = ${baseUrl}${localePath}#website`. `ItemList.name` changed from `categories.all.name` ("All Tools") to `categories.all.title` ("Categories") — semantically matches `numberOfItems: 6`.
- `CategorySchema` — `isPartOf` points to the site WebSite; `publisher: getPublisher()` added.
- `CalculatorSchema` / `ToolSchema` — `publisher: getPublisher()` (was inline objects with hardcoded name).

**URL in JSON-LD = canonical**

- `CalcLayout.tsx` / `ToolLayout.tsx` — `url` now built as `${baseUrl}${localePath}/${config.slug}`, where `localePath` comes from `getLocale()`. Previously `${baseUrl}/${slug}` — mismatch with canonical on RU pages.
- `CategorySchema` / `ToolsSchema` — same pattern: `localePath` appended.

**Locale-aware Link everywhere**

- Mass replace `import Link from 'next/link'` → `import {Link} from '@/i18n/navigation'` across the whole project.
- Affected: `EntryPreview.tsx`, `RelatedPreview.tsx`, `CategoryPage.tsx`, `BreadCrumbs.tsx`, `Footer.tsx`, and all View components with internal links.

**ICU plural for category.toolsCount (EN)**

- `en.json` — `"toolsCount": "{count, plural, one {# tool} other {# tools}}"` (was `"{count} tools"`). RU already had the 4-category form.

**Breadcrumb**

- `CategorySchema.BreadcrumbList` position 1 — `name: nav.home` ("Home" / "Главная"), `item: ${baseUrl}${localePath}`. Was `categories.all.name` ("All Tools") — semantic mismatch with the root URL.

#### Fixed

- **JSON-LD url mismatch on RU pages** — schemas emitted EN URLs (`/bmi-calculator`) while canonical was RU (`/ru/bmi-calculator`). Rich Results Test would flag "url mismatch". Fixed via `localePath`.
- **`ItemList.name` semantic mismatch** — HomeSchema had `name: "All Tools"` with `numberOfItems: 6` (categories). Rich Results Test would warn. Changed to "Categories".
- **`next/link` on RU pages** — internal links emitted EN URLs, forcing a redirect hop on every click. Fixed via locale-aware `Link` from `@/i18n/navigation`.
- **`category.toolsCount` EN missing plural** — would render "1 tools" if a category ever had one tool. Fixed with ICU plural.

#### Removed

- **`PUBLISHER_NAME` constants** from `HomeSchema.tsx` and `CategorySchema.tsx` — replaced by `getPublisher()`.
- **Inline `publisher` objects** in `CalculatorSchema.tsx` and `ToolSchema.tsx` — replaced by `getPublisher()`.

#### Infrastructure (decisions)

- **Hosting decision** — Vercel rejected after probe deploy: not accessible from RU without VPN (IP blocking + OCSP stapling issues on Hobby plan). Amvera chosen — Russian PaaS (290 ₽/mo "Начальный" tariff, SLA, RU + world availability).
- **Domain** — `toolyland.com` bought at Timeweb.
- **Deployment plan** — A-record + TXT from Amvera, DNS setup in Timeweb, automatic Let's Encrypt via Amvera.

#### Known limitations

- **Rich Results Test not yet run** — needs deployed site. Run after Amvera deploy.
- **Regression check not exhaustive** — 3–5 View vs texts still pending.
- **EN + RU proofread not done** in browser.
- **OG image + favicon set** — pending (tracked in [Unreleased]).
- **`related` uses `string[]`** — no compile-time check for typos. Typed union still in tech debt.
- **`publisher.name`** — now reads from `NEXT_PUBLIC_SITE_NAME`, fallback `'Toolyland'`. First deploy without env set will correctly use `'Toolyland'` — but should be set anyway to be explicit.