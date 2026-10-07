# Toolyland

Free, fast, privacy-first online tools. Calculators, text utilities, generators, and developer tools that run 100% in your browser. No signup required.

Live at [toolyland.com](https://toolyland.com). Deployed from GitHub.

Built with Next.js 16 + React 19 + TypeScript + Tailwind CSS 4. Monorepo-free, no `src/`.

## Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16.3.6 (App Router, Turbopack) |
| UI | React 19.2.8, Tailwind CSS 4, shadcn/ui on Base UI |
| Language | TypeScript 5 (target ES2020) |
| i18n | next-intl 4.14.9 (`en`, `ru`, `localePrefix: 'as-needed'`) |
| Theming | next-themes (light / dark / system) |
| Icons | @animateicons/react 0.9.0 (Hugeicons + Lucide animated sets) |
| Fonts | Inter + Geist Mono (`next/font/google`) |
| Lint/Format | Biome 2.4.2 (not ESLint) |
| Package manager | pnpm 10.13.1 |
| Git hooks | Husky + lint-staged |
| Search | fuse.js (`useTokenSearch`) |
| Number spelling | n2words 6.2.0 (30+ languages) |
| Color picker | react-colorful (SV square + hue slider) |
| Markdown | marked + isomorphic-dompurify |
| JS minify | terser (safe mode) |
| QR / Barcode | qrcode, jsbarcode |
| Hashing | spark-md5 (MD5) + Web Crypto (SHA) |
| Diff | diff |
| PDF → image | pdfjs-dist 6.3.289 |
| ZIP archive | jszip |
| **Hosting** | **Amvera** (tariff «Начальный», 290 ₽/mo, SLA) |
| **Domain** | **toolyland.com** (registered at Timeweb) |
| **SSL** | Let's Encrypt (automatic via Amvera) |

## Getting Started

Run:

    pnpm install
    pnpm dev

Open http://localhost:3000.

### Scripts

    pnpm dev          # start dev server
    pnpm build        # production build
    pnpm start        # run production build
    pnpm lint         # biome check
    pnpm lint:fix     # biome check --write
    pnpm format       # biome format --write
    pnpm ts:check     # tsc --noEmit

### Environment

Create `.env.local`:

    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    NEXT_PUBLIC_SITE_NAME=Toolyland

In production (Amvera):

    NEXT_PUBLIC_SITE_URL=https://toolyland.com
    NEXT_PUBLIC_SITE_NAME=Toolyland

Both are used by `sitemap.ts`, `robots.ts`, canonical URLs, hreflang, Open Graph, and JSON-LD `publisher`. `NEXT_PUBLIC_*` vars are **inlined at build time** — after changing them, rebuild.

## Deployment

Hosted on **Amvera** (Russian PaaS, similar UX to Vercel). Chosen because Vercel is **blocked in RU** without VPN (IP blocking + OCSP stapling issues on Hobby plan).

Setup steps:

1. Create project in Amvera, connect GitHub repo.
2. Tariff «Начальный» (290 ₽/mo, includes SLA). «Пробный» (170 ₽/mo) has no SLA — not recommended for AdSense monetization.
3. Add custom domain `toolyland.com` in Amvera project settings → get A-record IP + TXT verification value.
4. In Timeweb DNS: A `@` → Amvera IP, A `www` → same IP, TXT `@` → verification value.
5. Wait for propagation → Let's Encrypt SSL issued automatically.
6. Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_SITE_NAME` in Amvera env vars → rebuild.

Verify after deploy: site is reachable from RU (home internet + mobile operators) **and** from the world (VPN check).

## Project structure

    .
    ├── app/
    │   ├── [locale]/
    │   │   ├── layout.tsx              ← root layout (html, body, ThemeProvider, Sidebar, Footer, CookieConsent, viewport: viewportFit 'cover')
    │   │   ├── page.tsx                ← home (HomeSchema + Hero + CategoryCards + FeaturedTools + RecentlyAdded + HomeFaq + PrivacyNote)
    │   │   ├── not-found.tsx           ← 404
    │   │   ├── [slug]/page.tsx         ← dispatcher: calculator or tool
    │   │   ├── tools/page.tsx          ← full catalog (ToolsSchema + ToolGrid)
    │   │   ├── about/page.tsx
    │   │   ├── privacy/page.tsx
    │   │   ├── finance/page.tsx        ← category hub (static)
    │   │   ├── health/page.tsx         ← category hub (static)
    │   │   ├── text/page.tsx           ← category hub (static)
    │   │   ├── developer/page.tsx      ← category hub (static)
    │   │   ├── generators/page.tsx     ← category hub (static)
    │   │   └── business/page.tsx       ← category hub (static)
    │   ├── globals.css                 ← Tailwind + shadcn tokens + fonts + print CSS
    │   ├── robots.ts                   ← Yandex block with Clean-param
    │   └── sitemap.ts                  ← CONTENT_LASTMOD, no changefreq
    │
    ├── components/
    │   ├── calculator/
    │   │   ├── CalcLayout.tsx          ← server layout for calculator pages
    │   │   ├── CalculatorForm.tsx      ← form + result (client), passes {locale} to calculate
    │   │   ├── CalculatorSchema.tsx    ← JSON-LD WebApplication + FAQPage + HowTo (server)
    │   │   └── SliderField.tsx         ← slider input with editable min/max, cursor preservation
    │   ├── tool/
    │   │   ├── ToolLayout.tsx          ← server layout for tool pages (isWide for wide tools)
    │   │   ├── ToolView.tsx            ← switch by kind + assertNever
    │   │   ├── ToolSchema.tsx          ← JSON-LD WebApplication + FAQPage + HowTo
    │   │   └── *View.tsx               ← one view per tool kind (45 total)
    │   ├── tools/
    │   │   └── ToolsSchema.tsx         ← JSON-LD CollectionPage + ItemList (75 tools)
    │   ├── category/
    │   │   ├── CategoryPage.tsx        ← shared category hub template (server)
    │   │   └── CategorySchema.tsx      ← JSON-LD CollectionPage + ItemList + FAQPage + BreadcrumbList
    │   ├── shared/
    │   │   ├── FAQ.tsx                 ← shared FAQ block (accepts namespace)
    │   │   ├── Related.tsx             ← 4 related preview cards (client)
    │   │   ├── RelatedPreview.tsx      ← compact preview card for Related block
    │   │   ├── EntryPreview.tsx        ← main catalog card (client, i18n Link)
    │   │   ├── InputPanel.tsx          ← textarea panel with header + copy
    │   │   ├── OutputPanel.tsx         ← output panel with copy + optional download
    │   │   ├── CopyButton.tsx          ← copy-to-clipboard button
    │   │   ├── ExpandableSplit.tsx     ← split-view with fullscreen dialog
    │   │   ├── CardPreview.tsx         ← legacy tool card preview (see TODO — check usage)
    │   │   ├── Highlight.tsx           ← search-match highlighting
    │   │   ├── HowToUseSection.tsx     ← renders howToUse (numbered grid)
    │   │   ├── FeatureSection.tsx      ← renders features (checkmark grid)
    │   │   ├── ContentSection.tsx      ← generic list renderer (useCases, fallback)
    │   │   ├── BreadCrumbs.tsx         ← navigation breadcrumbs (i18n Link)
    │   │   ├── Footer.tsx              ← site-wide footer
    │   │   └── ShareButton.tsx         ← navigator.share + clipboard fallback
    │   ├── home/
    │   │   ├── HomeSchema.tsx          ← WebSite (@id) + ItemList + FAQPage
    │   │   ├── Hero.tsx                ← hero + search + suggestion chips + typewriter
    │   │   ├── CategoryCards.tsx       ← 6 category cards with animated icons
    │   │   ├── FeaturedTools.tsx       ← 18 seeded-random tools + CTA to /tools
    │   │   ├── RecentlyAdded.tsx       ← top 6 by publishedAt
    │   │   ├── HomeFaq.tsx             ← 3 questions, namespace="home"
    │   │   ├── PrivacyNote.tsx         ← trust-signal block (renamed from Footer)
    │   │   ├── Stats.tsx               ← «{count}+ tools» linkable → /tools
    │   │   └── ToolGrid.tsx            ← full catalog with filters, used on /tools only
    │   ├── layout/
    │   │   ├── AppSidebar.tsx          ← sidebar with "All tools" + categories
    │   │   ├── CategoryIcon.tsx
    │   │   ├── LocaleSwitcher.tsx
    │   │   ├── SidebarSettings.tsx
    │   │   └── ThemeToggle.tsx
    │   ├── providers/
    │   │   ├── theme-provider.tsx
    │   │   └── sidebar-state-provider.tsx
    │   ├── search/
    │   │   ├── SearchModal.tsx         ← controlled by query prop
    │   │   ├── SearchProvider.tsx      ← context {isOpen, open(query?), close}
    │   │   └── SearchTrigger.tsx       ← full / icon variants, optional typewriter placeholders
    │   ├── cookie-consent.tsx
    │   └── ui/                         ← shadcn primitives (Base UI)
    │       ├── accordion.tsx, badge.tsx, button.tsx, calendar.tsx
    │       ├── checkbox.tsx, collapsible.tsx, color-picker.tsx, command.tsx
    │       ├── date-picker.tsx, dialog.tsx, dropdown-menu.tsx
    │       ├── input.tsx, input-group.tsx, label.tsx
    │       ├── popover.tsx, search-icon.tsx, segmented-control.tsx, select.tsx
    │       ├── separator.tsx, sheet.tsx, sidebar.tsx
    │       ├── skeleton.tsx, slider.tsx, textarea.tsx
    │       ├── toggle.tsx, toggle-group.tsx, tooltip.tsx
    │
    ├── data/
    │   ├── index.ts                    ← re-exports everything
    │   ├── registry.ts                 ← unified registry (calculators + tools)
    │   ├── categories.ts               ← 6 categories (slug + icon + color tokens)
    │   ├── calculators/
    │   │   ├── index.ts
    │   │   ├── finance.ts              ← 15 finance calculators
    │   │   └── health.ts               ← 15 health calculators
    │   └── tools/
    │       ├── index.ts
    │       ├── developer.ts            ← 24 developer tools
    │       ├── text.ts                 ← 5 text tools
    │       ├── generators.ts           ← 9 generators + image tools
    │       ├── business.ts             ← 7 business tools
    │       ├── unit-categories.ts
    │       ├── license-templates.ts
    │       └── gitignore-templates.ts
    │
    ├── helpers/
    │   ├── index.ts                    ← assertNever, getBaseUrl, getPublisher, SITE_NAME, seededShuffle, getToolCount, buildCategoryMetadata
    │   ├── site.ts                     ← SITE_NAME (env), getPublisher() → Organization
    │   ├── array.ts                    ← seededShuffle<T>(arr, seed)
    │   ├── tool-count.ts               ← getToolCount() = getAllRegistryEntries().length
    │   ├── getBaseUrl.ts               ← single source of BASE_URL
    │   ├── og-locale.ts                ← getOgLocale(locale) → 'en_US', 'ru_RU'
    │   ├── buildCategoryMetadata.ts    ← shared generateMetadata for category routes
    │   └── utils/
    │       ├── colors.ts               ← hexToRgb, rgbToHex, rgbToHsl, contrastRatio, WCAG
    │       ├── base64-image.ts         ← blobToDataUri, bytesToBase64, parseBase64Image
    │       └── median-cut.ts           ← extractPalette for color-palette-extractor
    │
    ├── hooks/
    │   ├── use-event.ts                ← stable useCallback wrapper
    │   ├── use-smooth-progress.ts      ← smoothed progress for long-running operations
    │   ├── use-search-index.ts         ← Fuse.js index built from current locale messages
    │   └── use-typewriter.ts           ← cyclic character-by-character typing for Hero
    │
    ├── i18n/
    │   ├── navigation.ts               ← Link, useRouter, usePathname
    │   ├── request.ts                  ← getRequestConfig (next/root-params)
    │   └── routing.ts                  ← locales: ['en','ru']
    │
    ├── messages/
    │   ├── en.json                     ← includes `categories` root block + `global.units` + `global.share`
    │   └── ru.json
    │
    ├── types/
    │   ├── index.ts
    │   ├── common.ts                   ← FAQItem, CategorySlug, Tag, BaseConfig (with mandatory metaDescription), Values, Option (+params), OperationResult (+params), ResultRange, InputField, IconHandle, IconProps, FeatureItem, HowToStep
    │   ├── calculator.ts               ← CalculatorConfig (+ CalcContext with locale)
    │   └── tool.ts                     ← ToolConfig (discriminated union)
    │
    ├── proxy.ts                        ← next-intl middleware
    ├── next.config.ts                  ← createNextIntlPlugin
    ├── tsconfig.json                   ← paths @/*
    ├── biome.json                      ← Biome (not ESLint)
    ├── postcss.config.mjs              ← @tailwindcss/postcss
    └── package.json

## Architecture

- **Data → Helpers → UI → Routing.** All math runs on the client; the server only ships HTML.
- **Routing:** flat URLs `/[locale]/[slug]` for tools, `/[locale]/<category>` for the six SEO category hubs, and `/[locale]/tools` for the full catalog. Category hubs are **static folders** (`finance/page.tsx`, `health/page.tsx`, …), not a dynamic `[category]` route — a dynamic `[category]` conflicts with `[slug]` in Next.js App Router (`You cannot use different slug names for the same dynamic path`).
- **SSG:** every page is statically generated via `generateStaticParams`. Category pages are static by definition (one slug per file).
- **i18n:** `next-intl` v4 with `localePrefix: 'as-needed'` (EN without prefix, RU with `/ru`).
- **Universal by design.** No country-specific tools, formulas or currencies. Every calculator works in any country. Locale-aware number and date formatting is threaded through `calculate`.
- **OG locale:** `og:locale` requires the `language_TERRITORY` format (`en_US`, `ru_RU`), not raw BCP-47. Use `getOgLocale(locale)` from `@/helpers/og-locale` in every `generateMetadata` that emits Open Graph.
- **Locale-aware Link:** always use `import {Link} from '@/i18n/navigation'`, never `next/link`. The plain `next/link` doesn't add the locale prefix, so a click from `/ru/finance` would emit an EN URL and force a redirect hop. See `EntryPreview`, `RelatedPreview`, `CategoryPage`, `BreadCrumbs`, `Footer`.
- **JSON-LD url = canonical.** Every schema must build URLs as `${baseUrl}${localePath}/...`. A locale-agnostic `${baseUrl}/slug` causes a mismatch with canonical on RU pages (Rich Results Test flags "url mismatch").

### Two independent data systems

1. **Calculators** (`CalculatorConfig`) — classic "inputs → calculate → one result". Configs live in `data/calculators/<category>.ts`. `calculate()` is a function, so it cannot cross the server/client boundary — client components receive `slug: string` and resolve the config via `getCalculatorBySlug(slug)`.

2. **Tools** (`ToolConfig`, discriminated union by `kind`) — everything that doesn't fit "inputs → calculate" (formatters, converters, generators, form+preview builders, file processing). Configs live in `data/tools/<category>.ts`. Each `kind` has its own view component in `components/tool/`.

The **registry** (`data/registry.ts`) unifies both: `getRegistryEntry(slug)`, `getAllRegistryEntries()`, `getRegistryEntriesByCategory(category)`. The `[slug]/page.tsx` dispatcher resolves through the registry and renders `CalcLayout` or `ToolLayout`.

### Home page composition

The home page (Phase A/B/C restructure) has a fixed component order:

    HomeSchema → Hero → CategoryCards → FeaturedTools → RecentlyAdded → HomeFaq → PrivacyNote

- **HomeSchema** — server component, emits WebSite (`@id`) + Organization + ItemList (6 categories, `name` from `categories.all.title`) + FAQPage (3 Q) as JSON-LD. No `SearchAction` — search is client-side only, no `?q=` URL.
- **Hero** — client, badge + h1 + subtitle + `SearchTrigger` (`h-11 sm:h-14`) with typewriter placeholders + 6 suggestion chips + Stats.
- **CategoryCards** — 6 category cards linking to `/{slug}`, animated icons on hover.
- **FeaturedTools** — 18 deterministic-random tools (`seededShuffle(all, 42)`) + "Browse all {count} tools →" CTA.
- **RecentlyAdded** — server, top 6 by `publishedAt`, `null` when empty.
- **HomeFaq** — 3 questions, reuses `shared/FAQ` with `namespace="home"`.
- **PrivacyNote** — trust-signal block ("100% private / no upload"), renamed from `home/Footer.tsx`. Closing signal.

The `/tools` route moved the full catalog with filters off the home page. Before the split, category hubs had no in-content links from home — all six were reached only via the sidebar.

### Category hubs

Six static routes: `app/[locale]/{finance,health,text,developer,generators,business}/page.tsx`. Each is a thin wrapper:

    export async function generateMetadata({params}) {
      const {locale} = await params
      return buildCategoryMetadata(locale, 'finance')
    }

    export default function FinancePage() {
      return <CategoryPage slug="finance" />
    }

`CategoryPage.tsx` is a **server component** that renders: `<CategorySchema slug={slug} />` → header (`h1` + intro) → tools count → tool grid → CTA to `/tools` → SEO blocks (`HowToUseSection`, `FeatureSection`, `ContentSection` for useCases) → `FAQ`.

All category content lives in a single root-level `categories` block in `messages/{en,ru}.json`:

- `name`, `shortName`, `h1`, `title` (for `categories.all` only)
- `metaTitle`, `metaDescription`, `keywords`
- `intro`
- `howToUseTitle` + `howToUse` (array of `{title, description}`)
- `featuresTitle` + `features` (array of `{title, description}`)
- `useCasesTitle` + `useCases` (array of strings)
- `faq` (5 questions per category — `q1..q5` / `a1..a5`)

Plus `categories.all` — for the "All Tools" filter, the sidebar "All tools" entry, and `HomeSchema.ItemList.name` (`categories.all.title` = "Categories"). Nothing is duplicated in `home.categories`, `home.filters`, or `category.title` — those blocks were removed.

### Related tools

Every tool config has a mandatory `related: string[]` field with 4 slugs. `Related` renders them as a grid of `RelatedPreview` cards. Rules:

- All slugs from the **same category** — categories stay closed clusters.
- No self-references, no duplicates within a single array.
- Graph is organized by semantic cluster (e.g. finance: credits, investments, purchases, income, utility; developer: encoding, generators, formatters, color, regex, images).
- `related` is typed `string[]` — no compile-time check. A typo renders as a broken card silently. Verify slugs against `getRegistryEntry` manually when adding new tools.
- **`lorem-ipsum` vs `lorem-ipsum-generator`** — the actual slug is the long form. Fixed in v0.13.0.
- **`pdf-to-image`** — orphaned (translations exist, no data entry). Removed from `images-to-pdf.related`. Restore when the View lands.
- Full verification of all 300 related links across 75 tools completed in v0.15.0 — 0 broken, 0 self-ref, 0 duplicates.

### Tool count parametrization

**Never hardcode "75" in messages or components.** Use `getToolCount()` from `@/helpers` (returns `getAllRegistryEntries().length`). In messages use ICU `{count}`:

    "meta.tools.description": "Browse all {count} free online tools — ..."
    "tools.description": "{count} free tools across six categories — ..."

For counts that need pluralization, use full ICU:

    "viewAll": "Browse all {count, plural, one {# tool} other {# tools}}"
    "viewAll": "Все {count, plural, one {# инструмент} few {# инструмента} many {# инструментов} other {# инструмента}}"
    "toolsCount": "{count, plural, one {# tool} other {# tools}}"

**RU ICU plural requires 4 categories** (`one` / `few` / `many` / `other`). Omitting `many` renders a literal template string. EN requires 2 (`one` / `other`).

### Global unit translations

All physical and temporal units live in `global.units.*` in `messages/{en,ru}.json`:

    km, m, cm, mm, kg, g, bpm, months, years, days, weeks, hours, minutes, nights

In `data/calculators/*.ts` use unprefixed keys:

    {name: 'height', unit: 'units.cm', ...}
    {name: 'age',    unit: 'units.years', ...}

`CalculatorForm` resolves `input.unit` in three steps: `tConfig.has(unit)` → `tGlobal.has(unit)` → raw string fallback. Never render raw translation keys in UI — if a unit is missing, it silently falls through.

Units are simple strings (not ICU plural) — as field labels, they are grammatically neutral for any value: `Возраст (лет)`, `Сон (ч)`. Plural per-value agreement is deferred; if needed, migrate to `t(unit, {count: value})`.

### Locale-aware calculations

`calculate` receives a second argument `ctx?: CalcContext` with the current UI locale:

    calculate: (values, {locale}) => {
      const fmt = (n: number) =>
        Number.isFinite(n) ? Math.round(n).toLocaleString(locale) : '—'
      const fmtDate = (d: Date) =>
        d.toLocaleDateString(locale, {year: 'numeric', month: 'short', day: 'numeric'})
      // ...
    }

- Locale tag is a short BCP-47 (`'en'`, `'ru'`, `'de'`) — valid, no region mapping needed.
- If the calculator doesn't need locale, keep `calculate: (values) => ...` without the second argument.
- Do not create global `formatInt` / `formatAmount` — define a local `fmt` inside each `calculate`.
- For currencies use `new Intl.NumberFormat(locale, {style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2})`. Cache with `useMemo([locale, currency])`.

### ICU params in results

`Option` and `OperationResult` support `params: Record<string, string | number>`. Use them for ICU interpolation / pluralization:

    // in calculate:
    {label: 'tool.secondary.nights', value: 'tool.text.nightsValue', params: {count: 11}}

    // messages/en.json:
    "nightsValue": "{count, plural, one {# night} other {# nights}}"

`CalculatorForm` calls `tConfig(value, params)` when the value is a translation key.

### SEO blocks (howToUse / features / useCases)

Three shared components render structured SEO content on both tool and category pages:

- **`HowToUseSection`** — numbered grid (1–2 columns) with round badges. Renders `howToUse: {title, description}[]`.
- **`FeatureSection`** — checkmark grid. Renders `features: {title, description}[]`.
- **`ContentSection`** — plain bulleted list. Renders `useCases: string[]` (or any string array).

All three accept a `namespace` prop (`'config'` by default, `'categories'` for category pages) and silently return `null` if the required keys are missing — tools/categories without SEO blocks render nothing instead of erroring.

Order on the page: form/view → `HowToUseSection` → `FeatureSection` → `ContentSection` → FAQ → Related.

### description vs metaDescription

Two separate fields in `BaseConfig`:

- **`description`** — page version, rendered under `<h1>` via `CalcLayout` / `ToolLayout`. Live tone, up to ~200 chars.
- **`metaDescription`** — **mandatory**. `<meta name="description">` + JSON-LD `WebApplication.description`. Up to 155 chars, keywords in first phrase.

`generateMetadata` uses `t(config.metaDescription)`, both schemas use `t(config.metaDescription)`, layouts use `tConfig(config.description)`. No fallback logic — every tool has both.

### SEO rule

Any tool that is tagged `business` in the source (thequickutils.com) is implemented as a `ToolConfig` — even if mechanically it looks like "inputs → calculate". This keeps it in the `/business` SEO hub.

**Content/code parity is critical.** Every item in `features`, `howToUse`, `useCases`, `faq`, `description`, `metaDescription` must describe functionality that exists in the View. Promise a feature that doesn't exist → Google penalization, AdSense rejection. Before writing SEO text: open the View, list every control and result, only then write. If you write text for a future feature — implement the feature first, or leave a TODO.

### JSON-LD (Schema.org)

Single publisher: `helpers/site.ts → getPublisher()` returns `{@type: Organization, name: SITE_NAME, url: getBaseUrl()}`. `SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? 'Toolyland'`.

Schema map by page type:

| Page | Component | Blocks |
|---|---|---|
| `/` | `HomeSchema` | WebSite (`@id`) + ItemList (6 categories) + FAQPage (3 Q) |
| `/tools` | `ToolsSchema` | CollectionPage + ItemList (75 tools) |
| `/{category}` | `CategorySchema` | CollectionPage + ItemList + FAQPage (5 Q) + BreadcrumbList |
| `/[slug]` calculator | `CalculatorSchema` | WebApplication + FAQPage + HowTo |
| `/[slug]` tool | `ToolSchema` | WebApplication + FAQPage + HowTo |

Rules:

- URL in JSON-LD **must** include `localePath` — same as canonical.
- `HowTo` rendered only when `howToUseTitle` + `howToUse` exist.
- Each `HowToStep` needs both `name` and `text`.
- `ItemList.name` should describe the items: `categories.all.title` for 6 categories on home, `categories.<slug>.name` for tools in a category, `tools.h1` for the full catalog.

### Yandex SEO

- `robots.ts` — separate `Yandex` user-agent block with `Clean-param` directive. Scrubs `utm_source&utm_medium&utm_campaign&utm_term&utm_content&yclid&gclid&fbclid&_openstat&ysclid&yrclid`. Without this, every ad-click URL becomes a Yandex index duplicate.
- `Host` directive is **deprecated** (Yandex cancelled it in 2018). Do not add it.
- `sitemap.ts` — `changefreq` removed (Google ignores, Yandex does not use for crawl budget). `priority` kept for Yandex. `lastmod` honest: `CONTENT_LASTMOD` (bump manually per content release) for static / category pages, `cfg.publishedAt` for tools.

## Adding a calculator

1. Create the config in `data/calculators/<category>.ts` (object `CalculatorConfig` in the array).
2. If locale is needed, destructure `{locale}` from the second `calculate` argument and define local `fmt` helpers.
3. Add translation keys under `config.<slug>` in both `messages/en.json` and `messages/ru.json`: `title`, `h1`, `description`, `metaDescription`, `keywords`, `inputs.*`, `options.*`, `ranges.*`, `secondary.*`, `hints.*`, `resultLabel`, `resultUnit`, `faq.*`.
4. Optional SEO blocks: `howToUseTitle` + `howToUse`, `featuresTitle` + `features`, `useCasesTitle` + `useCases`.
5. Add `related: [4 slugs]` from the same category.
6. `publishedAt` — ISO date string.

That's it — routing, sitemap, and the category hub pick it up automatically. `getToolCount()` updates everywhere.

## Adding a tool

1. Add a new `kind` to the `ToolConfig` union in `types/tool.ts` (if it needs a new UI shape).
2. Create the config in `data/tools/<category>.ts`.
3. Create the view component in `components/tool/<Name>View.tsx` and add a branch to `ToolView.tsx`.
4. Add translation keys under `config.<slug>` in both `messages/*.json`.
5. Add `related: [4 slugs]` from the same category.
6. Add `publishedAt` — ISO date string.
7. If the tool is wide (form + preview), add its `kind` to `isWide` in `ToolLayout.tsx`.
8. If it uses print, make sure the preview container's `id` ends with `-preview` — the global print CSS uses `[id$='-preview']`.
9. For color pickers, use `components/ui/color-picker.tsx` (Popover + react-colorful), never native `<input type="color">`.
10. For two-column layouts, use `flex flex-col lg:flex-row` with `min-w-0 flex-1` on children — not grid.
11. Use `import {Link} from '@/i18n/navigation'` for any internal navigation — not `next/link`.

That's it — routing, sitemap, hub, search, and home page pick it up automatically.

## Adding a category

1. Add an entry to `categories` in `data/categories.ts` with `slug` and `Icon`.
2. Create `app/[locale]/<slug>/page.tsx` — copy the pattern from any existing category (thin wrapper with `buildCategoryMetadata` + `<CategoryPage slug="..." />`).
3. Add a root-level `categories.<slug>` block to both `messages/en.json` and `messages/ru.json` with all fields (`name`, `shortName`, `h1`, `metaTitle`, `metaDescription`, `keywords`, `intro`, `howToUse`, `features`, `useCases`, `faq`).
4. Add an icon to `components/layout/CategoryIcon.tsx` if needed.
5. Update `CategorySchema.tsx` — the FAQ loop iterates `[1, 2, 3, 4, 5]`; expand if you add more questions.

That's it — `ToolGrid` filters, the sidebar, `sitemap.ts`, and the `CategoryPage` template pick it up automatically. The `ToolGrid` filter list is built dynamically from `data/categories.ts`, so no hardcoding in the component.

## Brand

- **Name:** Toolyland
- **Domain:** toolyland.com
- **Logo:** rounded square, navy `#0F172A` background, teal letter T `#14B8A6`, coral dot in top-right corner `#FB7185`
- **Wordmark:** "toolyland" in bold sans-serif

## Notes

- **No `src/`.** Code lives in the project root.
- **Import alias:** `@/*` maps to root.
- **Named exports** in `components/`, default export only in `app/`.
- **Function declarations** preferred over `React.FC`.
- **No barrel imports** for `@/components`. Import directly: `@/components/ui/sidebar`, `@/components/layout/AppSidebar`.
- **shadcn/ui on Base UI** (not Radix). Use `render={<Component />}`, not `asChild`.
- **Icons** — only from `@animateicons/react` via direct subpath (`@animateicons/react/lucide/percent-icon`). Never `lucide-react`. **Never barrel imports** (`@animateicons/react/huge` — pulls the entire set, ~918 kB). Use `as` aliases to preserve original names in configs. Pass `isAnimated={false}` to disable built-in hover and `ref={iconRef}` for imperative `startAnimation()` / `stopAnimation()`.
- **`useTranslations` in client components.** `getTranslations` from `next-intl/server` fails in `'use client'` with `getTranslations is not supported in Client Components`.
- **`Link` from `@/i18n/navigation`, not `next/link`.** Any other import creates locale-agnostic URLs and breaks canonical.
- **`CopyButton`** for copy-to-clipboard — don't hand-roll. Pass only `getValue`, `disabled`, `className`, `showLabel`, `tooltipSide`, `onSuccess`, `noTooltip`.
- **Don't pass `CopyButton` into `OutputPanel`** — it's already there.
- **Base UI focus-guards** break layout inside `space-y-*`. Wrap `PopoverTrigger` / `DropdownMenuTrigger` in `<div style={{display: 'contents'}}>` (see `date-picker.tsx`).
- **`secondary[].value`** must be either a pure translation key (resolved via `tConfig.has()`) or a ready string (number, unit, percent). Never concatenate a number with a translation key — use `params` for ICU.
- **FAQ items** are passed as translation keys (`{q: 'slug.faq.q1', a: 'slug.faq.a1'}`), not translated strings. `FAQ` accepts a `namespace` prop (`'config'` default, `'categories'` for category pages, `'home'` for HomeFaq).
- **`n2words` v6** requires subpath imports (`n2words/en`, `n2words/ru`) and exports `toCardinal`, not `toWords`.
- **Biome** forbids `noAssignInExpressions` — use `for (;;) { const m = regex.exec(text); if (m === null) break }`.
- **Formatting:** single quotes, no semicolons, `bracketSpacing: false` (Biome config).
- **ICU safety:** no angle brackets (`<`, `>`) in message strings — ICU parses them as tags and throws `UNCLOSED_TAG`. No dots in translation keys under `config.<tool>.<sub>` — dots are parsed as nesting and throw `INVALID_KEY`. Escape curly braces in placeholders with single quotes.
- **Print pattern for multi-page output** (images-to-pdf and similar) — build clean HTML, load into a hidden `<iframe>`, wait for images, call `iframe.contentWindow.print()`. Do **not** use `window.print()` in the current window — it conflicts with `ToolLayout` and produces a blank second page.
- **`params` is a Promise in Next.js 15+** — always `await params` in `generateMetadata` and page components.
- **`output: 'export'`** is incompatible with `localePrefix: 'as-needed'` and `proxy.ts`. Verify builds with `pnpm build && pnpm start`.
- **SliderField** — local `min`/`max` state (initialized from `input`, editable at runtime), integer parsing (strips locale separators), cursor preservation via meaningful-char position tracking, clamps on blur not on change. Focus ring: `focus-visible:ring-0` (not `ring-transparent` — that keeps ring width). Text size: `text-xs md:text-xs` (base `Input` has `md:text-sm` which overrides `text-xs` at ≥768px).
- **Font scaling in preview** — use `text-[Nem]` (`0.9em`, `1.35em`, `2.3em`) when the container has a `fontSize` that must scale children. Absolute `text-xs` / `text-sm` classes override the parent.
- **`getTranslations` in server components only.** Client components must use `useTranslations`.
- **Theme hydration** — never render theme-dependent UI before `mounted = true`. Server returns `undefined`, client reads `localStorage` → React regenerates the tree. Use `const [mounted, setMounted] = useState(false); useEffect(() => setMounted(true), [])` and `if (!mounted) return <FallbackIcon />`. See `ThemeToggle.tsx`.
- **Env vars inlined at build time** — `NEXT_PUBLIC_*` values are baked into the bundle. After changing `NEXT_PUBLIC_SITE_URL` or `NEXT_PUBLIC_SITE_NAME` in Amvera, trigger a rebuild.

## License

Private. All rights reserved.
