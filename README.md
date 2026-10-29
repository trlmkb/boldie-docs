# Boldie Help

The documentation site for Boldie: how salon owners, managers and staff use the web app, the iPhone app and the
Android app. Built with [Astro Starlight](https://starlight.astro.build): static pages, built-in search, light and dark
themes.

## Run it

Needs Node 22.23.4 or newer (see `.nvmrc`) and pnpm 11.

```bash
pnpm install
pnpm dev       # http://localhost:4321
pnpm build     # static site in dist/
pnpm preview   # serve dist/
```

## Where things are

| Path | What |
|---|---|
| `src/content/docs/*.md` | One page per guide section. The file name is the URL (`calendar.md` → `/calendar/`). |
| `src/content/docs/index.mdx` | The home page. |
| `src/assets/{web,ios,android}/` | Screenshots, referenced from the pages by relative path. Astro converts them to WebP at build time. |
| `src/assets/qa/` | Screenshots reused from the product repo's QA runs. |
| `src/styles/boldie.css` | Boldie's look: monochrome, Helvetica Neue, heavy uppercase headings, hairlines, square corners. |
| `astro.config.mjs` | Site title and the sidebar. A new page needs an entry in `sidebar`. |
| `scripts/split-guide.mjs` | Imports the single-file guide from the product repo (`docs/guide/README.md`). |

## Editing

Edit the pages here. They are the source from now on.

`scripts/split-guide.mjs` made the first version of the pages from the product repo's `docs/guide/README.md`. Running it
again overwrites every guide page, so only use it to re-import the whole guide:

```bash
node scripts/split-guide.mjs ../boldie/docs/guide/README.md
```

Helvetica Neue is licensed, so the site never ships the font. It uses the reader's own copy (every Mac and iPhone has
one) and falls back to Helvetica, then Arial.

## Deploy on Vercel

Import the repository in Vercel. It detects Astro; the defaults are correct:

- Framework preset: Astro
- Build command: `pnpm build`
- Output directory: `dist`
- Node.js version: 24.x

Once the site has its address, set `site` in `astro.config.mjs` to that address. That turns on the sitemap and correct
canonical links.
