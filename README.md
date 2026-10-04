# <ProjectName>

Free, fast, privacy-first online tools. Calculators, text utilities, generators, and developer tools that run 100% in your browser. No signup required.

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

In production — set it to your real domain (used by `sitemap.ts`, `robots.ts`, canonical URLs, JSON-LD).

## Project structure

    .
    ├── app/
    │   ├── [locale]/
    │   │   ├── layout.tsx              ← root layout (html, body, ThemeProvider, Sidebar)
    │   │   ├── page.tsx                ← home (Hero + Stats + ToolGrid)
    │   │   ├── not-found.tsx           ← 404
    │   │   ├── [slug]/page.tsx         ← dispatcher: calculator or tool
    │   │   ├── about/page.tsx
    │   │   ├── privacy/page.tsx
    │   │   ├── finance/page.tsx        ← category hub (static)
    │   │   ├── health/page.tsx         ← category hub (static)
    │   │   ├── text/page.tsx           ← category hub (static)
    │   │   ├── developer/page.tsx      ← category hub (static)
    │   │   ├── generators/page.tsx     ← category hub (static)
    │   │   └── business/page.tsx       ← category hub (static)
    │   ├── globals.css                 ← Tailwind + shadcn tokens + fonts + print CSS
    │   ├── robots.ts
    │   └── sitemap.ts
    │
    ├── components/
    │   ├── calculator/
    │   │   ├── CalcLayout.tsx          ← server layout for calculator pages
    │   │   ├── CalculatorForm.tsx      ← form + result (client), passes {locale} to calculate
    │   │   ├── CalculatorSchema.tsx    ← JSON-LD WebApplication + FAQPage + HowTo (server)
    │   │   └── SliderField.tsx         ← slider input
    │   ├── tool/
    │   │   ├── ToolLayout.tsx          ← server layout for tool pages (isWide for wide tools)
    │   │   ├── ToolView.tsx            ← switch by kind + assertNever
    │   │   ├── ToolSchema.tsx          ← JSON-LD WebApplication + FAQPage + HowTo
    │   │   └── *View.tsx               ← one view per tool kind (45 total)
    │   ├── category/
    │   │   └── CategoryPage.tsx        ← shared category hub template (server)
    │   ├── shared/
    │   │   ├── FAQ.tsx                 ← shared FAQ block (accepts namespace)
    │   │   ├── RelatedTools.tsx        ← related tools (cross-type)
    │   │   ├── InputPanel.tsx          ← textarea panel with header + copy
    │   │   ├── OutputPanel.tsx         ← output panel with copy + optional download
    │   │   ├── CopyButton.tsx          ← copy-to-clipboard button
    │   │   ├── ExpandableSplit.tsx     ← split-view with fullscreen dialog
    │   │   ├── CardPreview.tsx         ← tool card preview (takes slug, resolves config)
    │   │   ├── Highlight.tsx           ← search-match highlighting
    │   │   ├── HowToUseSection.tsx     ← renders howToUse (numbered grid)
    │   │   ├── FeatureSection.tsx      ← renders features (checkmark grid)
    │   │   └── ContentSection.tsx      ← generic list renderer (useCases, fallback)
    │   ├── home/
    │   │   ├── Hero.tsx
    │   │   ├── Stats.tsx
    │   │   └── ToolGrid.tsx            ← filters built from data/categories.ts
    │   ├── layout/
    │   │   ├── AppSidebar.tsx
    │   │   ├── CategoryIcon.tsx
    │   │   ├── LocaleSwitcher.tsx
    │   │   ├── SidebarSettings.tsx
    │   │   └── ThemeToggle.tsx
    │   ├── providers/
    │   │   └── theme-provider.tsx
    │   ├── search/
    │   │   ├── SearchModal.tsx
    │   │   ├── SearchProvider.tsx
    │   │   └── SearchTrigger.tsx
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
    │       ├── developer.ts            ← 26 developer tools
    │       ├── text.ts                 ← 5 text tools
    │       ├── generators.ts           ← 10 generators + image tools
    │       ├── business.ts             ← 7 business tools
    │       ├── unit-categories.ts
    │       ├── license-templates.ts
    │       └── gitignore-templates.ts
    │
    ├── helpers/
    │   ├── index.ts                    ← assertNever + getBaseUrl re-exports
    │   ├── getBaseUrl.ts               ← single source of BASE_URL
    │   ├── og-locale.ts                ← getOgLocale(locale) → 'en_US', 'ru_RU'
    │   └── utils/
    │       ├── colors.ts               ← hexToRgb, rgbToHex, rgbToHsl, contrastRatio, WCAG
    │       ├── base64-image.ts         ← blobToDataUri, bytesToBase64, parseBase64Image
    │       └── median-cut.ts           ← extractPalette for color-palette-extractor
    │
    ├── hooks/
    │   ├── use-event.ts                ← stable useCallback wrapper
    │   ├── use-smooth-progress.ts      ← smoothed progress for long-running operations
    │   └── use-search-index.ts         ← Fuse.js index built from current locale messages
    │
    ├── i18n/
    │   ├── navigation.ts               ← Link, useRouter, usePathname
    │   ├── request.ts                  ← getRequestConfig (next/root-params)
    │   └── routing.ts                  ← locales: ['en','ru']
    │
    ├── messages/
    │   ├── en.json                     ← includes `categories` root block
    │   └── ru.json
    │
    ├── types/
    │   ├── index.ts
    │   ├── common.ts                   ← FAQItem, CategorySlug, Tag, BaseConfig, Values, Option (+params), OperationResult (+params), ResultRange, InputField, IconHandle, IconProps, FeatureItem, HowToStep
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
- **Routing:** flat URLs `/[locale]/[slug]` for tools and `/[locale]/<category>` for the six SEO category hubs. Category hubs are **static folders** (`finance/page.tsx`, `health/page.tsx`, …), not a dynamic `[category]` route — a dynamic `[category]` conflicts with `[slug]` in Next.js App Router (`You cannot use different slug names for the same dynamic path`).
- **SSG:** every page is statically generated via `generateStaticParams`. Category pages are static by definition (one slug per file).
- **i18n:** `next-intl` v4 with `localePrefix: 'as-needed'` (EN without prefix, RU with `/ru`).
- **Universal by design.** No country-specific tools, formulas or currencies. Every calculator works in any country. Locale-aware number and date formatting is threaded through `calculate`.
- **OG locale:** `og:locale` requires the `language_TERRITORY` format (`en_US`, `ru_RU`), not raw BCP-47. Use `getOgLocale(locale)` from `@/helpers/og-locale` in every `generateMetadata` that emits Open Graph.

### Two independent data systems

1. **Calculators** (`CalculatorConfig`) — classic "inputs → calculate → one result". Configs live in `data/calculators/<category>.ts`. `calculate()` is a function, so it cannot cross the server/client boundary — client components receive `slug: string` and resolve the config via `getCalculatorBySlug(slug)`.

2. **Tools** (`ToolConfig`, discriminated union by `kind`) — everything that doesn't fit "inputs → calculate" (formatters, converters, generators, form+preview builders, file processing). Configs live in `data/tools/<category>.ts`. Each `kind` has its own view component in `components/tool/`.

The **registry** (`data/registry.ts`) unifies both: `getRegistryEntry(slug)`, `getAllRegistryEntries()`, `getRegistryEntriesByCategory(category)`. The `[slug]/page.tsx` dispatcher resolves through the registry and renders `CalcLayout` or `ToolLayout`.

### Category hubs

Six static routes: `app/[locale]/{finance,health,text,developer,generators,business}/page.tsx`. Each is a thin wrapper:

    export async function generateMetadata({params}) {
      const {locale} = await params
      return buildCategoryMetadata(locale, 'finance')
    }

    export default function FinancePage() {
      return <CategoryPage category="finance" />
    }

`CategoryPage.tsx` is a **server component** that renders: header (`h1` + back arrow) → tools count → tool grid → SEO blocks (`intro`, `HowToUseSection`, `FeatureSection`, `ContentSection` for useCases) → `FAQ`.

All category content lives in a single root-level `categories` block in `messages/{en,ru}.json`:

- `name`, `shortName`, `h1`
- `metaTitle`, `metaDescription`, `keywords`
- `intro`
- `howToUseTitle` + `howToUse` (array of `{title, description}`)
- `featuresTitle` + `features` (array of `{title, description}`)
- `useCasesTitle` + `useCases` (array of strings)
- `faq` (5 questions per category)

Plus `categories.all` — for the "All Tools" filter. Nothing is duplicated in `home.categories`, `home.filters`, or `category.title` — those blocks were removed.

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

Order on the page: form/view → `HowToUseSection` → `FeatureSection` → `ContentSection` → FAQ → RelatedTools.

### SEO rule

Any tool that is tagged `business` in the source (thequickutils.com) is implemented as a `ToolConfig` — even if mechanically it looks like "inputs → calculate". This keeps it in the `/business` SEO hub.

## Adding a calculator

1. Create the config in `data/calculators/<category>.ts` (object `CalculatorConfig` in the array).
2. If locale is needed, destructure `{locale}` from the second `calculate` argument and define local `fmt` helpers.
3. Add translation keys under `config.<slug>` in both `messages/en.json` and `messages/ru.json`: `title`, `h1`, `description`, `keywords`, `inputs.*`, `options.*`, `ranges.*`, `secondary.*`, `hints.*`, `resultLabel`, `resultUnit`, `faq.*`.
4. Optional SEO blocks: `howToUseTitle` + `howToUse`, `featuresTitle` + `features`, `useCasesTitle` + `useCases`. Migrate them one tool at a time.

That's it — routing, sitemap, and the category hub pick it up automatically.

## Adding a tool

1. Add a new `kind` to the `ToolConfig` union in `types/tool.ts` (if it needs a new UI shape).
2. Create the config in `data/tools/<category>.ts`.
3. Create the view component in `components/tool/<Name>View.tsx` and add a branch to `ToolView.tsx`.
4. Add translation keys under `config.<slug>` in both `messages/*.json`.
5. If the tool is wide (form + preview), add its `kind` to `isWide` in `ToolLayout.tsx`.
6. If it uses print, make sure the preview container's `id` ends with `-preview` — the global print CSS uses `[id$='-preview']`.
7. For color pickers, use `components/ui/color-picker.tsx` (Popover + react-colorful), never native `<input type="color">`.
8. For two-column layouts, use `flex flex-col lg:flex-row` with `min-w-0 flex-1` on children — not grid.

That's it — routing, sitemap, hub, search, and home page pick it up automatically.

## Adding a category

1. Add an entry to `categories` in `data/categories.ts` with `slug` and `Icon`.
2. Create `app/[locale]/<slug>/page.tsx` — copy the pattern from any existing category.
3. Add a root-level `categories.<slug>` block to both `messages/en.json` and `messages/ru.json` with all fields (`name`, `shortName`, `h1`, `metaTitle`, `metaDescription`, `keywords`, `intro`, `howToUse`, `features`, `useCases`, `faq`).
4. Add an icon to `components/layout/CategoryIcon.tsx` if needed.

That's it — `ToolGrid` filters, the sidebar, `sitemap.ts`, and the `CategoryPage` template pick it up automatically. The `ToolGrid` filter list is built dynamically from `data/categories.ts`, so no hardcoding in the component.

## Notes

- **No `src/`.** Code lives in the project root.
- **Import alias:** `@/*` maps to root.
- **Named exports** in `components/`, default export only in `app/`.
- **Function declarations** preferred over `React.FC`.
- **No barrel imports** for `@/components`. Import directly: `@/components/ui/sidebar`, `@/components/layout/AppSidebar`.
- **shadcn/ui on Base UI** (not Radix). Use `render={<Component />}`, not `asChild`.
- **Icons** — only from `@animateicons/react` via direct subpath (`@animateicons/react/lucide/percent-icon`). Never `lucide-react`. Use `as` aliases to preserve original names in configs. Pass `isAnimated={false}` to disable built-in hover and `ref={iconRef}` for imperative `startAnimation()` / `stopAnimation()`.
- **`CopyButton`** for copy-to-clipboard — don't hand-roll. Pass only `getValue`, `disabled`, `className`, `showLabel`, `tooltipSide`, `onSuccess`, `noTooltip`.
- **Don't pass `CopyButton` into `OutputPanel`** — it's already there.
- **Base UI focus-guards** break layout inside `space-y-*`. Wrap `PopoverTrigger` / `DropdownMenuTrigger` in `<div style={{display: 'contents'}}>` (see `date-picker.tsx`).
- **`secondary[].value`** must be either a pure translation key (resolved via `tConfig.has()`) or a ready string (number, unit, percent). Never concatenate a number with a translation key — use `params` for ICU.
- **FAQ items** are passed as translation keys (`{q: 'slug.faq.q1', a: 'slug.faq.a1'}`), not translated strings. `FAQ` accepts a `namespace` prop (`'config'` default, `'categories'` for category pages).
- **`n2words` v6** requires subpath imports (`n2words/en`, `n2words/ru`) and exports `toCardinal`, not `toWords`.
- **Biome** forbids `noAssignInExpressions` — use `for (;;) { const m = regex.exec(text); if (m === null) break }`.
- **Formatting:** single quotes, no semicolons, `bracketSpacing: false` (Biome config).
- **ICU safety:** no angle brackets (`<`, `>`) in message strings — ICU parses them as tags and throws `UNCLOSED_TAG`. No dots in translation keys under `config.<tool>.<sub>` — dots are parsed as nesting and throw `INVALID_KEY`. Escape curly braces in placeholders with single quotes.
- **Print pattern for multi-page output** (images-to-pdf and similar) — build clean HTML, load into a hidden `<iframe>`, wait for images, call `iframe.contentWindow.print()`. Do **not** use `window.print()` in the current window — it conflicts with `ToolLayout` and produces a blank second page.
- **`params` is a Promise in Next.js 15+** — always `await params` in `generateMetadata` and page components.
- **`output: 'export'`** is incompatible with `localePrefix: 'as-needed'` and `proxy.ts`. Verify builds with `pnpm build && pnpm start`.

## License

Private. All rights reserved.