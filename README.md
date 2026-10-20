# Ashutosh Joge — Portfolio

A responsive portfolio built with plain HTML, CSS and JavaScript. Eight section files are assembled into the page, then the case studies, timeline and testimonials are rendered from JSON. No package installation or build step is required.

## Run locally

With Node.js 18 or newer installed, open a terminal in this folder and run:

```sh
npm start
```

Open **http://localhost:8000**. Stop the server with `Ctrl+C`. Edit any content or style file and refresh the browser to see the change. `npm run dev` runs the same server.

If PowerShell blocks the npm script shim, use `npm.cmd start` or `node server.cjs`.

To use another port in PowerShell:

```powershell
$env:PORT = "8001"
npm.cmd start
```

Use the local server instead of double-clicking `index.html`: browsers restrict the section and JSON fetches on `file://` URLs. The preview server binds only to this computer.

## Structure and editing

| Location | Purpose |
| --- | --- |
| `public/index.html` | Navigation, section mount points and footer |
| `public/sections/` | Hero, pivot, thinking, work, record, proof, models and contact |
| `public/css/` | Shared tokens and base styles, plus one stylesheet per section |
| `public/data/projects.json` | Case studies and their metrics |
| `public/data/experience.json` | Work and education timeline |
| `public/data/testimonials.json` | Quotes and attribution |
| `public/assets/` | Images and résumé |
| `public/js/main.js` | Section assembly, mobile menu and initial anchor navigation |
| `public/js/data.js` | Independent JSON loading and text-safe rendering |
| `server.cjs` | Dependency-free local preview server |

Change `public/css/tokens.css` to update the colors, fonts or page width. To add a section, add its HTML file, mount point in `public/index.html`, and entry in `public/js/main.js`; link its stylesheet from `public/index.html` if needed.

## Profile photo and résumé

The portfolio uses the supplied assets:

- `public/assets/picofme (3).png` — the yellow-background profile photo in `public/sections/pivot.html`, displayed without cropping. The alternate `picofme (2).png` remains available in assets.
- `public/assets/Ashutosh_Joge.pdf` — linked by the Download résumé (PDF) button in `public/sections/hero.html`.

Replace these files to update the assets, or change the corresponding HTML paths if you use different filenames. The AJ monogram remains the favicon.

Google Fonts are optional external resources; system fallback fonts keep the portfolio readable without them.

## Hosting

The site can be served by any static host. Publish the contents of `public/` together, preserving the `css`, `js`, `sections`, `data` and `assets` paths. The Node preview server and `package.json` are not needed for static hosting.
