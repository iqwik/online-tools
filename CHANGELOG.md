## [Unreleased]

### TODO

- **Deploy to Amvera** — create project, connect GitHub, choose "Начальный" tariff (290 ₽/mo, SLA). In Amvera → get A-record IP + TXT verification value. In Timeweb → add A `@` → Amvera IP, A `www` → same IP, TXT `@` → verification value. Wait for automatic Let's Encrypt. Test from RU (home + mobile) and world (VPN). Set env in Amvera: `NEXT_PUBLIC_SITE_URL=https://toolyland.com`, `NEXT_PUBLIC_SITE_NAME=Toolyland`. Rebuild after env set (`NEXT_PUBLIC_*` inlined at build time). Verify JSON-LD url = canonical = `https://toolyland.com/...`.
- **Rich Results Test** — after deploy: run all JSON-LD (WebApplication, FAQPage, HowTo, CollectionPage, ItemList, BreadcrumbList) through Google Rich Results Test. Pages to test: `/`, `/tools`, `/finance`, `/ru/finance`, `/bmi-calculator`, `/ru/bmi-calculator`, `/invoice-generator`, `/json-formatter`, `/images-to-pdf`, `/income-tax-calculator`, `/unit-converter`, `/salary-slip-generator`. Verify URL in JSON-LD matches canonical (with locale prefix on RU pages). **Top of queue after deploy.**
- **Regression check for remaining tools** — Stage 4 of Variant C. Systematic verification: open every View, compare against final texts. Suggested set: `InvoiceGeneratorView`, `SalarySlipGeneratorView`, `ColorPickerView`, `RegexTesterView`, `JsonFormatterView`.
- **Final EN + RU proofread** — read through all 75 tools × 2 locales one more time in the browser.
- **`pdf-to-image`** — translations ready in `messages/{en,ru}.json`, but no `data/tools/developer.ts` entry and no View. `pdfjs-dist@6.3.289` installed. Plan: `kind: 'pdf-to-image'`, category `developer`, `isWide: true`, worker via `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)`, page range parser (`1-5, 8, 11-13`), format PNG / JPEG / WebP, scale 1× / 1.5× / 2× / 3×, quality (JPEG / WebP), transparent background (PNG only), grid preview + ZIP download, `useSmoothProgress`. Destroy via `loadingTask.destroy()` (not `pdfDoc.destroy()`), `page.render({canvas, canvasContext, viewport})`. When implemented, re-add `pdf-to-image` to `related` in `images-to-pdf` (removed in 0.13.0 to avoid broken links).
- **`lucide-react` cleanup** — remaining imports in `UuidGeneratorView.tsx`, `BreadCrumbs.tsx` and possibly other View / shared components. Replace with `@animateicons/react/lucide/<name>-icon`. Run `grep -rn "lucide-react" components/` for the full list. Note: in `UuidGeneratorView` `CheckCircle2` renamed to `CircleCheck` in animateicons — verify subpath.
- **Tap targets on mobile** — toolbar buttons / inputs at `h-8` (32px) fail the ≥44px guideline. Apply `h-9 sm:h-8` or `h-10 sm:h-8` on mobile. Affected: `UuidGeneratorView` toolbar, likely other View toolbars. Sweep with `grep -rn 'size="sm"' components/tool/ components/calculator/`.
- **P3 mobile cosmetics** — deferred items from the 0.14.0 review: spacing tweaks, font sizes in toolbars, small tap-area polish. No structural issues left.
- **Category `metaDescription` review** — if Google starts truncating on desktop SERP or coverage drops, extend to 150–155 characters.
- **Category FAQ expansion** — if organic performance suggests, add a 6th question to `categories.<slug>.faq`. Update `CategorySchema.tsx` FAQ loop (`[1,2,3,4,5]` → `[1,2,3,4,5,6]`) accordingly.
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
- **AdSense + GA** — connect `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_ADSENSE_CLIENT`. Submit for review after 2–3 months of stable traffic. Prerequisites: `privacy@toolyland.com` and `hello@toolyland.com` must exist (or a contact form must be wired).
- **`privacy@toolyland.com` + `hello@toolyland.com`** — set up via Cloudflare Email Routing (free) or Yandex Mail for Domain. Referenced in `/about` and `/privacy` but not created yet.
- **Cookie consent — revoke mechanism** — GDPR requires ability to withdraw consent. Add "Manage cookies" link in footer that reopens the banner or opens preferences. Required before AdSense submission.
- **Privacy page — clickable links** — `https://adssettings.google.com` and `https://policies.google.com/technologies/partner-sites` currently plain text. Add as `<a target="_blank" rel="noopener">` below the "Advertising" section, or split `privacy.sections.ads.text` and render links in JSX.
- `images-to-pdf`: PDF filename comes from `<title>`; consider setting `document.title = 'images-YYYY-MM-DD.pdf'` inside the print iframe before printing
- `images-to-pdf`: image quality slider does not affect print output (browser prints originals). If needed — recompress via Canvas before printing
- Chrome page header / footer (date, URL, page numbers) can only be disabled by the user in the print dialog — cannot be removed programmatically
- Decide on `useCases` format: keep as `string[]` (via `ContentSection`) or migrate to `{title, description}[]` (via a new `UseCaseSection`)
- **`image-compressor` target file size mode** — binary search on quality to hit a target KB. Removed from texts, implementation in tech debt (3–4 hours).
- Bonus tool: `text-to-svg-generator` (84th) — regex + shape / color / icon dictionary, offline, no dependencies. Discuss after Wave 6
- **Custom unit plural in labels** — `global.units.{months, years, days, weeks, hours, nights}` are simple strings (не ICU plural), используются как метки полей. Если понадобится согласование с числом — надо перейти на `t(unit, {count: value})` во всех `SliderField`/`CalculatorForm` и передавать значение. Отложено.
- **Related slug typization** — `string[]` doesn't catch typos (like the old `lorem-ipsum`). Consider `Slug` union type or `satisfies readonly string[]` assertion so typos fail at build time.
- **`getToolCount()` is sync** — fine at 75, fine at 500. If the registry grows beyond ~1000 entries with heavy per-entry initialization, consider a cached constant or build-time inlining.
- **favicon-generator — future improvements** — (1) SVG favicon output: `<link rel="icon" type="image/svg+xml">` for sharper retina. (2) Verify generated `.ico` opens correctly on Windows / macOS / Linux. (3) Consider `browserconfig.xml` for legacy Edge/IE — low priority, dead formats.

## [0.16.0] - 2026-10-07

### Brand identity, favicon set, localized metadata, legal pages rewrite

#### Added

**Brand identity — logo set**

- **Three SVG variants** in `public/brand/`:
  - `toolyland-icon.svg` — rounded square, navy `#0F172A` background, teal `#14B8A6` letter T, coral `#FB7185` dot in top-right corner. Used for favicon, app icons, avatars.
  - `toolyland-compact.svg` — icon + "oolyland" wordmark (T in icon = first letter). Used in sidebar, mobile header.
  - `toolyland-wordmark.svg` — "Toolyland" text-only in Inter Bold (700), navy fill. Used for documents, email signatures, OG-image.
- **Wordmark typography** — Inter Bold 700, letter-spacing `-1.5%`, size `65`. Chosen over ExtraBold (too heavy) and Black (breaks minimalism). Color matches icon background (`#0F172A`).
- **`components/shared/Logo/Logo.tsx`** — new component. Uses `next/image` with static import of `toolyland-compact.svg`. Rendered in `AppSidebar`.

**Favicon set (via toolyland.com/favicon-generator)**

- `public/favicon.ico` — multi-size (16/32/48) ICO, generated by own tool.
- `public/favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`, `favicon-96x96.png`.
- `public/apple-touch-icon.png` (180×180).
- `public/icon-192x192.png`, `icon-512x512.png` (PWA).
- `public/site.webmanifest` — `name` / `short_name` = `Toolyland`, `theme_color` / `background_color` = `#0F172A`, `display: standalone`, corrected icon paths.

**Localized metadata**

- **`meta.site` block** in `messages/{en,ru}.json` — site-wide `title` + `description` fallback for pages without own `generateMetadata` (about, privacy, 404).
- **`generateMetadata` in `app/[locale]/layout.tsx`** — replaces old static `export const metadata`. Reads locale via `getTranslations({locale, namespace: 'meta.site'})`. Emits localized `title` + `description`.
- **Full metadata block** — `applicationName`, `authors`, `creator`, `publisher`, icons (7 entries), `manifest`, `openGraph` (with `locale` + `alternateLocale` from `getOgLocale` / `getOgAlternateLocales`), `twitter`, `robots` (with `max-image-preview: large`, `max-snippet: -1`, `max-video-preview: -1`).

**Viewport theme color**

- `viewport.themeColor` — array of two media-query entries: light `#ffffff`, dark `#0F172A`. Android status bar matches site theme.

**About page — audience section**

- New `about.audience` block in `messages/{en,ru}.json` with six audience entries: designers, copywriters, developers, marketers, students, freelancers.
- Rendered in `about/page.tsx` after `offer`.

**Privacy policy — full rewrite**

- New section structure: `tools` / `storage` / `cookies` / `analytics` / `ads` / `rights` / `changes` / `contact`.
- Explicit acknowledgment of Google Analytics 4, Yandex Metrica (with Webvisor), Google AdSense.
- GDPR / UK GDPR / CCPA rights section.
- Links to Google Ads Settings and Google partner-sites policy.
- Contact email `privacy@toolyland.com`.

**favicon-generator improvements** (own tool, self-hosted)

- Multi-size `.ico` output — 16/32/48 PNG entries embedded in ICO container. Custom builder, no external library.
- Transparent background checkbox — skips canvas fill when enabled.
- Own `ColorPicker` component (`components/ui/color-picker.tsx`) instead of native `<input type="color">`.
- `readme` template moved to `messages/{en,ru}.json` — localized, `{htmlSnippet}` and `{themeColor}` passed as ICU variables. Includes Toolyland branding + link.
- Auto-regenerate on option change (`fitMode`, `backgroundColor`, `transparentBg`) via `useEffect` with `didMount` guard.

#### Changed

**Voice and copy**

- `about` block rewritten from first-person singular — "я решил сделать" instead of "мы делаем". Developer voice, but emphasis on universal audience, not just developers.
- `about.intro` now explicitly lists audiences: finance/health calculators, text tools for writers, generators for designers, dev utilities, business docs for freelancers.
- New `about.mission.points.universal` — "Для всех: дизайнеров, копирайтеров, разработчиков, студентов, фрилансеров, малого бизнеса."
- Fixed duplicate line in `about.offer.textTools` (contained `text` value by mistake).

**Metadata refactor**

- `app/[locale]/layout.tsx` — `export const metadata` → `export async function generateMetadata({params})`.
- Title template removed — was `'%s | ProjectName'`. Google SERP would truncate pages with long custom titles. Each page's `generateMetadata` sets its own title without suffix.
- `SITE_DESCRIPTION` constant removed — moved to `messages/meta.site.description`.

**SearchTrigger caret fix**

- Position — `align-text-bottom` removed, `translate-y-[0.15em]` added. Caret now vertically centered with text.
- Animation — `animate-pulse` → `animate-[caret-blink_1s_steps(2,start)_infinite]` for hard blink (terminal-like). Keyframes added to `globals.css`.

**README.md**

- Link to live site moved to first line: `**[toolyland.com](https://toolyland.com)**`.

#### Fixed

- **Favicon ignored** — `app/favicon.ico` from Next.js template was overriding `metadata.icons`. Removed `app/favicon.ico`, now `public/favicon.ico` is served correctly.
- **Privacy policy contradicted reality** — claimed "we don't collect, store, or share data" while cookie-consent banner existed. Rewritten to acknowledge localStorage, GA4, Yandex Metrica, AdSense cookies, and grant explicit consent language.
- **About page voice mismatch** — "мы делаем" replaced with "я решил сделать".
- **About duplicate line** — `about.offer.textTools` contained the value of `about.offer.text` ("Инструменты в шести категориях:") instead of "Текстовые инструменты — ...".

#### Infrastructure (decisions)

- **OG-image deferred** — `metadata.openGraph.images` references `/og-default.jpg` which doesn't exist yet. Non-blocker: social previews fall back to a default thumbnail. Tracked in [Unreleased].
- **Contact emails deferred** — `privacy@toolyland.com` and `hello@toolyland.com` referenced in pages but not created. Must exist before AdSense submission. Tracked in [Unreleased].

#### Known limitations

- **OG-image missing** — `og-default.jpg` not created. Social shares will not show custom preview image.
- **Contact emails missing** — placeholders in place. Need Cloudflare Email Routing or Yandex Mail for Domain.
- **Cookie consent lacks revoke UI** — only "Accept" button. GDPR requires withdrawal mechanism. Tracked in [Unreleased].
- **Privacy policy links not clickable** — Google URLs in `privacy.sections.ads.text` are plain text. Must be rendered as `<a>` before AdSense submission.
- **Rich Results Test not yet run** — needs deployed site.
- **Regression check not exhaustive** — 3–5 View vs texts still pending.
- **EN + RU proofread not done** in browser.
