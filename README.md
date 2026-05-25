# malperdy.dev

The Malperdy Labs site. A static, markdown-driven site built with
[Eleventy](https://www.11ty.dev/) and deployed to GitHub Pages. No
framework, no JavaScript, no tracking.

## Develop

```bash
npm install                 # first time only
npx @11ty/eleventy --serve  # http://localhost:8080
```

## Add a note

Drop a markdown file in `src/notes/`:

```markdown
---
layout: post.njk
title: Your title here
date: 2026-05-24
---

Body in markdown.
```

It appears in `/notes/` (newest first) with its own page — no further
config.

## Structure

- `src/index.njk` — home / ethos
- `src/projects.njk` — project cards
- `src/notes/` — notes, one markdown file each
- `src/_data/site.json` — site-wide metadata (name, tagline, contact)
- `src/_includes/` — layouts (`base.njk`, `post.njk`)
- `src/css/style.css` — styles

## Design

Dark, typographic, restrained. One warm accent (`#d98a4e`). Monospace for
structure, serif for prose, a narrow reading measure. The fox (🦊) is the
only ornament — used in the wordmark and favicon, not belaboured.

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds
with Eleventy and publishes to GitHub Pages. The custom domain is set in
the repo's **Settings → Pages**.
