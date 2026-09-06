# Youssef Hesham — Portfolio

Automotive CGI, product visualization and concept design. Cairo.

Static site, no build step. Open `index.html`, or serve the folder.

## Structure

| | |
|---|---|
| `index.html` | Home — work, about, experience, contact |
| `GT-002 Case Study.html` | GT-002 concept film case study |
| `style.css` / `case-study.css` | Styles for each page |
| `script.js` | Nav active-section state, scroll reveals |
| `uploads/` | Optimized imagery (~1.7 MB total) |

## Notes for anyone editing

**Images are pre-optimized.** Everything in `uploads/` is capped at what it
actually renders at, roughly 2× for retina. The originals are 16 MB and are
deliberately not in the repo. If you replace an image, resize it to its
rendered box before committing — one 4K file undoes the whole budget.

**The nav's glass effect** is an SVG displacement filter defined inline at the
top of `index.html`. It synthesises a cylindrical-lens ramp from filter
primitives rather than loading a map image, because `feImage` silently does
nothing inside `backdrop-filter` in Chrome. The values are measured, not
guessed — the comment above the filter explains what was verified and which
approach was rejected. Read it before changing them.

**Scroll reveals fail open.** Elements start hidden only when JS has announced
itself, and an inline failsafe in `<head>` clears the hidden state with inline
styles if `script.js` never arrives. Do not move that hiding into CSS alone —
a stale or blocked script would leave the page blank.

**Colour is treated as light.** Each project's hue spills outward from its image
onto the page rather than washing over the photograph. Glows that sit on top of
a render mute it; the technique is a blurred copy of the image behind the tile.

## Deploying

Any static host. For GitHub Pages: Settings → Pages → deploy from `main`, root.
