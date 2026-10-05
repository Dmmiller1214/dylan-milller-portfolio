# Portfolio

A frontend portfolio site built around a classical-sculpture visual theme:
ivory and warm white surfaces, charcoal type, a faint stone grain, and restrained
bronze accents. Five projects each get an overview row on the home page and a
linkable case-study page.

## Running locally

```bash
npm install
npm run dev
```

The dev server listens on [http://localhost:43127](http://localhost:43127).

| Script              | What it does               |
| ------------------- | -------------------------- |
| `npm run dev`       | Dev server with Turbopack  |
| `npm run build`     | Production build           |
| `npm run start`     | Serve the production build |
| `npm run lint`      | ESLint                     |
| `npm run typecheck` | `tsc --noEmit`             |

## Editing the content

**Everything you need to change lives in one file: `src/content/portfolio.ts`.**
No component edits are required to fill the site in.

Any string wrapped in square brackets — `"[like this]"` — is a placeholder. The
UI detects that convention, renders those passages with a dotted underline so
they can't be mistaken for finished copy, and shows a draft notice at the top of
every page while any remain. Replace the last bracketed string and the notice
disappears on its own.

The file is organised as:

| Export        | Covers                                                        |
| ------------- | ------------------------------------------------------------- |
| `profile`     | Name, role, headline, intro, optional location, canonical URL |
| `projects`    | All five projects, live links, screenshots, optional detail    |
| `about`       | About paragraphs, optional interests, optional portrait       |
| `skillGroups` | Grouped skill lists                                           |
| `practices`   | The four craft commitments                                    |
| `contact`     | Headline, invitation, GitHub, LinkedIn, optional email/résumé |
| `navigation`  | Nav labels and anchors                                        |

Nothing in this repository claims technologies, employment, client work, metrics,
testimonials or results that have not been supplied. `project.detail.results` is
empty for every project — populate it only with figures you can stand behind,
and the results block appears automatically. Left empty, it is omitted.

### Adding a project screenshot

Put a 16:10 WebP in `public/projects/`, then point the project at it:

```ts
screenshot: {
  src: "/projects/summarist.webp",
  alt: "Summarist home page showing …",
  width: 1760,
  height: 1100,
},
```

The current captures were taken from the live sites with
`node scripts/capture-projects.mjs`. Re-run that after a redeploy. With
`screenshot: null` the frame renders a labelled placeholder panel at the same
size instead.

### Adding your résumé

Drop the PDF in `public/` and set `contact.resumeUrl` to its path, e.g.
`"/dylan-miller-resume.pdf"`. While it's `null` the download button is omitted
rather than dead-linked. Email is omitted the same way until `contact.email` is
set.

### Before deploying

Set `profile.siteUrl` to the real domain — it backs `metadataBase`, the canonical
URL and the Open Graph tags.

## Design system

Tokens live at the top of `src/app/globals.css`:

- `--ivory` `#f7f4ef` page ground, `--alabaster` `#fdfbf7` panels
- `--charcoal` `#1c1a17` primary type, `--graphite` `#6b655c` secondary type
- `--bronze` `#8a5d34` for text and links, `--bronze-soft` `#9a6b3f` for
  decorative rules only

Both text colours clear 5.2:1 against the ivory ground, so body copy and bronze
links meet WCAG AA. `--bronze-soft` sits at 4.2:1 and is therefore never used for
text.

Type pairs Cormorant Garamond (display) with Inter (body), both self-hosted
through `next/font`. Custom utilities — `display-xl`, `eyebrow`, `measure`,
`stone-grain`, `link-quiet` — are defined alongside the tokens.

## Accessibility and motion

- Semantic landmarks, a skip link, and one visible focus treatment across the
  site. `axe-core` reports no WCAG 2 A/AA violations on any route at mobile,
  tablet or desktop widths.
- Scroll reveals and the sculpture parallax both switch off under
  `prefers-reduced-motion: reduce`, which is also honoured globally in CSS.
- Reveal animations are applied from JavaScript, so content is fully visible
  without it. They run off one shared, rAF-throttled scroll pass rather than
  `IntersectionObserver`: an observer only fires on threshold crossings, so an
  element carried from below the fold to above it in a single jump — an anchor
  link, a fast flick, a restored scroll position — never reports, and would stay
  invisible for good.
- Closing the mobile sheet never moves the page. The dialog restores focus to
  its trigger on the way out, and because that trigger sits in a sticky bar the
  browser scrolls to where the bar lives in the document rather than where it is
  painted, throwing the reader hundreds of pixels back up the page. Focus is
  restored by hand instead, with scrolling suppressed: to the destination
  heading when a navigation link closed the sheet, and to the trigger otherwise.

## Review scripts

Three Playwright helpers for checking changes. Each takes a base URL, needs a
server already running, and a one-off `npx playwright install chromium`.

Point them at a production server (`npm run build && npm start`), not `npm run
dev`. The dev server compiles routes on first request, which inflates the
performance numbers and is slow enough that `review:a11y` reports a working
mobile menu as broken.

```bash
npm run review:a11y  -- http://127.0.0.1:43127   # axe-core, every route × 3 widths
npm run review:shots -- http://127.0.0.1:43127   # full-page shots, overflow, tab order
npm run review:perf  -- http://127.0.0.1:43127   # transfer weight, LCP, CLS
```

`review:shots` also reports horizontal overflow, whether the desktop nav and the
mobile trigger are showing at each width, and anything left stuck in the hidden
reveal state.

Current numbers against a production build: 239 KB of compressed HTML, JS and
CSS, 63 KB of images, CLS 0 including a full scroll of the page.

## Stack

Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · shadcn/ui ·
lucide-react

Every route is prerendered as static HTML.

The marble imagery in `src/assets/sculptures/` is generated artwork, served as
WebP through `next/image` with blur placeholders and intrinsic dimensions, so it
contributes no layout shift. The GitHub and LinkedIn glyphs in
`src/components/brand-icons.tsx` are drawn locally because lucide-react 1.x no
longer ships brand marks.
