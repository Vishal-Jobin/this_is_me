# Your Name — Design & Photography Portfolio

A static, multi-page portfolio for a designer + photographer. Built with
plain HTML/CSS/JS (no build step, no backend) so it deploys directly to
GitHub Pages.

## File structure

```
/
├── index.html          Home
├── work.html            Design work index
├── photography.html     Photography archive + lightbox
├── about.html            About / practice / experience
├── contact.html          Contact
├── assets/
│   ├── css/style.css     Shared design system (tokens, layout, components)
│   ├── js/main.js         Shared behaviour (nav, reveals, lightbox)
│   ├── images/            Design project images go here
│   └── photography/       Photography images go here
└── README.md
```

All five pages are real, separate HTML files linked with relative paths
(`work.html`, not `/work`) — safe for a GitHub Pages project site hosted
under a subdirectory (e.g. `username.github.io/repo-name/`).

## Deploying to GitHub Pages

1. Create a new GitHub repository (public, or private on a paid plan).
2. Upload every file in this folder to the repository root, keeping the
   folder structure above.
3. In the repository, go to **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **Deploy from a branch**.
5. Choose the `main` branch and the `/ (root)` folder, then **Save**.
6. GitHub will publish the site at `https://<username>.github.io/<repo>/`
   within a minute or two. Re-uploading files updates the live site.

No server, database, or build step is required.

## Replacing placeholder content

**Identity** — do a find-and-replace across all `.html` files:
- `Your Name` → your actual name
- `hello@example.com` → your email
- `[Location]` → your city
- `href="#"` on the social links (Instagram, Behance, Are.na, Pinterest,
  LinkedIn) → your real profile URLs

**Design (`assets/css/style.css`, top of file)**
- Colours: edit the `:root` custom properties (`--color-bg`, `--color-accent`, etc.)
- Fonts: the `@import` line pulls Fraunces, Bricolage Grotesque, Work Sans
  and IBM Plex Mono from Google Fonts — swap the font-family values in
  `--font-display / --font-head / --font-body / --font-mono` to change them

**Images** — every `<img>` currently points to a placeholder URL from
`picsum.photos` (a free placeholder image service, used here in place of
real photography so the layouts render immediately). Replace each `src`
(and `data-full` for photography lightbox images) with your own file,
e.g. `assets/images/project-01.jpg` or `assets/photography/soft-concrete-01.jpg`.

**Design projects** — see the guide at the bottom of `work.html`, and the
`<!-- COPY FROM HERE TO ADD NEW PROJECT -->` / `<!-- END PROJECT -->`
comment blocks inside it. Copy a block, paste it below the last project,
edit the number, title, category, year and image, and link `href="#"`
to a project detail page once you build one.

**Photography series** — see the guide at the bottom of `photography.html`,
and the `<!-- COPY FROM HERE TO ADD NEW PHOTO SERIES -->` /
`<!-- END PHOTO SERIES -->` blocks. Each series is a self-contained
`<div class="photo-series">`; each photograph inside it is a
`<figure class="ph ...">` marked `<!-- ADD / DUPLICATE PHOTO -->` —
duplicate that figure to add more images to a series. The lightbox
(click-to-enlarge, arrow-key navigation) picks up new photographs
automatically — no JavaScript edits needed.

**About page** — edit the biography paragraphs, the stat grid numbers,
and the client/exhibition/publication list rows directly in `about.html`.

## Notes on what's included vs. left out

- Individual project/series **detail pages** (e.g. `project-01.html`,
  `photo-series-01.html`) were left out of this pass to keep the initial
  build focused — the index pages currently link to `href="#"` where a
  detail page would go. Say the word and I'll build a detail-page template
  next, matching this same design system.
- Animation is intentionally restrained: a scroll-reveal on each section
  and a light GSAP entrance on the hero, nothing that fights the
  photography. `prefers-reduced-motion` is respected throughout.
- No custom cursor or WebGL — the references leaned on strong typography
  and photography rather than technical flourish, so this build does too.
