# Sylejman Sylejmani — Portfolio

A one-page portfolio for Sylejman Sylejmani, a junior full-stack (MERN) developer from Gjilan, Kosovo, with 20+ years in QA/QC. Plain HTML, CSS and JavaScript, no build step. Fonts come from Google Fonts.

Live site: https://sylejman-portfolio.netlify.app/

The layout and content are copied from that live site. The page is styled as a QA inspector's record book. On top of that sits a dark "liquid glass" look, carried over from this repo's earlier design:
- slowly drifting colored light behind the page
- frosted, see-through panels (`.glass`) with a bright edge
- a highlight that follows the mouse
- in Chromium browsers, an SVG filter that bends the light behind each panel. The nav skips this filter, so text that scrolls under it still gets blurred.

## Run it

Needs Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

This starts Vite at http://localhost:5173 and opens it in the browser. The page reloads by itself when you save a file. Vite is used only for local development; the site itself has no build step, and opening `index.html` directly also works.

## What's on the page

- **Intro:** name, short bio and an "inspection tag" profile card over a darkened photo of a laptop showing code (`assets/hero-laptop.webp`), followed by four key numbers. On large screens the hero holds still for a moment while the tag shrinks to 60% and slides into the bottom-right corner. On phones, short screens and with reduced motion it simply scrolls.
- **Projects:** Autodekor AMBRA, Roi Hunting and AMBRA Promo. Each one is shown as an inspection record (what it does, what was verified, its stack), with filter buttons above them.
- **Skills:** grouped skills, each with the projects that used it.
- **Process:** four steps (inspect, build, verify, ship).
- **Experience & education:** a timeline.
- **Contact:** email with a copy button, and GitHub.

Every text is written in English and Albanian. The EN/AL switch in the nav picks one, and the choice is saved in `localStorage`. English is the default. The site is dark only.

## Files

- `index.html`: page markup.
- `styles.css`: all styles.
- `main.js`: language switch, project filter, copy-email button, and the mouse-following glass highlight.

## Status

The site works. It has the live version's layout and content, with the glass look added. The old design's images in `assets/` are no longer used by the page.
