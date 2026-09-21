# Design: Portfolio

A locked design system for this app. Every page redesign reads this file before
emitting code. Do not regenerate per page, extend or amend this file when the
system needs to grow.

## Genre
editorial

## Macrostructure family
- **Home (a single-page profile)** (intro + Projects + Hobbies + Living Dashboard + Message board + Songs & playlists): **Portfolio Grid**, adapted without boxes: Projects, Experience, and the dashboard are hairline-separated typographic lists (no fabricated project thumbnails); real card art appears only on Hobbies. No separate pages or nav tabs; the message board and song board sit in a right-hand column on wide screens (input on top, submissions listed beneath) and stack below on small ones.

## Theme: Garden
- `--color-paper`    oklch(97% 0.010 140)
- `--color-paper-2`  oklch(94% 0.012 140)
- `--color-rule`     oklch(84% 0.010 140)
- `--color-neutral`  oklch(56% 0.010 140)
- `--color-muted`    oklch(46% 0.010 140)
- `--color-ink`      oklch(20% 0.012 140)
- `--color-ink-2`    oklch(30% 0.012 140)
- `--color-accent`   oklch(50% 0.140 148)
- `--color-accent-ink` oklch(98% 0.010 148)
- `--color-focus`    oklch(55% 0.160 148)
- `--color-error`    oklch(58% 0.200 25)

Dark mode (same anchor hue 148/140, lightness + chroma only move, see [`color.md`](.claude/skills/hallmark/references/color.md)):
- `--color-paper` oklch(15% 0.012 140) · `--color-paper-2` oklch(19% 0.013 140)
- `--color-rule` oklch(32% 0.010 140) · `--color-neutral` oklch(62% 0.008 140) · `--color-muted` oklch(72% 0.008 140)
- `--color-ink` oklch(94% 0.008 140) · `--color-ink-2` oklch(88% 0.008 140)
- `--color-accent` oklch(68% 0.130 148) · `--color-accent-ink` oklch(14% 0.010 148)
- `--color-focus` oklch(72% 0.140 148) · `--color-error` oklch(68% 0.180 25)

Paper band: light. Display style: classical-serif (Newsreader). Accent hue: chromatic-other (leaf-green, ~148°).

## Typography
- Display + wordmark: **Newsreader**, weight 600 (headings), 400 italic (salutations/emphasis)
- Body: **IBM Plex Sans**, weight 400
- Outlier (≤2 slots, dashboard stats + card index numbers only): **Geist Mono**
- Display tracking: -0.02em
- Type scale: 1.25 ratio, `--text-display: clamp(2.75rem, 5vw + 1rem, 5.25rem)`

## Spacing
4-pt named scale in `tokens.css` (`--space-3xs` … `--space-4xl`). Components use named tokens, never raw px.

## Motion
- Easings: `--ease-out: cubic-bezier(0.16,1,0.3,1)`, `--ease-in: cubic-bezier(0.7,0,0.84,0)`, `--ease-in-out: cubic-bezier(0.65,0,0.35,1)`
- Reveal pattern: one page-load stagger on Home only (Portfolio Grid is not a default-on motion archetype under editorial genre).
- Reduced-motion fallback: opacity-only, ≤150ms.

## Microinteractions stance
- Silent success (board submissions just appear in the list, no toast, no banner).
- Hover delay 800ms / focus delay 0ms on any tooltip.
- Button/link hover: single signal (1px lift or underline), never combined.

## CTA voice
- Primary: C1 Outlined chip, bordered, transparent, typographic verb ("Post message", "Share").
- Secondary/links: C3 Typographic link, underline + arrow, no box.

## Per-page allowances
- Home MAY use the page-load stagger reveal (Portfolio Grid default).
- No hero enrichment (illustration/video) anywhere, typographic only, per the honest-content rule (no fabricated imagery).

## What pages MUST share
- Wordmark (Newsreader, set in the nav masthead + footer signoff).
- The accent colour (leaf-green, ≤3% of any view) and its placement (links, focus rings, active states only).
- Display + body fonts.
- CTA voice (outlined chip primary, typographic link secondary).
- Nav: **N6 Newspaper Masthead** (centred wordmark, double rule), no link row; everything lives on one page.
- Footer: **Ft6 Letter Close** ("Yours, [Name]." + P.S. line).

## What pages MAY differ on
- Section-level layout within the single Home page.
- Section-head treatment within the family's allowance.

## Exports

### tokens.css
See `/tokens.css` at the project root, the canonical token file every component imports by name.

### Tailwind v4 `@theme`
Mapped inline in `src/app/globals.css` (`--color-*`, `--font-*`, `--spacing-*` mirror `tokens.css`).
