## [Unreleased]

### TODO

- **SEO-индексация** — дожать GSC sitemap («Успешно» через 24–48 часов), добавить sitemap в Яндекс.Вебмастер, привязать Метрику к Вебмастеру, настроить региональность, запустить переобход топ-10 URL (хабы и категории).
- **Гейтинг аналитики за cookie consent (GDPR)** — GA4 и Метрика грузятся всегда, независимо от согласия. Нужно: `analyticsAllowed` в контексте, CookieConsent переключает. **Обязательно до AdSense.**
- **Rich Results Test** — прогнать все JSON-LD через Google Rich Results Test. Страницы: `/`, `/tools`, `/finance`, `/ru/finance`, `/bmi-calculator`, `/ru/bmi-calculator`, `/invoice-generator`, `/json-formatter`, `/images-to-pdf`, `/income-tax-calculator`, `/unit-converter`, `/salary-slip-generator`, `/diff-checker`, `/hidden-character-finder`, `/percentage-calculator`. Проверить, что URL в JSON-LD = canonical.
- **Regression check** — открыть InvoiceGeneratorView, SalarySlipGeneratorView, ColorPickerView, RegexTesterView, JsonFormatterView, DiffCheckerView, HiddenCharacterFinderView, PercentageCalculatorView. Spot-check на 320 / 360 / 375.
- **Final EN + RU proofread** — все 76 инструментов × 2 локали в браузере.
- **`pdf-to-image`** — translations готовы, нет `data/tools/developer.ts` entry и View. `pdfjs-dist@6.3.289` установлен. План: `kind: 'pdf-to-image'`, category `developer`, `isWide: true`, worker через `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)`, page range (`1-5, 8, 11-13`), PNG / JPEG / WebP, scale 1× / 1.5× / 2× / 3×, grid preview + ZIP. `loadingTask.destroy()`. При реализации — вернуть `pdf-to-image` в `related` у `images-to-pdf`.
- **`lucide-react` cleanup** — `UuidGeneratorView.tsx`, `BreadCrumbs.tsx`, `DiffCheckerView.tsx`, `HiddenCharacterFinderView.tsx`. `grep -rn "lucide-react" components/`.
- **Tap targets** — `h-8` → `h-9 sm:h-8` или `h-10 sm:h-8`. Sweep с `grep -rn 'size="sm"' components/tool/`.
- **OG-image** — `og-default.jpg` (1200×630). Figma: navy фон, `toolyland-wordmark.svg` слева, tagline «Free online tools. No signup.» справа.
- **Contact emails** — `privacy@toolyland.com`, `hello@toolyland.com` через Cloudflare Email Routing или Yandex Mail for Domain.
- **Cookie consent — revoke mechanism** — GDPR требует возможность отзыва. Ссылка «Manage cookies» в футере.
- **Privacy page — clickable links** — `adssettings.google.com`, `policies.google.com/technologies/partner-sites` сейчас plain text. Обернуть в `<a target="_blank" rel="noopener">`.
- **Locale refactor в `data/**`** — hardcoded `'en-US'` → `ctx.locale`. Affects: `finance.ts` (`formatInt` / `formatAmount`), `age-calculator`, `date-difference-calculator`, `pregnancy-due-date-calculator`.
- **Percentage-calculator — polish**: история вычислений (localStorage, max 20), копирование выражения (OutputPanel `actions` или `secondaryCopy`), круговая диаграмма (SVG).
- **/news — развитие**: client-side «Load more» при 20+ записях, отдельный OG-образ.
- **`salary-slip-generator.payPeriod`** — text input → два `<Select>` (Month + Year).
- **Extract `CurrencySelect`** — `CURRENCIES` / `CURRENCY_SYMBOLS` дублируются в 3 файлах.
- **`types/common.ts`** — извлечь `FAQItem` (дублируется). Merge `FeatureItem` и `HowToStep`.
- **`images-to-pdf`** — PDF filename из `<title>`; quality slider не влияет на печать; колонтитулы Chrome.
- **`image-compressor`** — target file size mode (binary search on quality).
- **`CURRENT_YEAR`** — useMemo.
- **Wave 6 — interactive trackers** — `pomodoro-timer`, `habit-tracker`, `decision-maker`, `meeting-cost-calculator`, `trip-planner`, `bill-splitter`, `lead-tracker`, `resume-builder`, `visiting-card-generator`, `api-response-mock-generator`.
- **`text-to-svg-generator`** (бонусный 84-й) — regex + shape / color / icon dictionary.
- **AdSense** — connect `NEXT_PUBLIC_ADSENSE_CLIENT`. Submit после 2–3 месяцев стабильного трафика. Prerequisites: contact emails + cookie revoke + OG image + гейтинг аналитики.
- **Link building (долгосрочно)** — каталоги, соцсети, крауд-маркетинг, гостевые статьи, digital PR, HARO/Connectively. Никаких PBN.
- **Related slug typization** — `string[]` не ловит опечатки. Рассмотреть `Slug` union.
- **`getToolCount()` is sync** — ок до ~1000 entries.
- **Custom unit plural in labels** — `global.units.{months, years, ...}` как простые строки.
- **Sidebar state resets on locale switch**, **active category link** (сейчас `===`), **meta-tag-generator preview titles** hardcoded EN.

## [0.19.0] - 2026-10-10

### Added

- **`priority?: number` in `BaseConfig`** — optional sort priority within a category. Higher — first. Default 0. Used by `getAllCategories()` (sidebar) and `getRegistryEntriesByCategory()` (category page). First user: `percentage-calculator` — `priority: 1` — pinned to the top of `finance`.
- **Smart mode in percentage calculator** — parses natural-language expressions in EN and RU: `20% of 95`, `15 is what percent of 60`, `45 is 30% of what`, `from 80 to 100`, `100 + 20%`, and Russian equivalents (`20% от 95`, `15 от 60 в процентах`, `45 это 30% от чего`, `с 80 на 100`, `100 плюс 20%`). 10 regexes, `%` / `percent` / `процент`, `+` / `плюс` / `-` / `минус`, `of` / `от`, `с...на` / `from...to`, `→` / `->`. Accepts both `.` and `,` as decimal separator.
- **URL sync in percentage calculator** — via `history.replaceState` on every input change. `?mode=of&x=20&y=95`, `?mode=smart&q=25%25+of+95`, etc.
- **Clickable suggestion chips** in Smart mode — 5 examples per locale. Click fills the input.
- **Step-by-step solution** in all 6 modes — `<details>` block with 4 steps: Formula / Substitution / Calculation / Answer.
- **`/news` page** (EN + RU) — short announcements of updates, changes and releases. Single route, no pagination, entries addressable via anchors `#<slug>`.
  - **Data:** `data/news/{types,index}.ts` + one file per entry `<YYYY-MM-DD>-<slug>.ts`. `getAllNews()` sorts descending by date.
  - **UI:** `app/[locale]/news/page.tsx`, `components/news/NewsPage.tsx`, `components/news/NewsCard.tsx`.
  - **Texts:** in `messages/{en,ru}.json` under `news.items.<slug>.{title,excerpt}`. Dates localized via `Intl.DateTimeFormat(locale, ...)`.
  - **Tags:** `release` / `feature` / `fix` / `announcement` — visual badges only.
  - **First two entries:** `toolyland-launch` (08.10) and `percentage-calculator-rework` (10.10).
- **RSS 2.0 feeds** — `app/feed.xml/route.ts` (EN) + `app/[locale]/feed.xml/route.ts` (RU). Last 20 entries. `Content-Type: application/rss+xml; charset=utf-8`, cache `max-age=3600`.
  - **Helper:** `helpers/rss.ts` → `buildRssFeed(options)`, custom XML builder, no external dependencies.
  - **Autodiscovery:** `generateMetadata.alternates.types` on `/[locale]/news/page.tsx`.
- **`NewsTeaser` on the home page** — 2 most recent entries + «See all updates →». Placed between `HomeFaq` and `PrivacyNote`. Styled after `FeaturedTools`.
- **Sidebar link** — «What's new» with RSS icon, positioned before «All tools».
- **Footer link** — «What's new» / «Что нового» in the footer nav.

### Changed

- **`percentage-calculator` migrated from `CalculatorConfig` to `ToolConfig`.** New file `data/tools/finance.ts`, connected in aggregator. Slug, category (`finance`) and related links unchanged.
- **`PercentageCalculatorView` rewritten from scratch** (`components/tool/PercentageCalculatorView.tsx`). 6 modes: `smart` (default) / `of` / `what` / `ofwhat` / `change` / `plusminus`. Live recalc — no Calculate button. `OutputPanel` renders result + expression + secondary values.
- **Types:** `ToolKind += 'percentage-calculator'`, new `PercentageCalculatorConfig`, added to `ToolConfig` union.
- **All texts rewritten** — `howToUse` (5 steps), `features` (6), `useCases` (5), `description`, `metaDescription`, `keywords`. FAQ kept (6 questions).
- **Translations restructured** — new `modes.*`, `fields.*`, `steps.*` (incl. `steps.formulas.*`), `smartPlaceholder`, `smartExamples` (array), `secondary.change.*`, `secondary.plusminus.*`. Removed unused: `inputs.*`, `options.*`, `secondary.formula/from/to/difference`, `smartWip`.
- **`app/sitemap.ts`** — added `/news` and `/ru/news` with priority **0.3**.
- **`data/categories.ts`** — `getAllCategories()` sorts tools inside a category by `priority`.
- **`components/shared/Footer.tsx`** — third link added, uses `tNews('h1')`.

### Fixed

- **FAQ silently disappeared** in percentage calculator after migration. Root cause: `faq` field was not carried over to the new `ToolConfig`. `ToolLayout` renders FAQ conditionally → FAQ + JSON-LD `FAQPage` both vanished without a build error. Restored.
- **`news.seeAll` rendered as raw key** — missing translation key. Added to `messages/{en,ru}.json`.
- **RSS Route Handlers crashed** with `Route /[locale]/feed.xml used import('next/root-params').locale() inside a Route Handler`. Root cause: `next-intl`'s `getRequestConfig` uses `getRootLocale()` which is not supported in Route Handlers (Next.js 16). Fix: read translations directly from `messages/{en,ru}.json`.

### Notes

- **Migration recipe CalculatorConfig → ToolConfig:** check that `faq`, `related`, `publishedAt` are carried over. `faq` is conditional-render and fails silently.
- **`t.raw()` for arrays** — `smartExamples` must be read via `t.raw('smartExamples') as string[]`.
- **`/news` — не SEO-тяжеловес.** No JSON-LD, no pagination, no hreflang cascade. If entries exceed ~20 — client-side «Load more», not routes.

## [0.18.0] - 2026-10-09

### Added

- **`hidden-character-finder`** — new tool in the `text` category. Detects invisible / look-alike characters inside text: Latin vs Cyrillic homoglyphs, zero-width spaces, BOM, non-breaking spaces, soft hyphens. RadioGroup-based selector (single choice), customizable highlight color, Word export.
- **Google Analytics 4** — Measurement ID `G-SFL7WLPZQ9`. Component: `<GoogleAnalytics gaId={...} />` from `@next/third-parties/google`. Env: `NEXT_PUBLIC_GA_ID`.
- **Yandex Metrica** — counter `113572886`, Webvisor + scroll map + form analytics enabled. Own component `components/analytics/yandex-metrica.tsx` on `next/script` with `strategy="afterInteractive"`, SPA-navigation hook (`history.pushState` / `replaceState` + `popstate`), and `<noscript>` fallback. Env: `NEXT_PUBLIC_YM_ID`.
- **Google Search Console** — domain verified via DNS TXT. Sitemap submitted (`sitemap.xml`, filename only).
- **Yandex.Webmaster** — domain verified via DNS TXT, role: Owner.
- **`meta.site`** site-wide block, JSON-LD coverage across all pages (WebApplication / CollectionPage / FAQPage / HowTo / ItemList / BreadcrumbList), `helpers/site.ts → getPublisher()`, `getToolCount()` + ICU plural for `category.toolsCount`.

### Changed

- **`diff-checker` reworked** — three comparison granularities: **Lines / Words / Chars**. Character and word modes render an inline view with red/green highlighting inside the line. Stats counters adapt to the selected granularity. Word export added.
- **`text` category related links** — cluster updated: `word-counter ↔ case-converter ↔ lorem-ipsum-generator ↔ diff-checker ↔ number-to-words-converter ↔ hidden-character-finder`.
- **Env vars added in Amvera dashboard** — `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_YM_ID`, all on the **Build** stage (required for `NEXT_PUBLIC_*` inlining).
- **All `<Link>` components locale-aware** — migrated to `@/i18n/navigation` everywhere.
- **Yandex SEO** — Clean-param added to `robots.ts`, `changefreq` removed from `sitemap.ts`.

### Fixed

- **`diff-checker` FAQ q6** — closes the contradiction with the new inline UI. Previous version said "no", now says "yes".

### Notes

- **Known issues carried into [Unreleased]:** diffChars performance on inputs >100 KB in Chars mode; invalid surrogate pairs handling in hidden-character-finder; Word export logic to be extracted into `helpers/export-to-word.ts`; `DiffCheckerView` and `HiddenCharacterFinderView` still import from `lucide-react`.
- **Analytics not gated by cookie consent** — technical debt. Must fix before AdSense.

## [0.17.0] - 2026-10-08

### Added

- **Diff checker — word- and character-level comparison.** New granularity switch (Lines / Words / Chars). Character and word modes render an inline view with red/green highlighting inside the line, so a one-symbol change in a long ID is visible without coloring the entire line. Stats counters adapt to the selected granularity (lines / words / chars).
- **Deploy to Amvera.** Site is live at https://toolyland.com. Tariff «Начальный», Let's Encrypt issued automatically, DNS on Timeweb.

### Changed

- **`about.intro`** rewritten to first-person singular. Removed the contradiction with the privacy policy ("nothing is stored or tracked") — the new text acknowledges that comparison runs locally and mentions the privacy policy link.
- **`config.diff-checker`** (EN + RU): description, metaDescription, keywords, features (4 → 7), howToUse (added granularity step), useCases (4 → 5), FAQ (6 → 7 questions). Titles fit within 60 chars.
- **`rent-vs-buy` FAQ a5:** replaced the jargon-filled "manually deduct the annual savings from the cash outflow" with plain wording that tells the user what to do next.

### Fixed

- **`diff-checker` FAQ q6** now says "yes" to inside-the-line diff — the previous q5 said "no" and directly contradicted the new UI. FAQ JSON-LD would have flagged a mismatch between markup and behaviour.

## [0.16.0] - 2026-10-07

### Brand identity, favicon set, localized metadata, legal pages rewrite

#### Added

**Brand identity — logo set**

- **Three SVG variants** in `public/brand/`:
  - `toolyland-icon.svg` — rounded square, navy `#0F172A` background, teal `#14B8A6` letter T, coral `#FB7185` dot in top-right corner. Used for favicon, app icons, avatars.
  - `toolyland-compact.svg` — icon + "oolyland" wordmark (T in icon = first letter). Used in sidebar, mobile header.
  - `toolyland-wordmark.svg` — "Toolyland" text-only in Inter Bold (700), navy fill. Used for documents, email signatures, OG-image.
- **Wordmark typography** — Inter Bold 700, letter-spacing `-1.5%`, size `65`.
- **`components/shared/Logo/Logo.tsx`** — new component. Uses `next/image` with static import of `toolyland-compact.svg`.

**Favicon set (via toolyland.com/favicon-generator)**

- `public/favicon.ico` — multi-size (16/32/48) ICO, generated by own tool.
- `public/favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`, `favicon-96x96.png`.
- `public/apple-touch-icon.png` (180×180).
- `public/icon-192x192.png`, `icon-512x512.png` (PWA).
- `public/site.webmanifest` — `name` / `short_name` = `Toolyland`, `theme_color` / `background_color` = `#0F172A`, `display: standalone`.

**Localized metadata**

- **`meta.site` block** in `messages/{en,ru}.json`.
- **`generateMetadata` in `app/[locale]/layout.tsx`** — replaces old static `export const metadata`.
- **Full metadata block** — `applicationName`, `authors`, `creator`, `publisher`, icons (7 entries), `manifest`, `openGraph`, `twitter`, `robots`.

**Viewport theme color**

- `viewport.themeColor` — array of two media-query entries: light `#ffffff`, dark `#0F172A`.

**About page — audience section**

- New `about.audience` block with six audience entries.

**Privacy policy — full rewrite**

- New section structure: `tools` / `storage` / `cookies` / `analytics` / `ads` / `rights` / `changes` / `contact`.
- Explicit acknowledgment of Google Analytics 4, Yandex Metrica (with Webvisor), Google AdSense.
- GDPR / UK GDPR / CCPA rights section.
- Contact email `privacy@toolyland.com`.

**favicon-generator improvements** (own tool, self-hosted)

- Multi-size `.ico` output — 16/32/48 PNG entries embedded in ICO container.
- Transparent background checkbox.
- Own `ColorPicker` component.
- `readme` template moved to `messages/{en,ru}.json`.
- Auto-regenerate on option change.

#### Changed

**Voice and copy**

- `about` block rewritten from first-person singular.
- `about.intro` now explicitly lists audiences.
- New `about.mission.points.universal`.
- Fixed duplicate line in `about.offer.textTools`.

**Metadata refactor**

- `app/[locale]/layout.tsx` — `export const metadata` → `export async function generateMetadata({params})`.
- Title template removed.
- `SITE_DESCRIPTION` constant removed.

**SearchTrigger caret fix**

- Position — `align-text-bottom` removed, `translate-y-[0.15em]` added.
- Animation — `animate-pulse` → `animate-[caret-blink_1s_steps(2,start)_infinite]`.

**README.md**

- Link to live site moved to first line: `**[toolyland.com](https://toolyland.com)**`.

#### Fixed

- **Favicon ignored** — `app/favicon.ico` was overriding `metadata.icons`. Removed.
- **Privacy policy contradicted reality** — rewritten.
- **About page voice mismatch** — "мы делаем" replaced with "я решил сделать".
- **About duplicate line**.

#### Infrastructure (decisions)

- **OG-image deferred** — `/og-default.jpg` doesn't exist yet.
- **Contact emails deferred** — referenced but not created.

#### Known limitations

- **OG-image missing**.
- **Contact emails missing**.
- **Cookie consent lacks revoke UI**.
- **Privacy policy links not clickable**.
- **Rich Results Test not yet run**.
- **Regression check not exhaustive**.
- **EN + RU proofread not done**.