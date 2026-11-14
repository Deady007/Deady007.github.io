# Viral Parmar - Systems, Cybersecurity & Product Engineering Portfolio

Personal engineering and business analysis portfolio for **Viral Parmar**, built on the Hallmark design system with universal token switching across all **50 Hallmark Themes** and dedicated multi-page architecture.

## Overview

- **Owner:** Viral Parmar (Vadodara, Gujarat, India)
- **Roles:** Business Analyst, Cybersecurity Analyst Candidate, Full-Stack Systems Engineer
- **Live User Site:** [https://deady007.github.io/](https://deady007.github.io/)
- **Repository Portfolio:** [https://deady007.github.io/Portfolio/](https://deady007.github.io/Portfolio/)
- **GitHub Profile:** [@Deady007](https://github.com/Deady007)

## Dynamic Multi-Page Architecture

1. **Mission Control (`index.html`):** Executive telemetry, disciplinary competencies (Cybersecurity, Agile PO, Full-Stack Development), featured enterprise systems, and terminal preview.
2. **Projects & Repositories (`projects.html`):** In-depth engineering specifications for PO Copilot, Sprint0 Flow Analytics, LinQ Enterprise HRMS, Suleshvari Pharma ERP, BioCare LIMS, Deepak Foundation Health Portal, and CoreKit Microservices Mesh.
3. **Cybersecurity & GxP Compliance (`compliance.html`):** Traceability verification against US FDA 21 CFR §11.10(e), §11.50, ALCOA+ principles, and Tata Group Cybersecurity Analyst simulation findings.
4. **Agile Product Ownership (`agile-po.html`):** Deterministic user stories, Given/When/Then acceptance criteria, form validation matrices, and two-tier context reporting models.
5. **Interactive Systems Terminal (`console.html`):** Live CLI terminal supporting commands: `help`, `whoami`, `skills`, `repos`, `audit --project sppl`, `audit --project linq`, `telemetry`, `certifications`, `themes`, `theme <slug>`, and `contact`.
6. **About & Credentials (`about.html`):** Academic foundation at The Maharaja Sayajirao University of Baroda (BCA 2022-2025), experience at Fiscal Ox and Deepak Foundation, and direct resume download.
7. **50 Hallmark Themes Showcase (`themes.html`):** Complete gallery displaying all 50 Hallmark design themes with live palette swatches, typography pairing specifications, and instant theme activation.

## 50 Hallmark Portfolios Directory (`portfolios/`)

Includes 50 standalone, pre-rendered portfolio instances under `portfolios/`:
`almanac.html`, `arcade.html`, `atelier.html`, `bloom.html`, `blueprint.html`, `broadside.html`, `brutal.html`, `carnival.html`, `cobalt.html`, `console.html`, `coral.html`, `darkroom.html`, `dose.html`, `dusk.html`, `editorial.html`, `formwork.html`, `furrow.html`, `garden.html`, `grid.html`, `halftone.html`, `hedgerow.html`, `hum.html`, `ink.html`, `kiln.html`, `loom.html`, `lumen.html`, `manifesto.html`, `midnight.html`, `newsprint.html`, `overprint.html`, `pasteup.html`, `piste.html`, `refract.html`, `ribbon.html`, `rim.html`, `riso.html`, `solstice.html`, `specimen.html`, `spore.html`, `sport.html`, `squeeze.html`, `sticker.html`, `studio.html`, `terminal.html`, `terrazzo.html`, `ultraviolet.html`, `vantage.html`, `vellum.html`, `wayfind.html`, and `werkstatt.html`.

## Real-Time Theme Switcher

- Available on every page through the top navigation button.
- Smooth drawer modal with instant theme search and genre filters (`Modern Minimal`, `Editorial`, `Atmospheric`, `Playful`).
- Instantly overrides CSS tokens (`--color-paper`, `--color-ink`, `--color-accent`, typography, radiuses) with zero-flash execution.
- Persisted across navigation sessions via `localStorage`.

## Local Development & Build

```bash
# Rebuild all pages, themes, and 50 portfolios:
node scripts/build.mjs

# Preview locally:
python3 -m http.server 3000
```
