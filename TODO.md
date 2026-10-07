# TODO

Project roadmap and backlog. Updated after every release.

Legend: `[x]` done · `[ ]` pending · `[~]` in progress · `[!]` blocked

---

## 🔥 Next up (v0.17.0)

### Deploy to Amvera — TOP PRIORITY
- [ ] Create project in Amvera, connect GitHub repo.
- [ ] Choose tariff «Начальный» (290 ₽/mo, SLA) — not «Пробный» (no SLA).
- [ ] In Amvera project settings → add custom domain `toolyland.com` (HTTPS, own domain).
- [ ] Copy A-record IP + TXT verification value from Amvera.
- [ ] In Timeweb DNS for `toolyland.com`: add A `@` → Amvera IP, A `www` → same IP, TXT `@` → verification value.
- [ ] Wait for DNS propagation (15 min – few hours).
- [ ] Confirm domain in Amvera → automatic Let's Encrypt SSL issuance.
- [ ] Set env vars in Amvera: `NEXT_PUBLIC_SITE_URL=https://toolyland.com`, `NEXT_PUBLIC_SITE_NAME=Toolyland`.
- [ ] Rebuild project after env set (`NEXT_PUBLIC_*` inlined at build time).
- [ ] Verify accessibility: home internet (RU), mobile internet (MTS/Megafon/Beeline/Tele2), VPN (world).
- [ ] Verify canonical + JSON-LD url = `https://toolyland.com/...` (both EN and RU pages).

### OG image — last brand asset
- [ ] Create `og-default.jpg` (1200×630) in Figma — navy `#0F172A` background, `toolyland-wordmark.svg` left, tagline «Free online tools. No signup.» right.
- [ ] Export → `public/og-default.jpg`.
- [ ] Verify `/og-default.jpg` in `metadata.openGraph.images` (already wired in `layout.tsx`).
- [ ] Test via Facebook Debugger / Twitter Card Validator / LinkedIn Post Inspector.

### Contact emails
- [ ] Set up `privacy@toolyland.com` + `hello@toolyland.com` via Cloudflare Email Routing (free) or Yandex Mail for Domain.
- [ ] Verify inbound/outbound works.
- [ ] Referenced in `/privacy` and `/about` — must exist before AdSense submission.

### Cookie consent — revoke mechanism (GDPR)
- [ ] Add "Manage cookies" link in footer.
- [ ] Wire it to re-open the consent banner OR open a preferences modal.
- [ ] Required before AdSense submission.
- [ ] Consider: simple version = reset consent → banner reappears on next page load.

### Privacy policy — clickable links
- [ ] `https://adssettings.google.com` and `https://policies.google.com/technologies/partner-sites` in `privacy.sections.ads.text` are plain text.
- [ ] Add `<a target="_blank" rel="noopener">` below the "Advertising" section (simplest), or split the ICU string + render links in JSX.

### Rich Results Test (after Amvera deploy)
- [ ] Run all JSON-LD through Google Rich Results Test. Pages: `/`, `/tools`, `/finance`, `/ru/finance`, `/bmi-calculator`, `/ru/bmi-calculator`, `/invoice-generator`, `/json-formatter`, `/images-to-pdf`, `/income-tax-calculator`, `/unit-converter`, `/salary-slip-generator`.
- [ ] Verify URL in JSON-LD matches canonical (with locale prefix on RU pages) — fixed in 0.15.0.
- [ ] Verify HowTo `step` has both `name` and `text`.
- [ ] Verify FAQPage renders for both calculators and tools.
- [ ] Verify home — WebSite (`@id`) + ItemList (6 categories) + FAQPage (3 Q).
- [ ] Verify one category page — CollectionPage + ItemList + FAQPage (5 Q) + BreadcrumbList.
- [ ] Verify `/tools` — CollectionPage + ItemList (75 tools).
- [ ] Verify `related` cards don't break schema.
- [ ] Fix any schema errors before submitting sitemap.

### Final EN + RU proofread
- [ ] Read through all 75 tools × 2 locales in the browser (not in JSON).
- [ ] Catch awkward phrasing, natural-language errors, inconsistency between description and metaDescription tone.
- [ ] Verify each `title` fits in mobile SERP (~50 chars visible).
- [ ] Verify `home.featured.viewAll` ICU plural renders correctly in both locales at current count (76 after pdf-to-image).
- [ ] Spot-check `home.search.placeholderTry` typewriter in both locales (EN `Try {q}` / RU `Попробуйте {q}`).
- [ ] Spot-check new `about.audience` section — 6 audience entries render correctly.
- [ ] Spot-check rewritten `privacy` sections — 8 sections render correctly (tools / storage / cookies / analytics / ads / rights / changes / contact).

### Regression check — Variant C Stage 4
- [~] **Systematic check: every View vs. its final texts.** Pattern documented in `CONTEXT.md` → «Правило: соответствие текста и кода». Open `components/tool/<Name>View.tsx` or `data/calculators/*.ts`, list every control/result, compare against `config.<slug>` in `messages/*.json`.
- [x] `word-counter` — fixed: removed «pages» metric, added TikTok to social limits.
- [x] `password-generator` — 4 modes + entropy + bulk implemented, texts synced.
- [x] `image-compressor` — target file size removed from texts.
- [x] `images-to-pdf` — drag → «стрелки», quality removed from features.
- [x] `number-to-words-converter` — EN reformulated.
- [x] `meta-tag-generator` — inputs described in texts.
- [ ] **Remaining ~69 tools** — spot-check at least 10 random (one from each category) plus any tool mentioned as «readability», «pages», or another feature that might not exist in View. Suggested: `InvoiceGeneratorView`, `SalarySlipGeneratorView`, `ColorPickerView`, `RegexTesterView`, `JsonFormatterView`.

### Yandex Webmaster
- [ ] Verify `Clean-param` directive is read correctly (Yandex Webmaster → Tools → robots.txt analysis).
- [ ] Verify `priority` in sitemap is parsed.
- [ ] Submit sitemap to Yandex Webmaster.

### Google Search Console
- [ ] Verify site ownership (DNS TXT or HTML file).
- [ ] Submit `sitemap.xml`.
- [ ] Check Coverage report after 1–2 weeks.
- [ ] Check Core Web Vitals after traffic starts.

### Tools
- [ ] **`pdf-to-image`** — translations ready in `messages/{en,ru}.json`, but **no `data/tools/developer.ts` entry** and **no View**. Currently orphaned. `pdfjs-dist@6.3.289` installed. Plan: `kind: 'pdf-to-image'`, category `developer`, `isWide: true`, `related: ['images-to-pdf', 'image-converter', 'svg-to-base64', 'base64-to-image']`, worker via `new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)`, page range parser (`1-5, 8, 11-13`), format PNG / JPEG / WebP, scale 1× / 1.5× / 2× / 3×, quality, transparent background (PNG only), grid preview + ZIP download, `useSmoothProgress`. Destroy via `loadingTask.destroy()`. **After implementing — restore `pdf-to-image` in `images-to-pdf.related` (first) and `image-converter.related` (third).**
- [ ] **Wave 6 — interactive trackers & builders** (10 tools): `pomodoro-timer`, `habit-tracker`, `decision-maker`, `meeting-cost-calculator`, `trip-planner`, `bill-splitter`, `lead-tracker`, `resume-builder`, `visiting-card-generator`, `api-response-mock-generator`. Needs architecture decision: separate `TrackerConfig` or new `ToolConfig` kinds.

### P3 mobile cleanup (deferred from v0.14.0)
- [ ] **`lucide-react` → `@animateicons/react` sweep.** Known files: `UuidGeneratorView.tsx`, `BreadCrumbs.tsx`, possibly others. Run `grep -rn "lucide-react" components/`. Replace with per-file subpath. Gotcha: `CheckCircle2` → `CircleCheck` in animateicons — verify subpath exists before bulk replace.
- [ ] **Tap targets ≥ 44px on mobile.** Toolbar buttons / inputs at `h-8` (32px) fail the guideline. Fix pattern: `h-9 sm:h-8` or `h-10 sm:h-8`. Affected: `UuidGeneratorView` toolbar, likely other View toolbars. Sweep with `grep -rn 'size="sm"' components/tool/ components/calculator/ components/shared/`.
- [ ] **Small spacing / font polish** across toolbars, forms, and previews on 320–375px. No structural issues left — only cosmetic.

### Categories — polish
- [ ] **Extend `metaDescription` to 150–155 chars** if Google starts truncating on desktop SERP. Current values deliberately short (118–142) to guarantee no truncation.
- [ ] **Add 6th FAQ question per category** if organic performance suggests. Note: `CategorySchema` FAQ iterates `q1..q5` — update to include q6 when expanding.
- [ ] **OG image per category** — after `og-default.jpg` exists.

### Locale refactor in `data/**`
- [ ] Replace all hardcoded `'en-US'` / `'en-IN'` (and any hardcoded locale in `toLocaleString` / `toLocaleDateString` / `Intl.*`) with `ctx.locale` passed from `calculate`. Run `grep -rn "toLocaleString('en\|toLocaleDateString('en\|Intl\." data/`.
- [ ] Affects `finance.ts` (`formatInt`, `formatAmount`), `age-calculator`, `date-difference-calculator`, `pregnancy-due-date-calculator`, potentially `health.ts`.
- [ ] After refactor — delete global `formatInt` / `formatAmount`, keep only local `fmt` inside each `calculate`.

### Global units — follow-up
- [ ] **Cleanup** — delete unused `config.<slug>.units.*` keys from `messages/{en,ru}.json` after `global.units` migration. Run `grep -n "\.units\." messages/en.json messages/ru.json`.
- [ ] **ICU plural for units** (optional) — currently `global.units.{months, years, days, weeks, hours, nights}` are simple strings. If per-value agreement is needed in labels, migrate to `t(unit, {count: value})` and add plural forms. Deferred.

### Tech debt (from `CONTEXT.md`)
- [ ] `SalarySlipGeneratorView`: replace `payPeriod` text input with two `<Select>` (Month + Year). Bump localStorage key to `v2`.
- [ ] Extract `CurrencySelect` — `CURRENCIES` / `CURRENCY_SYMBOLS` duplicated across 3 files (invoice, quotation, payslip).
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
- [ ] **Related slug typization** — `string[]` doesn't catch typos (like the old `lorem-ipsum`). Consider `Slug` union type or `satisfies readonly string[]` assertion so typos fail at build time.
- [ ] **`getToolCount()` is sync** — fine at 75, fine at 500. If registry grows beyond ~1000 entries with heavy per-entry initialization, consider a cached constant or build-time inlining.
- [ ] **favicon-generator — future improvements** — (1) SVG favicon output: `<link rel="icon" type="image/svg+xml">` for sharper retina. (2) Verify generated `.ico` opens correctly on Windows / macOS / Linux. (3) Consider `browserconfig.xml` for legacy Edge/IE — low priority, dead formats.

### Decisions pending
- [ ] **`useCases` format** — keep as `string[]` (via `ContentSection`) or migrate to `{title, description}[]` (new `UseCaseSection`)?
- [ ] **Bonus tool**: `text-to-svg-generator` (84th) — regex + shape / color / icon dictionary, offline. Discuss after Wave 6.

---

## 🚀 Production

### Hosting — Amvera (decided)
- [x] ~~Deploy to Vercel~~ — **REJECTED**: IP blocking + OCSP stapling issues in RU. Probe deploy on `vercel-probe` confirmed inaccessible without VPN.
- [x] Choose hosting — **Amvera** (Russian PaaS, RU + world availability).
- [ ] Deploy to Amvera (tariff «Начальный»).
- [ ] Custom domain `toolyland.com` — DNS setup in Timeweb.
- [ ] HTTPS via Let's Encrypt (automatic in Amvera).

### Domain — toolyland.com (decided)
- [x] Domain purchased at Timeweb.
- [ ] Verify DNS setup.
- [ ] Verify accessibility from RU + world.

### Env vars
- [ ] Set `NEXT_PUBLIC_SITE_URL=https://toolyland.com` (in Amvera dashboard).
- [ ] Set `NEXT_PUBLIC_SITE_NAME=Toolyland` (in Amvera dashboard).
- [ ] Rebuild after env set.

### Analytics & monetization
- [ ] Connect Google Analytics (`NEXT_PUBLIC_GA_ID`).
- [ ] Connect Google AdSense (`NEXT_PUBLIC_ADSENSE_CLIENT`).
- [ ] Submit AdSense for review (after 2–3 months of stable traffic; prerequisites: contact emails + cookie revoke + OG image).
- [ ] Connect Yandex Metrica (optional, for RU audience).

### Search engines
- [ ] Submit `sitemap.xml` to Google Search Console.
- [ ] Submit to Yandex Webmaster.
- [ ] Verify `robots.txt` in both consoles.

---

## 🎨 Polish

- [x] ~~Replace `<ProjectName>` with the real project name~~ — **DONE in 0.15.0**: unified via `helpers/site.ts → SITE_NAME`.
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
- [ ] **Test Amvera deploy** — accessibility from RU (home + mobile) and world (VPN).
- [ ] **Test favicon set** — light + dark browser theme, iOS add-to-home, Android install prompt, manifest.
- [ ] **Test SearchTrigger caret** — hard blink (not smooth pulse), centered with text on 320 / 375 / desktop.

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

### v0.16.0 — 2026-10-07

**Brand identity, favicon set, localized metadata, legal pages rewrite**

**Brand identity**
- [x] Three SVG logo variants in `public/brand/`: `toolyland-icon.svg`, `toolyland-compact.svg`, `toolyland-wordmark.svg`.
- [x] Final palette: navy `#0F172A` background, teal `#14B8A6` letter T, coral `#FB7185` dot.
- [x] Wordmark in Inter Bold 700, letter-spacing `-1.5%`.
- [x] `components/shared/Logo/Logo.tsx` — `next/image` + static import `toolyland-compact.svg`. Mounted in `AppSidebar`.

**Favicon set (generated via own toolyland.com/favicon-generator)**
- [x] `favicon.ico` — multi-size 16/32/48.
- [x] `favicon-16x16.png`, `favicon-32x32.png`, `favicon-48x48.png`, `favicon-96x96.png`.
- [x] `apple-touch-icon.png` (180×180).
- [x] `icon-192x192.png`, `icon-512x512.png` (PWA).
- [x] `site.webmanifest` — name/short_name=Toolyland, theme_color/background_color=#0F172A.
- [x] Removed `app/favicon.ico` (Next.js template — was overriding `metadata.icons`).

**Localized metadata**
- [x] `meta.site.{title,description}` in messages — fallback for about/privacy/404.
- [x] `generateMetadata` in `app/[locale]/layout.tsx` — replaces static `metadata`. Reads locale via `getTranslations`.
- [x] Full metadata block: `metadataBase`, `applicationName`, `authors`, `creator`, `publisher`, `icons` (7), `manifest`, `openGraph` (with locale + alternateLocale), `twitter`, `robots` (max-image-preview large).
- [x] Title template removed — each page sets own title without suffix.
- [x] `viewport.themeColor` — array of two media entries: light `#ffffff`, dark `#0F172A`.

**About page**
- [x] Rewritten from first-person singular — «я решил сделать» instead of «мы делаем».
- [x] Emphasis on universal audience — designers, copywriters, developers, marketers, students, freelancers.
- [x] New `about.audience` block with 6 audience entries.
- [x] Fixed duplicate line in `about.offer.textTools`.

**Privacy policy**
- [x] Full rewrite: 8 sections — tools / storage / cookies / analytics / ads / rights / changes / contact.
- [x] Acknowledges localStorage, GA4, Yandex Metrica (Webvisor), Google AdSense.
- [x] GDPR / UK GDPR / CCPA rights section.
- [x] Links to Google Ads Settings and Google partner-sites policy.
- [x] Contact: `privacy@toolyland.com`.

**favicon-generator improvements (own tool)**
- [x] Multi-size `.ico` output (16/32/48 PNG embedded in ICO container). Custom builder, no external library.
- [x] Transparent background checkbox.
- [x] Own `ColorPicker` (`components/ui/color-picker.tsx`) instead of native `<input type="color">`.
- [x] Localized `README.txt` via `messages/{en,ru}.json` — `{htmlSnippet}` and `{themeColor}` passed as ICU variables. Includes Toolyland branding + link.
- [x] Auto-regenerate on option change (`fitMode`, `backgroundColor`, `transparentBg`) via `useEffect` with `didMount` guard.

**SearchTrigger**
- [x] Caret position — `translate-y-[0.15em]` for vertical centering.
- [x] Caret animation — `animate-[caret-blink_1s_steps(2,start)_infinite]` (hard blink, terminal-like).
- [x] `caret-blink` keyframes in `globals.css`.

**Documentation**
- [x] `README.md` — link to live site in first line.
- [x] `CHANGELOG.md` — v0.16.0 entry.
- [x] `CONTEXT.md` — updated to 0.16.0 (brand section, metadata section, rules 88–97).
- [x] `TODO.md` — this file.

### v0.15.0 — 2026-10-07

**SEO finalization (static part) + domain + hosting + brand identity**

**JSON-LD on all page types**
- [x] `components/tools/ToolsSchema.tsx` — new. `CollectionPage` + `ItemList` (75 tools). Mounted on `/tools`.
- [x] `components/category/CategorySchema.tsx` — new. `CollectionPage` + `ItemList` + `FAQPage` (5 Q) + `BreadcrumbList`. Mounted in `CategoryPage`.
- [x] `helpers/site.ts` — new. `SITE_NAME` + `getPublisher()`.
- [x] All 5 schema components use `getPublisher()`.
- [x] Removed hardcoded `'ProjectName'`.

**URL in JSON-LD = canonical**
- [x] `CalcLayout` / `ToolLayout` — `url` with `localePath`.
- [x] `CategorySchema` / `ToolsSchema` — same.

**Locale-aware Link everywhere**
- [x] Mass replace `next/link` → `@/i18n/navigation`.

**ICU plural + semantic fixes**
- [x] `category.toolsCount` EN — ICU plural.
- [x] New key `categories.all.title`.
- [x] `HomeSchema.ItemList.name` — `all.title`.
- [x] `CategorySchema.BreadcrumbList` position 1 — `nav.home`.

**Domain + hosting**
- [x] `toolyland.com` at Timeweb.
- [x] Hosting chosen — Amvera «Начальный».
- [x] Vercel rejected after probe deploy.

**Verified (static check)**
- [x] Related links — 300 slugs, 0 broken, 0 self-ref, 0 duplicates.
- [x] FAQ structure — 6 Q × 75 tools (7 for images-to-pdf), 3 Q home, 5 Q categories.
- [x] searchSynonyms for 75 × 2 locales.
- [x] Titles ≤ 60 (spot-checked).
- [x] metaDescription ≤ 155 (spot-checked).

### v0.14.0 — 2026-10-06

**Mobile adaptation (P0–P3) + typewriter placeholder in Hero**

- [x] `hooks/use-typewriter.ts` — cyclic typing.
- [x] `SearchTrigger` — `placeholders?: string[]` prop.
- [x] `Hero.tsx` — placeholders from `SUGGESTION_KEYS`.
- [x] `home.search.placeholderTry` key.
- [x] `viewportFit: 'cover'` + safe-area padding.
- [x] Mobile header — ShareButton + SearchTrigger.
- [x] Floating ShareButton gated behind `hidden sm:block`.
- [x] `.page { width: 100% }` — fixes overflow.
- [x] Mobile layout fixes — Hero, FeaturedTools, Stats, PrivacyNote, BreadCrumbs, CookieConsent, Footer.
- [x] `Share button` — placement decision closed.

### v0.13.0 — 2026-10-06

**Related links for all 75 tools, Yandex SEO, global units, SliderField refactor**

- [x] `related: Slug[]` (4 items each) — all 75 tools.
- [x] Semantic clusters.
- [x] Fixed broken slug — `lorem-ipsum` → `lorem-ipsum-generator`.
- [x] Removed `pdf-to-image` orphan reference.
- [x] `robots.ts` — Yandex Clean-param.
- [x] `sitemap.ts` — removed `changefreq`.
- [x] `global.units.*` namespace.
- [x] `CalculatorForm` unit resolution.
- [x] Migrated all `data/calculators/*.ts`.
- [x] `getToolCount()` parametrized.
- [x] ICU plural for `viewAll`.
- [x] SliderField refactor.
- [x] Sales-tax-calculator rate input.
- [x] InvoiceGeneratorView refactor.

### v0.12.0 — 2026-10-05

**Home restructure (Phases A / B / C), search refactoring, sidebar "All tools"**

- [x] `HomeSchema.tsx`, `CategoryCards.tsx`, `FeaturedTools.tsx`, `RecentlyAdded.tsx`, `HomeFaq.tsx`, `PrivacyNote.tsx`.
- [x] `app/[locale]/tools/page.tsx` — full catalog.
- [x] `helpers/array.ts` — `seededShuffle`.
- [x] Sidebar "All tools".
- [x] `Stats.tsx` — «{count}+ tools» clickable.
- [x] `sitemap.ts` — `CONTENT_LASTMOD`.
- [x] Search refactoring.
- [x] Fixed: `utm-builder` garbage, `CategoryCards` barrel, `SearchModal` icons.

### v0.11.0 — 2026-10-05

**Universal SEO content rewrite (Variant C, Stages 1–3) + `metaDescription` split**

- [x] Rewrote titles, descriptions, metaDescription, features, howToUse, useCases, faq — 75 × 2 locales.
- [x] All 75 `searchSynonyms`.
- [x] «Free»/«Бесплатный» policy.
- [x] Fixed `BreadCrumbs`, `ThemeToggle`, `globals.css` scrollbar, `.vscode/settings.json`.

### v0.10.0 — 2026-10-04

**Categories: unified translation block, SEO content, static routes**

- [x] Unified root-level `categories` block.
- [x] Six static category routes.
- [x] `CategoryPage.tsx` — server component.
- [x] `namespace` prop in SEO blocks.
- [x] `getOgLocale()` + `getOgAlternateLocales()`.
- [x] Removed: `home.categories`, `home.filters`, `category.title.*`, `[category]/` route.

### v0.9.0 — 2026-10-04

**Structured content blocks + JSON-LD HowTo + FAQPage for calculators**

- [x] `HowToUseSection.tsx`, `FeatureSection.tsx`, `ContentSection.tsx`.
- [x] New types: `FeatureItem`, `HowToStep`.
- [x] `CalculatorSchema.tsx` — FAQPage + HowTo.
- [x] `ToolSchema.tsx` — HowTo.
- [x] Migrated `howToUse` / `features` — 6 tools.
- [x] `images-to-pdf`: 4-step howToUse, 9 features, 5 useCases, FAQ 4 → 7.

### v0.8.0 — 2026-10-03

**SEO content blocks + FAQ accordion + SEO texts for 5 tools**

- [x] `ContentSection.tsx`.
- [x] Content keys: `howToUseTitle` + `howToUse`, `featuresTitle` + `features`, `useCasesTitle` + `useCases`.
- [x] JSON-LD `HowTo`.
- [x] `FAQ.tsx` — Base UI Accordion.
- [x] Cookie consent banner.

### v0.7.0 — 2026-10-03

**Smart search (Fuse.js) + animated icons + scrollbar + theme tokens**

- [x] `useSearchIndex` — Fuse.js index.
- [x] `searchSynonyms` — 75 tools.
- [x] Lucide → `@animateicons/react@0.9.0`.
- [x] New types: `IconHandle`, `IconProps`.
- [x] Theme tokens, custom scrollbar.
- [x] `tax-regime-comparator` → `income-tax-calculator`.

### v0.6.0 — 2026-09-29

**images-to-pdf + pdf-to-image (in progress) + print pattern**

- [x] `images-to-pdf`.
- [~] `pdf-to-image` — `pdfjs-dist` + `jszip`, page range parser.
- [x] Print pattern: HTML string → hidden iframe → `print()`.
- [x] `PreviewPage`.
- [x] Removed `pdf-lib`, `@pdf-lib/fontkit`, `public/fonts/`.

### v0.5.0 — 2026-09-29

**15 new tools + locale-aware calculate + ICU params**

- [x] Finance (5), Health (4), Developer (5).
- [x] Renamed to universal.
- [x] `CalcContext { locale }`.
- [x] `Option.params` / `OperationResult.params`.
- [x] `n2words@6.2.0`.

### v0.4.0 — 2026-09-29

**7 developer + 7 business + ColorPicker + OutputPanel download**

### v0.3.0 — 2026-09-28

**9 developer + 4 text + 3 generators + 18 calculators**

### v0.2.0 — 2026-09-28

**Tool system + dispatcher + shared components**

### v0.1.0 — 2026-09-27

**First working MVP**

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
| JSON-LD coverage | Done (all page types) | — |
| Brand identity | Done | — |
| Favicon set | Done | — |
| Localized metadata | Done | — |
| Legal pages (About, Privacy) | Done | — |
| Domain | toolyland.com (Timeweb) | — |
| Hosting | Amvera «Начальный» | — |
| OG image | No | Yes |
| Contact emails | No | Yes |
| Deployed | No | Yes |
| AdSense ready | No | Yes |

---

## 🔍 Audit trail

### 2026-10-07 (v0.16.0)

**Favicon ignored by Next.js App Router:**
- `app/favicon.ico` (from `create-next-app` template) silently overrode `metadata.icons` in `app/[locale]/layout.tsx`. Next.js App Router prioritises file conventions over metadata. Symptom: browser tab showed Next.js triangle instead of Toolyland T. Fix: removed `app/favicon.ico`, kept favicon set in `public/` root. Verified in incognito window.

**SVG imported as React component:**
- `import {ToolylandCompactIcon} from './icons'` then `<ToolylandCompactIcon />` failed with `Element type is invalid: expected a string but got: object`. Next.js static import of SVG returns `{src, height, width, blurDataURL}` — not a React component. Fix: switched to `next/image` with `src={icon}` (static import object) or `src={icon.src}` for `<img>`.

**Static metadata in localized layout:**
- `export const metadata` cannot access `locale` — hardcoded EN text for all locales. Fix: replaced with `export async function generateMetadata({params})`, reads locale via `getTranslations({locale, namespace: 'meta.site'})`.

**Title template would exceed SERP limits:**
- `title: {default: 'ProjectName', template: '%s | ProjectName'}` would append 11 chars to every page title. Long titles in `config.<slug>` (up to 60) would exceed Google's ~60-char SERP limit. Fix: removed template, each page sets its own title in its own `generateMetadata`.

**Privacy policy contradicted cookie banner:**
- Claimed «we don't collect, store, or share data» while cookie-consent banner existed on every page. For AdSense compliance + honesty, rewrote with explicit acknowledgment of localStorage, GA4, Yandex Metrica (Webvisor), AdSense cookies. Added GDPR/UK GDPR/CCPA rights section, links to Google policies, contact email.

**About voice mismatch:**
- "Мы делаем простые..." — plural "we" is wrong for a solo-developer project. Rewrote from first-person singular — "я решил сделать". Also emphasized universal audience (designers, copywriters, developers, marketers, students, freelancers), not just developers.

**About duplicate line:**
- `about.offer.textTools` in `ru.json` contained the value of `about.offer.text` («Инструменты в шести категориях:») instead of «Текстовые инструменты — ...». Fixed.

**SearchTrigger caret positioning + animation:**
- `align-text-bottom` placed caret below text baseline — visible on screenshot. `animate-pulse` is smooth fade (opacity 1 → 0.5), not hard blink. Fix: `translate-y-[0.15em]` for centering, custom `caret-blink` keyframes with `steps(2,start)` for terminal-like hard blink.

### 2026-10-07 (v0.15.0)

**JSON-LD url vs canonical mismatch on RU pages:**
- `CalcLayout` / `ToolLayout` / `CategorySchema` / `ToolsSchema` were building JSON-LD urls as `${baseUrl}/${slug}` — without locale prefix. RU canonical is `https://toolyland.com/ru/bmi-calculator`, but JSON-LD emitted `https://toolyland.com/bmi-calculator`. Rich Results Test would flag "url mismatch". Fixed via `localePath`.

**`next/link` on RU pages:**
- `EntryPreview`, `RelatedPreview`, `CategoryPage`, `BreadCrumbs` used `next/link` — internal links emitted EN URLs. RU visitor clicking related card got a 301 redirect hop. Fixed via mass replace to `@/i18n/navigation`.

**`ItemList.name` semantic mismatch:**
- `HomeSchema.ItemList.name` was `categories.all.name` («All Tools»), but `numberOfItems: 6` (categories). Fixed: new key `categories.all.title` («Categories»), `name` set to `all.title`. Same fix in `CategorySchema.BreadcrumbList` position 1 — `nav.home`.

**`category.toolsCount` EN missing plural:**
- `{count} tools` → would render "1 tools" if a category ever had one tool. Fixed: ICU plural `one/other`.

**Publisher unification:**
- `'ProjectName'` hardcoded in 4 files. Fixed: `helpers/site.ts → getPublisher()` + `SITE_NAME` from `NEXT_PUBLIC_SITE_NAME`.

**Vercel rejected:**
- Probe deploy on `vercel-probe` (static hello-world) confirmed inaccessible from RU without VPN. Root cause: IP blocking + OCSP stapling issues on Hobby plan. Decision: Amvera (Russian PaaS).

### 2026-10-06 (v0.14.0)

**Mobile adaptation — root cause of horizontal overflow:**
1. `.page` inside `<main className="flex flex-col">` — flex item with `margin-inline: auto` did not stretch to parent width. Fix: `width: 100%` in `@utility page`.
2. `BreadCrumbs` — no `flex-wrap`, pushed `.page` past viewport. Fix: `flex-wrap` + `gap-x-1 gap-y-0.5`.
3. `Hero` inner div — no `w-full`. Fix: `w-full`.
4. `PrivacyNote` — no `min-w-0`. Fix: `min-w-0` + `flex-col sm:flex-row`.

**Safe-area / viewport:**
- Added `viewportFit: 'cover'` — without it `env(safe-area-inset-*)` is ignored on iPhone.
- CookieConsent and Footer overlapped home-indicator. Fixed via `pb-[calc(X+env(safe-area-inset-bottom))]`.

**ShareButton placement:**
- Floating `top-3 right-3 z-30` overlaid `SearchTrigger` in mobile header. Fixed: mobile instance inside header, floating gated behind `hidden sm:block`.

**Typewriter placeholder:**
- `use-typewriter.ts` — cyclic typing of 6 strings. Restart on locale switch via `texts.join('\u0000')` deps.
- Caret via `animate-pulse` (later reworked in 0.16.0).

### 2026-10-06 (v0.13.0)

**Related links fixes:**
1. `lorem-ipsum` slug — `word-counter` and `case-converter` referenced `'lorem-ipsum'`, actual slug is `'lorem-ipsum-generator'`. Fixed.
2. `pdf-to-image` orphan — removed from `images-to-pdf.related`.

**Yandex SEO:**
- `robots.ts` — Clean-param directive. Removed deprecated `Host`.

**Global units:**
- `heart-rate-zones-calculator` — units rendered as raw keys before fix.

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
- `globals.css` — scrollbar fixes.
- `.vscode/settings.json` — TS Server memory + watcher excludes.