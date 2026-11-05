# Sylejman Dev — Portfolio

A one-page portfolio for Sylejman Dev, a web developer based in Gjilan, Kosovo. The site is built with plain HTML, CSS and JavaScript, with GSAP animations loaded from jsDelivr.

## Run it

Opening `index.html` directly works. For the best scrolling animations, serve the folder locally:

```bash
npx -y http-server@14.1.1 -p 5173 -c-1
```

Then open http://localhost:5173.

## What's on the page

- **Intro:** name, role and location.
- **Project:** Autodekor AMBRA, a sales website for vehicle accessories, linked to https://autodekorambra.com/. Shown with real desktop and phone screenshots (`assets/autodekorambra-*.jpg`) and a list of features.
- **About:** a short introduction and three services.
- **Contact:** email link to `sylaksa@gmail.com`.

The visual style uses translucent "liquid glass" panels and responsive layouts. The portfolio is in Albanian.

Images are self-hosted in `assets/`, including the favicon and the link-preview image (`og-image.png`, 1200×630).

## Status

Still to do: `og:image` must be an absolute URL once the site has a domain. A personal photo, more projects, WhatsApp and GitHub/LinkedIn links are waiting on content.
