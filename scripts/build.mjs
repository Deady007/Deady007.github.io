import fs from 'node:fs';
import path from 'node:path';

const ROOT_DIR = '/home/viral/portfolio';
const THEMES_DIR = '/home/viral/hallmark/skills/hallmark/references/themes';
const INDEX_PATH = path.join(THEMES_DIR, 'index.json');

const rawIndex = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
const themesList = rawIndex.themes;

function tokenBlockOf(src) {
  const m = /```css\s*\n:root\s*\{([\s\S]*?)\n\}\s*\n```/.exec(src);
  return m ? m[1].replace(/\/\*[\s\S]*?\*\//g, '').trim() : '';
}

// Process all 50 themes
const processedThemes = [];
for (const t of themesList) {
  const file = path.join(THEMES_DIR, `${t.slug}.md`);
  const src = fs.readFileSync(file, 'utf8');
  const block = tokenBlockOf(src);
  
  const paper = (block.match(/--color-paper:\s*([^;]+);/) || [])[1] || 'oklch(17% 0.008 250)';
  const paper2 = (block.match(/--color-paper-2:\s*([^;]+);/) || [])[1] || 'oklch(21% 0.009 250)';
  const accent = (block.match(/--color-accent:\s*([^;]+);/) || [])[1] || 'oklch(82% 0.15 80)';
  const ink = (block.match(/--color-ink:\s*([^;]+);/) || [])[1] || 'oklch(95% 0.005 250)';
  const rule = (block.match(/--color-rule:\s*([^;]+);/) || [])[1] || 'oklch(31% 0.01 250)';
  const fontDisplay = (block.match(/--font-display:\s*([^;]+);/) || [])[1] || `"${t.display.face}", sans-serif`;

  processedThemes.push({
    slug: t.slug,
    name: t.name,
    genre: t.genre,
    posture: t.posture,
    displayFace: t.display.face,
    material: t.material,
    paperBand: t.paper.band,
    accentBand: t.accent.band,
    swatches: { paper, paper2, rule, accent, ink },
    fontDisplay,
    block
  });
}

console.log(`Processed ${processedThemes.length} Hallmark themes.`);

// Ensure directories
fs.mkdirSync(path.join(ROOT_DIR, 'css'), { recursive: true });
fs.mkdirSync(path.join(ROOT_DIR, 'js'), { recursive: true });
fs.mkdirSync(path.join(ROOT_DIR, 'portfolios'), { recursive: true });

// 1. Generate css/themes.css
let themesCss = `/* Hallmark: 50 theme definitions engine */
:root {
  color-scheme: dark;
  --space-3xs: 2px; --space-2xs: 4px; --space-xs: 8px; --space-sm: 12px; --space-md: 16px; --space-lg: 24px; --space-xl: 40px; --space-2xl: 64px; --space-3xl: 96px; --space-4xl: 144px;
  --text-xs: 0.8125rem; --text-sm: 0.875rem; --text-md: 1rem; --text-lg: 1.25rem; --text-xl: 1.5625rem; --text-2xl: 1.953rem; --text-3xl: 2.441rem;
  --text-display-s: clamp(2.25rem, 4vw + 0.5rem, 3.75rem); --text-display: clamp(2.75rem, 5vw + 1rem, 5.25rem);
  --text-section: clamp(2rem, 2.5vw + 1rem, 3.5rem); --text-title: clamp(1.25rem, 0.75vw + 0.875rem, 1.625rem); --text-lead: clamp(1.125rem, 0.35vw + 1rem, 1.375rem);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1); --ease-in: cubic-bezier(0.7, 0, 0.84, 0); --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 120ms; --dur-short: 220ms; --dur-long: 420ms;
  --color-error: oklch(72% 0.15 27); --color-success: oklch(76% 0.13 150);
  --container: 1440px; --gutter: 48px; --gap-columns: 24px;
  --z-base: 1; --z-raised: 10; --z-dropdown: 100; --z-sticky: 200; --z-sticky-nav: 300; --z-modal: 400; --z-toast: 500; --z-tooltip: 600;

  /* Default Console Tokens */
  --color-paper: oklch(17% 0.008 250); --color-paper-2: oklch(21% 0.009 250); --color-paper-3: oklch(13.5% 0.007 250);
  --color-ink: oklch(95% 0.005 250); --color-ink-2: oklch(83% 0.008 250); --color-muted: oklch(71% 0.01 250);
  --color-rule: oklch(31% 0.01 250); --color-rule-2: oklch(42% 0.012 250);
  --color-accent: oklch(82% 0.15 80); --color-accent-ink: oklch(18% 0.04 75); --color-accent-soft: oklch(29% 0.05 80); --color-focus: oklch(82% 0.15 80);
  --color-cool: oklch(77% 0.12 245); --color-cool-soft: oklch(29% 0.05 245);
  --color-ok: oklch(76% 0.15 150); --color-ok-soft: oklch(24.5% 0.03 150); --color-bad: oklch(70% 0.17 25); --color-bad-soft: oklch(24.5% 0.035 25);
  --font-display: "Host Grotesk", ui-sans-serif, system-ui, sans-serif; --font-body: var(--font-display);
  --font-outlier: "Atkinson Hyperlegible Mono", ui-monospace, monospace;
  --radius-card: 10px; --radius-pill: 6px; --rule-hair: 1px;
  --shadow-card: none;
  --tracking-display: -0.03em; --display-weight: 500;
}
`;

for (const t of processedThemes) {
  const scheme = t.paperBand === 'dark' ? 'dark' : 'light';
  themesCss += `
[data-theme="${t.slug}"] {
  color-scheme: ${scheme};
  ${t.block}
}
`;
}

fs.writeFileSync(path.join(ROOT_DIR, 'css', 'themes.css'), themesCss);
console.log('Wrote css/themes.css');

// 2. Generate js/themes-data.js
const clientThemes = processedThemes.map(t => ({
  slug: t.slug,
  name: t.name,
  genre: t.genre,
  posture: t.posture,
  displayFace: t.displayFace,
  paperBand: t.paperBand,
  material: t.material,
  swatches: t.swatches
}));

fs.writeFileSync(path.join(ROOT_DIR, 'js', 'themes-data.js'), `window.HALLMARK_THEMES = ${JSON.stringify(clientThemes, null, 2)};\n`);
console.log('Wrote js/themes-data.js');

// 3. Navigation and Common Layout Components
function getNavHtml(activePage) {
  const pages = [
    { href: 'index.html', label: 'Overview', id: 'overview' },
    { href: 'projects.html', label: 'Projects', id: 'projects' },
    { href: 'compliance.html', label: 'Compliance & GxP', id: 'compliance' },
    { href: 'agile-po.html', label: 'Agile PO', id: 'agile-po' },
    { href: 'console.html', label: 'Terminal', id: 'console' },
    { href: 'about.html', label: 'About', id: 'about' },
    { href: 'themes.html', label: '50 Themes', id: 'themes' }
  ];

  const desktopLinks = pages.map(p => `
    <a href="${p.href}" class="nav-link ${p.id === activePage ? 'active' : ''}">${p.label}</a>
  `).join('');

  const mobileLinks = pages.map(p => `
    <a href="${p.href}" class="mobile-nav-link ${p.id === activePage ? 'active' : ''}">${p.label}</a>
  `).join('');

  return {
    desktop: desktopLinks,
    mobile: mobileLinks
  };
}

function getHeaderHtml(activePage, isSubdir = false) {
  const prefix = isSubdir ? '../' : '';
  const nav = getNavHtml(activePage);

  return `
  <header class="site-header">
    <div class="container header-inner">
      <a href="${prefix}index.html" class="brand-link">
        <span class="status-indicator"></span>
        <span class="brand-name">Viral Parmar</span>
        <span class="brand-role">Systems & BA</span>
      </a>

      <nav class="site-nav" id="site-nav">
        ${nav.desktop}
      </nav>

      <div class="header-actions">
        <button type="button" class="theme-trigger-btn" id="theme-trigger-btn" aria-label="Open Hallmark Theme Switcher">
          <span>Theme:</span>
          <span class="theme-current-label" id="current-theme-name">Console</span>
        </button>

        <a href="${prefix}Viral_Parmar_Resume.pdf" download class="btn btn--sm">Resume</a>

        <button type="button" class="nav-toggle-btn" id="nav-toggle-btn" aria-label="Toggle navigation menu">
          <span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Drawer -->
  <div class="mobile-nav-backdrop" id="mobile-nav-backdrop"></div>
  <aside class="mobile-nav-drawer" id="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
    <div class="mobile-nav-header">
      <span class="brand-name">Viral Parmar</span>
      <button type="button" class="theme-drawer-close" id="mobile-nav-close" aria-label="Close menu">✕</button>
    </div>
    <div class="mobile-nav-links">
      ${nav.mobile}
    </div>
  </aside>

  <!-- Theme Switcher Drawer Modal -->
  <div class="theme-drawer-backdrop" id="theme-drawer-backdrop"></div>
  <aside class="theme-drawer" id="theme-drawer" role="dialog" aria-modal="true" aria-label="Hallmark Theme Selector">
    <div class="theme-drawer-header">
      <div>
        <h3 class="theme-drawer-title">Hallmark 50 Themes</h3>
        <p class="theme-drawer-desc">Select any of the 50 Hallmark design themes to apply across the entire site instantly.</p>
      </div>
      <button type="button" class="theme-drawer-close" id="theme-drawer-close" aria-label="Close theme switcher">✕</button>
    </div>

    <div class="theme-drawer-controls">
      <input type="text" id="theme-search" class="theme-search-input" placeholder="Search themes, fonts, genres...">
      <div class="theme-genre-tabs" id="theme-genre-tabs">
        <button class="genre-tab active" data-genre="all">All (50)</button>
        <button class="genre-tab" data-genre="modern-minimal">Modern Minimal (12)</button>
        <button class="genre-tab" data-genre="editorial">Editorial (20)</button>
        <button class="genre-tab" data-genre="atmospheric">Atmospheric (9)</button>
        <button class="genre-tab" data-genre="playful">Playful (9)</button>
      </div>
    </div>

    <div class="theme-drawer-grid" id="theme-drawer-grid"></div>

    <div class="theme-drawer-footer">
      <button type="button" class="btn btn--sm" id="random-theme-btn">Pick Random Theme</button>
      <a href="${prefix}themes.html" class="link-discrete" style="font-size: 0.8125rem; color: var(--color-muted);">Browse 50 themes directory</a>
    </div>
  </aside>
  `;
}

function getFooterHtml(isSubdir = false) {
  const prefix = isSubdir ? '../' : '';
  return `
  <footer class="site-footer">
    <div class="container footer-inner">
      <div>
        <span style="font-weight: 600; color: var(--color-ink);">Viral Parmar</span>
        <span style="margin-inline: 8px;">(Vadodara, Gujarat, India)</span>
        <span class="measured">parmarviral397@gmail.com</span>
      </div>

      <div class="footer-links">
        <a href="https://github.com/Deady007" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://linkedin.com/in/parmar-viral-13m711" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="tel:6351493983">+91 6351493983</a>
        <a href="${prefix}Viral_Parmar_Resume.pdf" download>Resume</a>
      </div>
    </div>
  </footer>
  `;
}

function wrapPage(options) {
  const { title, activePage, content, isSubdir = false } = options;
  const prefix = isSubdir ? '../' : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Viral Parmar Portfolio</title>
  <meta name="description" content="Personal portfolio for Viral Parmar: Business Analyst, Cybersecurity Candidate, and Full-Stack Systems Engineer in Vadodara, India.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:ital,wght@0,400..700;1,400..700&family=Host+Grotesk:ital,wght@0,300..800;1,300..800&family=Chakra+Petch:wght@400;600;700&family=Instrument+Serif:ital@0;1&family=Syne:wght@500;700&family=Sofia+Sans+Extra+Condensed:wght@400;700&family=Hanken+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
  <script>(function(){const t=localStorage.getItem('hallmark_theme')||'console';document.documentElement.setAttribute('data-theme',t);})();</script>
  <link rel="stylesheet" href="${prefix}css/main.css">
</head>
<body>
  ${getHeaderHtml(activePage, isSubdir)}

  <main id="main-content">
    ${content}
  </main>

  ${getFooterHtml(isSubdir)}

  <script src="${prefix}js/themes-data.js"></script>
  <script src="${prefix}js/theme-switcher.js"></script>
  <script src="${prefix}js/console.js"></script>
</body>
</html>`;
}

// 4. Generate Page 1: index.html (Mission Control & Executive Overview)
const indexContent = `
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <h1 class="hero-title">Viral Parmar</h1>
        <div class="hero-subhead">Business analyst, cybersecurity candidate, and full-stack systems engineer</div>

        <div class="hero-badge">
          <span class="status-indicator"></span>
          <span>Available for business analyst and cybersecurity analyst roles</span>
        </div>

        <p class="hero-lead">
          Translating enterprise requirements into deterministic stories, electronic records, and access-governed workflows.
        </p>

        <div class="hero-cta">
          <a href="projects.html" class="btn btn--primary">View enterprise projects</a>
          <a href="compliance.html" class="btn">Security & GxP matrix</a>
          <a href="themes.html" class="btn">Hallmark 50-theme studio</a>
        </div>
      </div>

      <!-- Telemetry Card -->
      <div class="surface">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <span class="measured" style="color: var(--color-cool); font-size: 0.8125rem;">Live system telemetry</span>
          <span class="chip chip--accent">BCA 2025</span>
        </div>

        <div class="telemetry-grid">
          <div class="telemetry-item">
            <div class="telemetry-num measured">50+</div>
            <div class="telemetry-label">GitHub repositories (@Deady007)</div>
          </div>
          <div class="telemetry-item">
            <div class="telemetry-num measured">95.7%</div>
            <div class="telemetry-label">SPPL ERP completion (178/186)</div>
          </div>
          <div class="telemetry-item">
            <div class="telemetry-num measured">100%</div>
            <div class="telemetry-label">LinQ HRMS delivery (176 stories)</div>
          </div>
          <div class="telemetry-item">
            <div class="telemetry-num measured">28 Tests</div>
            <div class="telemetry-label">PO Copilot unit suite (0.895s)</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Disciplinary Competencies -->
  <section class="section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Core technical & analytical disciplines</h2>
        <p class="section-desc">Practical capability across regulatory data integrity, structured product ownership, and multi-tier application development.</p>
      </div>

      <div class="cards-grid">
        <div class="surface">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="font-size: 1.125rem; font-weight: 600;">Cybersecurity & data integrity</h3>
            <span class="chip chip--accent">21 CFR §11</span>
          </div>
          <p style="font-size: 0.875rem; color: var(--color-muted); margin-bottom: 12px;">
            Ensuring electronic records comply with US FDA 21 CFR Part 11, EU GMP Annex 11, and ALCOA+ principles through gapless audit trails and RBAC.
          </p>
          <ul class="project-meta-list">
            <li>Immutable change logs & actor attribution</li>
            <li>Session timeout & invalidation boundaries</li>
            <li>Tata Group threat intelligence & anomaly detection</li>
          </ul>
        </div>

        <div class="surface">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="font-size: 1.125rem; font-weight: 600;">Agile product ownership</h3>
            <span class="chip chip--accent">Sprint0 PO</span>
          </div>
          <p style="font-size: 0.875rem; color: var(--color-muted); margin-bottom: 12px;">
            Decomposing client operations into developer-ready requirement stories, form matrices, and acceptance criteria.
          </p>
          <ul class="project-meta-list">
            <li>Given/When/Then acceptance criteria</li>
            <li>Sprint0 flow analytics & Markov delivery risk modeling</li>
            <li>Cross-functional stakeholder consensus</li>
          </ul>
        </div>

        <div class="surface">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="font-size: 1.125rem; font-weight: 600;">Full-stack development</h3>
            <span class="chip chip--accent">Laravel & React</span>
          </div>
          <p style="font-size: 0.875rem; color: var(--color-muted); margin-bottom: 12px;">
            Architecting database-backed web applications, microservices, and client tooling using modern web technologies.
          </p>
          <ul class="project-meta-list">
            <li>PHP/Laravel, Python Flask, TypeScript & Node.js</li>
            <li>SQLite WAL mode, MySQL, MongoDB schema design</li>
            <li>Docker containerization & REST API engineering</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Highlights -->
  <section class="section" style="border-top: var(--rule-hair, 1px) solid var(--color-rule);">
    <div class="container">
      <div class="section-header" style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
        <div>
          <h2 class="section-title">Featured enterprise systems</h2>
          <p class="section-desc">Active systems engineered for pharmaceutical manufacturing, enterprise human resources, and developer productivity.</p>
        </div>
        <a href="projects.html" class="btn">View all projects and repositories</a>
      </div>

      <div class="cards-grid">
        <article class="project-card">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h3 class="project-card-title">PO Copilot Desktop</h3>
              <span class="chip chip--accent">Private Tool</span>
            </div>
            <p class="project-card-desc">
              Local desktop workflow tool with SQLite WAL mode persistence, 21 CFR Part 11 electronic signatures, and zero-hallucination activity logging.
            </p>
            <ul class="project-meta-list">
              <li>28 automated unit tests executed in 0.895s</li>
              <li>Two-tier reporting engine (daily delta + cumulative blockers)</li>
              <li>Dual mode session maintainer & automated backup verification</li>
            </ul>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: var(--rule-hair, 1px) solid var(--color-rule); padding-top: 12px;">
            <span class="measured" style="font-size: 0.8125rem; color: var(--color-muted);">Python, SQLite, Bash</span>
            <a href="projects.html#po-copilot" class="btn btn--sm">Specs & Details</a>
          </div>
        </article>

        <article class="project-card">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h3 class="project-card-title">SPPL Pharma ERP</h3>
              <span class="chip chip--accent">GxP Pharma</span>
            </div>
            <p class="project-card-desc">
              Regulated pharmaceutical manufacturing execution system handling Master & Batch Production Control Records (MPCR/BPCR) and quarantine gates.
            </p>
            <ul class="project-meta-list">
              <li>178 of 186 requirement stories verified (95.7% complete)</li>
              <li>Mandatory QA quarantine lock before repack dispensing</li>
              <li>Out-of-Trend (OOT) deviation isolation from plant incidents</li>
            </ul>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: var(--rule-hair, 1px) solid var(--color-rule); padding-top: 12px;">
            <span class="measured" style="font-size: 0.8125rem; color: var(--color-muted);">21 CFR §11, GAMP 5</span>
            <a href="compliance.html#sppl" class="btn btn--sm">Audit Trail</a>
          </div>
        </article>

        <article class="project-card">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h3 class="project-card-title">LinQ Enterprise HRMS</h3>
              <span class="chip chip--accent">100% Delivered</span>
            </div>
            <p class="project-card-desc">
              Multi-entity human resource management system featuring biometric punch integration, leave accrual guardrails, and dynamic org charts.
            </p>
            <ul class="project-meta-list">
              <li>176 total stories delivered (108 LinQ NS + 68 LinQ DS)</li>
              <li>WFH requests coupled directly to biometric device punches</li>
              <li>Petty cash budget capping and notice period refund gates</li>
            </ul>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: var(--rule-hair, 1px) solid var(--color-rule); padding-top: 12px;">
            <span class="measured" style="font-size: 0.8125rem; color: var(--color-muted);">Laravel, MySQL, Biometric</span>
            <a href="projects.html#linq" class="btn btn--sm">Specs & Details</a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- Interactive Terminal Section -->
  <section class="section" style="border-top: var(--rule-hair, 1px) solid var(--color-rule);">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Interactive audit and telemetry console</h2>
        <p class="section-desc">Execute commands directly to query repository statuses, run GxP audits, or switch Hallmark design themes.</p>
      </div>

      <div class="terminal-window" id="portfolio-terminal">
        <div class="terminal-bar">
          <span class="measured">viral@security-audit-console: ~</span>
          <span class="chip chip--accent" style="font-size: 0.6875rem;">Online</span>
        </div>
        <div class="terminal-body">
          <div class="terminal-output">
            <div>Viral Parmar Telemetry Console [Version 2.0.0]</div>
            <div>Type <span style="color: var(--color-accent); font-weight: 600;">help</span> to inspect available commands, or <span style="color: var(--color-accent); font-weight: 600;">theme &lt;slug&gt;</span> to test themes.</div>
          </div>
          <form class="terminal-form">
            <span class="prompt-tag">guest@vp-portfolio:~$</span>
            <input type="text" class="terminal-input" placeholder="help, repos, audit --project sppl, theme blueprint..." autocomplete="off" spellcheck="false">
          </form>
        </div>
      </div>
    </div>
  </section>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'index.html'), wrapPage({
  title: 'Mission Control',
  activePage: 'overview',
  content: indexContent
}));
console.log('Wrote index.html');

// 5. Generate Page 2: projects.html (Projects & Engineering Systems)
const projectsContent = `
  <section class="section">
    <div class="container">
      <div class="section-header">
        <h1 class="section-title">Engineering projects and enterprise systems</h1>
        <p class="section-desc">A complete directory of pharmaceutical manufacturing platforms, human resource suites, desktop productivity tools, and GitHub repositories.</p>
      </div>

      <div class="cards-grid">
        <article class="project-card" id="po-copilot">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h2 class="project-card-title">PO Copilot Desktop</h2>
              <span class="chip chip--accent">Private App</span>
            </div>
            <p class="project-card-desc">
              Custom local productivity hub for enterprise Product Owners. Features persistent SQLite WAL storage, electronic signature verification, and automated Sprint0 backlog sync.
            </p>
            <ul class="project-meta-list">
              <li>28 automated unit tests passing deterministically in 0.895s</li>
              <li>Two-tier reporting context (daily achievement delta vs. cumulative blocker state)</li>
              <li>E-signature confirmation gate complying with 21 CFR §11.50</li>
              <li>Dual mode session maintainer & automated backup verification</li>
            </ul>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: var(--rule-hair, 1px) solid var(--color-rule); padding-top: 12px;">
            <span class="measured" style="font-size: 0.8125rem; color: var(--color-muted);">Python, SQLite, Bash</span>
            <a href="https://github.com/Deady007/po-copilot" target="_blank" rel="noopener noreferrer" class="btn btn--sm">GitHub @Deady007</a>
          </div>
        </article>

        <article class="project-card" id="sprint0">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h2 class="project-card-title">Sprint0 Flow Analytics</h2>
              <span class="chip chip--accent">Analytics Server</span>
            </div>
            <p class="project-card-desc">
              Delivery analytics engine tracking work item flow, cumulative flow diagrams, and story distribution inequality using Gini coefficients.
            </p>
            <ul class="project-meta-list">
              <li>Markov chain completion risk engine estimating milestone delivery</li>
              <li>Zero-hallucination story verification matching actual Git commits</li>
              <li>Automated backlog health alerts identifying stuck work items</li>
            </ul>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: var(--rule-hair, 1px) solid var(--color-rule); padding-top: 12px;">
            <span class="measured" style="font-size: 0.8125rem; color: var(--color-muted);">Node.js, Flow Metrics</span>
            <a href="https://github.com/Deady007/sprint0-dashboard" target="_blank" rel="noopener noreferrer" class="btn btn--sm">GitHub @Deady007</a>
          </div>
        </article>

        <article class="project-card" id="linq">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h2 class="project-card-title">LinQ Enterprise HRMS</h2>
              <span class="chip chip--accent">100% Production</span>
            </div>
            <p class="project-card-desc">
              Comprehensive HRMS and Payroll platform built with Laravel and MySQL. Covers employee lifecycles, biometric attendance integration, and performance reviews.
            </p>
            <ul class="project-meta-list">
              <li>176 total user stories specified and delivered (108 LN + 68 LD)</li>
              <li>Biometric attendance coupling requiring verified punches for WFH approval</li>
              <li>Financial guardrail cards capping petty cash allocations</li>
              <li>Click-to-reassign org hierarchy with immediate manager re-indexing</li>
            </ul>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: var(--rule-hair, 1px) solid var(--color-rule); padding-top: 12px;">
            <span class="measured" style="font-size: 0.8125rem; color: var(--color-muted);">PHP, Laravel, MySQL</span>
            <a href="https://github.com/Deady007/Linq-hr" target="_blank" rel="noopener noreferrer" class="btn btn--sm">GitHub @Deady007</a>
          </div>
        </article>

        <article class="project-card" id="sppl">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h2 class="project-card-title">Suleshvari Pharma ERP</h2>
              <span class="chip chip--accent">GxP Regulated</span>
            </div>
            <p class="project-card-desc">
              Computerized batch manufacturing platform for active pharmaceutical ingredients (API) and formulations, compliant with US FDA 21 CFR Part 11 and Revised Schedule M.
            </p>
            <ul class="project-meta-list">
              <li>178 of 186 requirement stories verified (95.7% completion)</li>
              <li>Batch record transition from MPCR to BPCR plant terminology standard</li>
              <li>Automated QA quarantine locks blocking lot dispensing without approval</li>
              <li>Out-of-Trend (OOT) deviation isolation from generic plant incidents</li>
            </ul>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: var(--rule-hair, 1px) solid var(--color-rule); padding-top: 12px;">
            <span class="measured" style="font-size: 0.8125rem; color: var(--color-muted);">21 CFR §11, GAMP 5</span>
            <a href="compliance.html" class="btn btn--sm">Compliance Specs</a>
          </div>
        </article>

        <article class="project-card" id="biocare">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h2 class="project-card-title">BioCare LIMS Platform</h2>
              <span class="chip chip--accent">LIMS Architecture</span>
            </div>
            <p class="project-card-desc">
              Laboratory Information Management System (LIMS) managing sample intake, GS1-128 barcode parsing, test workflows, and chain of custody tracking.
            </p>
            <ul class="project-meta-list">
              <li>Sample accessioning with tamper-evident audit trails</li>
              <li>Automated calibration threshold checks for lab instrumentation</li>
              <li>COA (Certificate of Analysis) generation with digital sign-off gates</li>
            </ul>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: var(--rule-hair, 1px) solid var(--color-rule); padding-top: 12px;">
            <span class="measured" style="font-size: 0.8125rem; color: var(--color-muted);">PHP, JavaScript, SQL</span>
            <a href="https://github.com/Deady007/biocare" target="_blank" rel="noopener noreferrer" class="btn btn--sm">GitHub @Deady007</a>
          </div>
        </article>

        <article class="project-card" id="hbp">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h2 class="project-card-title">Deepak Foundation Health Portal</h2>
              <span class="chip chip--accent">Healthcare NGO</span>
            </div>
            <p class="project-card-desc">
              Healthcare beneficiary tracking portal engineered during internship at Deepak Foundation, managing field health survey collection and referral pipelines.
            </p>
            <ul class="project-meta-list">
              <li>Dynamic medical survey forms with field validation rules</li>
              <li>Patient referral tracking and village-level demographic aggregation</li>
              <li>Relational schema optimization for high-concurrency offline sync</li>
            </ul>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: var(--rule-hair, 1px) solid var(--color-rule); padding-top: 12px;">
            <span class="measured" style="font-size: 0.8125rem; color: var(--color-muted);">Laravel, MySQL, Blade</span>
            <a href="https://github.com/Deady007/HBP-v3" target="_blank" rel="noopener noreferrer" class="btn btn--sm">GitHub @Deady007</a>
          </div>
        </article>

        <article class="project-card" id="corekit">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h2 class="project-card-title">CoreKit Microservices Mesh</h2>
              <span class="chip chip--accent">Backend Mesh</span>
            </div>
            <p class="project-card-desc">
              Modular service architecture with containerized TypeScript services, REST APIs, and event-driven data streaming.
            </p>
            <ul class="project-meta-list">
              <li>Dockerized container definitions with zero-downtime health probes</li>
              <li>Authentication middleware with JWT validation and RBAC</li>
              <li>Shared TypeScript data schemas across frontend and backend</li>
            </ul>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: var(--rule-hair, 1px) solid var(--color-rule); padding-top: 12px;">
            <span class="measured" style="font-size: 0.8125rem; color: var(--color-muted);">TypeScript, Docker, API</span>
            <a href="https://github.com/Deady007/CoreKit" target="_blank" rel="noopener noreferrer" class="btn btn--sm">GitHub @Deady007</a>
          </div>
        </article>

        <article class="project-card" id="dpr">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <h2 class="project-card-title">DPR Progress Tracker</h2>
              <span class="chip chip--accent">Web Application</span>
            </div>
            <p class="project-card-desc">
              Daily Progress Reporting (DPR) web system designed for construction and field engineering projects, tracking labor, materials, and milestone sign-offs.
            </p>
            <ul class="project-meta-list">
              <li>Daily milestone ledger with multi-level supervisor approval</li>
              <li>Material consumption variance alerts against budgeted estimates</li>
              <li>Exportable PDF and Excel summary generation</li>
            </ul>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: var(--rule-hair, 1px) solid var(--color-rule); padding-top: 12px;">
            <span class="measured" style="font-size: 0.8125rem; color: var(--color-muted);">PHP, JavaScript, CSS</span>
            <a href="https://github.com/Deady007/DPR" target="_blank" rel="noopener noreferrer" class="btn btn--sm">GitHub @Deady007</a>
          </div>
        </article>
      </div>
    </div>
  </section>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'projects.html'), wrapPage({
  title: 'Engineering Projects',
  activePage: 'projects',
  content: projectsContent
}));
console.log('Wrote projects.html');

// 6. Generate Page 3: compliance.html (Security & GxP Compliance)
const complianceContent = `
  <section class="section">
    <div class="container">
      <div class="section-header">
        <h1 class="section-title">Cybersecurity integrity & GxP compliance matrix</h1>
        <p class="section-desc">Traceability matrix verifying software systems against US FDA 21 CFR Part 11, EU GMP Annex 11, ALCOA+ data integrity, and Tata Cybersecurity simulation benchmarks.</p>
      </div>

      <div class="cards-grid" style="margin-bottom: 32px;">
        <div class="surface">
          <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px;">21 CFR §11.10(e) Audit Trails</h2>
          <p style="font-size: 0.875rem; color: var(--color-muted); line-height: 1.5;">
            Computer-generated, time-stamped audit trails recording the date, time, actor, and reason for any change. Previous values remain un-overwritten and queryable.
          </p>
        </div>

        <div class="surface">
          <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px;">21 CFR §11.50 Signature Manifestations</h2>
          <p style="font-size: 0.875rem; color: var(--color-muted); line-height: 1.5;">
            Electronic signatures clearly manifesting the printed name of the signer, date/time stamp, and the associated meaning (e.g. authorship, review, approval).
          </p>
        </div>

        <div class="surface">
          <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px;">ALCOA+ Data Integrity Principles</h2>
          <p style="font-size: 0.875rem; color: var(--color-muted); line-height: 1.5;">
            Enforcing Attributable, Legible, Contemporaneous, Original, and Accurate data records across all batch processing and laboratory execution.
          </p>
        </div>
      </div>

      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Regulation / Standard</th>
              <th>Requirement Description</th>
              <th>Implementation Evidence</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="measured" style="font-weight: 600;">21 CFR §11.10(e)</td>
              <td>Immutable audit trails for record modifications</td>
              <td>Gapless database change logs in SPPL ERP & PO Copilot SQLite WAL</td>
              <td><span class="chip chip--ok">Verified PASS</span></td>
            </tr>
            <tr>
              <td class="measured" style="font-weight: 600;">21 CFR §11.50</td>
              <td>Electronic signature manifestation & meaning</td>
              <td>Full name, ISO timestamp, and role capture before state change execution</td>
              <td><span class="chip chip--ok">Verified PASS</span></td>
            </tr>
            <tr>
              <td class="measured" style="font-weight: 600;">21 CFR §11.10(d)</td>
              <td>Authority checks and role-based permissions</td>
              <td>RBAC segregation separating QC Analysts, QA Reviewers, and Production</td>
              <td><span class="chip chip--ok">Verified PASS</span></td>
            </tr>
            <tr>
              <td class="measured" style="font-weight: 600;">Tata Simulation</td>
              <td>Threat analysis and anomaly pattern detection</td>
              <td>Completed cyber simulation analyzing forensic traffic and incident vectors</td>
              <td><span class="chip chip--ok">Completed PASS</span></td>
            </tr>
            <tr>
              <td class="measured" style="font-weight: 600;">Deloitte Simulation</td>
              <td>Forensic data validation & telemetry integrity</td>
              <td>Telemetry cleansing and tabular reconciliation for business decisions</td>
              <td><span class="chip chip--ok">Completed PASS</span></td>
            </tr>
            <tr>
              <td class="measured" style="font-weight: 600;">Schedule M § 7.1</td>
              <td>Master and Batch Production Record Terminology</td>
              <td>Transitioned all manufacturing forms to BPCR plant standard (SPPL-82)</td>
              <td><span class="chip chip--ok">Verified PASS</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'compliance.html'), wrapPage({
  title: 'Compliance & GxP Matrix',
  activePage: 'compliance',
  content: complianceContent
}));
console.log('Wrote compliance.html');

// 7. Generate Page 4: agile-po.html (Agile Product Ownership & Requirements)
const agilePoContent = `
  <section class="section">
    <div class="container">
      <div class="section-header">
        <h1 class="section-title">Deterministic agile product ownership</h1>
        <p class="section-desc">Framework for decomposing complex client operations into developer-ready requirement stories, form matrices, and acceptance criteria.</p>
      </div>

      <div class="cards-grid" style="margin-bottom: 32px;">
        <div class="surface">
          <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px;">Developer-Ready Stories</h2>
          <p style="font-size: 0.875rem; color: var(--color-muted); line-height: 1.5;">
            Every story specifies clear context, user role, Given/When/Then acceptance criteria, form validation matrices, and technical delivery impacts.
          </p>
        </div>

        <div class="surface">
          <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px;">Two-Tier Context Model</h2>
          <p style="font-size: 0.875rem; color: var(--color-muted); line-height: 1.5;">
            Separating daily delta achievements (calls, tests, demos completed within that window) from cumulative blockers that persist until explicitly unblocked.
          </p>
        </div>

        <div class="surface">
          <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 8px;">Markov Flow Analytics</h2>
          <p style="font-size: 0.875rem; color: var(--color-muted); line-height: 1.5;">
            Applying delivery state transition probabilities and Gini coefficients to identify bottlenecked queues and milestone completion risks early.
          </p>
        </div>
      </div>

      <div class="section-header">
        <h2 class="section-title">Representative story specifications</h2>
        <p class="section-desc">Exact examples of developer-ready requirements drafted and delivered across production engagements.</p>
      </div>

      <div class="cards-grid">
        <div class="surface">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h3 style="font-size: 1rem; font-weight: 600;">SPPL-40: Mandatory QA Quarantine Gate</h3>
            <span class="chip chip--accent">GxP Pharma</span>
          </div>
          <p style="font-size: 0.875rem; color: var(--color-muted); margin-bottom: 8px;">
            <strong>Context:</strong> Prevent dispensing unverified or unapproved raw materials into active production batches.
          </p>
          <p style="font-size: 0.8125rem; color: var(--color-ink); line-height: 1.5;">
            <strong>Acceptance Criteria:</strong> Given a batch raw material request, when lot status is 'QUARANTINE', then repack dispensing action is disabled with warning: "Lot pending QA release".
          </p>
        </div>

        <div class="surface">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h3 style="font-size: 1rem; font-weight: 600;">LN-2: Mid-Month Hire Leave Accrual Rule</h3>
            <span class="chip chip--accent">LinQ HRMS</span>
          </div>
          <p style="font-size: 0.875rem; color: var(--color-muted); margin-bottom: 8px;">
            <strong>Context:</strong> Enforce fair monthly leave allocation policies for employees hired after mid-month.
          </p>
          <p style="font-size: 0.8125rem; color: var(--color-ink); line-height: 1.5;">
            <strong>Acceptance Criteria:</strong> Given an employee joining after the 15th of the month, when initial month accrual calculates, then credited days equal 0.0 with ledger note: "Joined post-cutover".
          </p>
        </div>

        <div class="surface">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h3 style="font-size: 1rem; font-weight: 600;">SPPL-184: Deviation Type Decoupling</h3>
            <span class="chip chip--accent">Regulatory CSV</span>
          </div>
          <p style="font-size: 0.875rem; color: var(--color-muted); margin-bottom: 8px;">
            <strong>Context:</strong> Separate Out-of-Trend (OOT) analytical records from physical plant maintenance incidents.
          </p>
          <p style="font-size: 0.8125rem; color: var(--color-ink); line-height: 1.5;">
            <strong>Acceptance Criteria:</strong> Given an analytical laboratory discrepancy, when logging a ticket, then user selects 'OOT Analytical' routing to QC Head rather than Plant Incident board.
          </p>
        </div>
      </div>
    </div>
  </section>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'agile-po.html'), wrapPage({
  title: 'Agile Product Ownership',
  activePage: 'agile-po',
  content: agilePoContent
}));
console.log('Wrote agile-po.html');

// 8. Generate Page 5: console.html (Interactive Terminal)
const consoleContent = `
  <section class="section">
    <div class="container">
      <div class="section-header">
        <h1 class="section-title">Live systems terminal & telemetry console</h1>
        <p class="section-desc">Interactive command line interface to query live telemetry, inspect regulatory audit traces, and test Hallmark design themes.</p>
      </div>

      <div class="terminal-window" id="portfolio-terminal" style="margin-bottom: 32px;">
        <div class="terminal-bar">
          <span class="measured">viral@security-audit-console: ~</span>
          <span class="chip chip--accent" style="font-size: 0.6875rem;">Online</span>
        </div>
        <div class="terminal-body" style="min-height: 440px;">
          <div class="terminal-output">
            <div>Viral Parmar Systems & Security Terminal [Version 2.0.0]</div>
            <div>Type <span style="color: var(--color-accent); font-weight: 600;">help</span> to inspect available commands.</div>
            <div>Type <span style="color: var(--color-accent); font-weight: 600;">theme &lt;slug&gt;</span> to activate any of the 50 Hallmark design themes.</div>
          </div>
          <form class="terminal-form">
            <span class="prompt-tag">guest@vp-portfolio:~$</span>
            <input type="text" class="terminal-input" placeholder="help, whoami, repos, audit --project sppl, theme console..." autocomplete="off" spellcheck="false" autofocus>
          </form>
        </div>
      </div>

      <div class="cards-grid">
        <div class="surface">
          <h2 style="font-size: 1rem; font-weight: 600; margin-bottom: 6px;">audit --project sppl</h2>
          <p style="font-size: 0.8125rem; color: var(--color-muted);">Runs regulatory validation checks on SPPL batch records, QA gates, and 21 CFR Part 11 electronic records.</p>
        </div>
        <div class="surface">
          <h2 style="font-size: 1rem; font-weight: 600; margin-bottom: 6px;">audit --project linq</h2>
          <p style="font-size: 0.8125rem; color: var(--color-muted);">Verifies attendance coupling, petty cash financial guardrails, and org chart hierarchies.</p>
        </div>
        <div class="surface">
          <h2 style="font-size: 1rem; font-weight: 600; margin-bottom: 6px;">theme &lt;name&gt;</h2>
          <p style="font-size: 0.8125rem; color: var(--color-muted);">Switches the entire website theme in real time (e.g. "theme blueprint", "theme darkroom", "theme arcade").</p>
        </div>
      </div>
    </div>
  </section>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'console.html'), wrapPage({
  title: 'Interactive Console',
  activePage: 'console',
  content: consoleContent
}));
console.log('Wrote console.html');

// 9. Generate Page 6: about.html (About & Credentials)
const aboutContent = `
  <section class="section">
    <div class="container">
      <div class="section-header">
        <h1 class="section-title">About Viral Parmar</h1>
        <p class="section-desc">Business analyst, cybersecurity candidate, and full-stack systems engineer based in Vadodara, Gujarat, India.</p>
      </div>

      <div class="cards-grid" style="margin-bottom: 32px;">
        <div class="surface">
          <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 12px;">Education & Foundation</h2>
          <div style="font-size: 1rem; font-weight: 600;">Bachelor of Computer Applications (BCA)</div>
          <div style="font-size: 0.875rem; color: var(--color-muted); margin-bottom: 12px;">The Maharaja Sayajirao University of Baroda (Oct 2022 – May 2025)</div>
          <p style="font-size: 0.875rem; color: var(--color-ink-2); line-height: 1.5;">
            Core coursework in Data Structures, Database Management Systems (SQL), Operating Systems, Software Engineering, Network Security, and Web Architecture.
          </p>
        </div>

        <div class="surface">
          <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 12px;">Industry Job Simulations</h2>
          <div style="margin-bottom: 12px;">
            <div style="font-size: 0.9375rem; font-weight: 600;">Tata Group Cybersecurity Analyst Simulation</div>
            <div style="font-size: 0.8125rem; color: var(--color-muted);">Threat intelligence, endpoint anomaly detection, incident response planning.</div>
          </div>
          <div>
            <div style="font-size: 0.9375rem; font-weight: 600;">Deloitte Australia Data Analytics Simulation</div>
            <div style="font-size: 0.8125rem; color: var(--color-muted);">Forensic data scrubbing, operational telemetry analysis, and executive dashboards.</div>
          </div>
        </div>
      </div>

      <div class="section-header">
        <h2 class="section-title">Career timeline</h2>
      </div>

      <div class="cards-grid" style="margin-bottom: 32px;">
        <div class="surface">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h3 style="font-size: 1.125rem; font-weight: 600;">Business Analyst</h3>
            <span class="chip chip--accent">Jul 2025 – Present</span>
          </div>
          <div style="font-size: 0.875rem; color: var(--color-muted); margin-bottom: 12px;">Fiscal Ox (Vadodara, Gujarat)</div>
          <p style="font-size: 0.875rem; color: var(--color-ink-2); line-height: 1.5;">
            Leading requirement analysis and GxP computerized system validation for pharmaceutical ERP systems. Authoring developer-ready user stories, 21 CFR Part 11 electronic records specifications, and modular OQ protocol sign-offs.
          </p>
        </div>

        <div class="surface">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <h3 style="font-size: 1.125rem; font-weight: 600;">Full Stack Laravel Intern</h3>
            <span class="chip chip--accent">Dec 2024 – Mar 2025</span>
          </div>
          <div style="font-size: 0.875rem; color: var(--color-muted); margin-bottom: 12px;">Deepak Foundation (Vadodara, Gujarat)</div>
          <p style="font-size: 0.875rem; color: var(--color-ink-2); line-height: 1.5;">
            Developed healthcare intake workflows, dynamic medical intake survey forms, and relational MySQL schemas supporting public health beneficiary tracking across rural Gujarat.
          </p>
        </div>
      </div>

      <div class="surface" style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 16px;">
        <div>
          <h2 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 4px;">Download Verified Resume</h2>
          <p style="font-size: 0.875rem; color: var(--color-muted);">Complete resume document including full technical skills, coursework, and contact channels.</p>
        </div>
        <a href="Viral_Parmar_Resume.pdf" download class="btn btn--primary">Download PDF Resume</a>
      </div>
    </div>
  </section>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'about.html'), wrapPage({
  title: 'About & Credentials',
  activePage: 'about',
  content: aboutContent
}));
console.log('Wrote about.html');

// 10. Generate Page 7: themes.html (The 50 Hallmark Themes Showcase)
const themesGridHtml = processedThemes.map(t => `
  <article class="surface" data-theme="${t.slug}" style="display: flex; flex-direction: column; justify-content: space-between; gap: var(--space-sm);">
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xs);">
        <h2 style="font-size: 1.125rem; font-weight: 600;">${t.name}</h2>
        <span class="chip chip--accent">${t.genre}</span>
      </div>
      <div style="font-size: 0.8125rem; color: var(--color-muted); margin-bottom: var(--space-xs);">
        Face: <strong style="color: var(--color-ink);">${t.displayFace}</strong> (${t.paperBand})
      </div>
      <p style="font-size: 0.8125rem; color: var(--color-ink-2); line-height: 1.45; margin-bottom: var(--space-sm);">
        ${t.material}
      </p>
      <div class="theme-swatches" style="margin-bottom: var(--space-sm);">
        <span class="swatch-dot" style="background-color: var(--color-paper);" title="Paper"></span>
        <span class="swatch-dot" style="background-color: var(--color-paper-2);" title="Paper 2"></span>
        <span class="swatch-dot" style="background-color: var(--color-rule);" title="Rule"></span>
        <span class="swatch-dot" style="background-color: var(--color-accent);" title="Accent"></span>
        <span class="swatch-dot" style="background-color: var(--color-ink);" title="Ink"></span>
      </div>
    </div>

    <div style="display: flex; gap: var(--space-xs); flex-wrap: wrap; border-top: var(--rule-hair, 1px) solid var(--color-rule); padding-top: var(--space-xs);">
      <button type="button" class="btn btn--sm" onclick="window.setHallmarkTheme('${t.slug}')">Apply to Site</button>
      <a href="portfolios/${t.slug}.html" class="btn btn--sm">Open Portfolio</a>
    </div>
  </article>
`).join('');

const themesContent = `
  <section class="section">
    <div class="container">
      <div class="section-header">
        <h1 class="section-title">Hallmark 50 design themes & portfolios</h1>
        <p class="section-desc">Browse, apply, and preview all 50 Hallmark design themes. Every theme possesses a distinct visual personality, typography pairing, and color harmony.</p>
      </div>

      <div class="cards-grid">
        ${themesGridHtml}
      </div>
    </div>
  </section>
`;

fs.writeFileSync(path.join(ROOT_DIR, 'themes.html'), wrapPage({
  title: '50 Hallmark Themes Gallery',
  activePage: 'themes',
  content: themesContent
}));
console.log('Wrote themes.html');

// 11. Generate 50 Standalone Complete Portfolios in portfolios/<slug>.html
for (const t of processedThemes) {
  const scheme = t.paperBand === 'dark' ? 'dark' : 'light';
  
  const themePageHtml = `<!DOCTYPE html>
<html lang="en" data-theme="${t.slug}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Viral Parmar | ${t.name} Portfolio</title>
  <meta name="description" content="Viral Parmar Portfolio styled in Hallmark ${t.name} (${t.genre}) theme.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible+Mono:ital,wght@0,400..700;1,400..700&family=Host+Grotesk:ital,wght@0,300..800;1,300..800&family=Chakra+Petch:wght@400;600;700&family=Instrument+Serif:ital@0;1&family=Syne:wght@500;700&family=Sofia+Sans+Extra+Condensed:wght@400;700&family=Hanken+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/main.css">
  <style>
    /* Hallmark: ${t.name} (${t.slug}) | genre: ${t.genre} | stand-alone portfolio */
    :root {
      color-scheme: ${scheme};
      ${t.block}
    }
    .theme-banner {
      background-color: var(--color-paper-2);
      border-bottom: var(--rule-hair, 1px) solid var(--color-rule);
      padding: var(--space-xs) var(--space-md);
      font-size: 0.8125rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--space-xs);
    }
  </style>
</head>
<body>
  <!-- Theme Banner -->
  <div class="theme-banner">
    <div>
      <a href="../themes.html" style="font-weight: 600; text-decoration: underline;">Back to 50 Themes Showcase</a>
      <span style="margin-inline: var(--space-xs); color: var(--color-muted);">|</span>
      <span>Theme: <strong>${t.name}</strong> (${t.genre})</span>
    </div>
    <div>
      <select onchange="window.location.href = this.value + '.html'" style="padding: var(--space-3xs) var(--space-xs); border: var(--rule-hair, 1px) solid var(--color-rule); border-radius: var(--radius-pill); background: var(--color-paper);">
        ${processedThemes.map(other => `<option value="${other.slug}" ${other.slug === t.slug ? 'selected' : ''}>${other.name} (${other.genre})</option>`).join('')}
      </select>
    </div>
  </div>

  ${getHeaderHtml('overview', true)}

  <main>
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <h1 class="hero-title">Viral Parmar</h1>
          <div class="hero-subhead">Business analyst, cybersecurity candidate, and full-stack systems engineer</div>

          <div class="hero-badge">
            <span class="status-indicator"></span>
            <span>Hallmark Theme: ${t.name}</span>
          </div>

          <p class="hero-lead">
            Translating enterprise requirements into deterministic stories, electronic records, and access-governed workflows.
          </p>

          <div class="hero-cta">
            <a href="../projects.html" class="btn btn--primary">Enterprise Projects</a>
            <a href="../compliance.html" class="btn">GxP Compliance</a>
            <a href="../Viral_Parmar_Resume.pdf" download class="btn">Resume PDF</a>
          </div>
        </div>

        <div class="surface">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span class="measured" style="font-size: 0.8125rem; color: var(--color-muted);">Verified telemetry</span>
            <span class="chip chip--accent">BCA 2025</span>
          </div>
          <div class="telemetry-grid">
            <div class="telemetry-item">
              <div class="telemetry-num measured">50+</div>
              <div class="telemetry-label">GitHub repositories (@Deady007)</div>
            </div>
            <div class="telemetry-item">
              <div class="telemetry-num measured">95.7%</div>
              <div class="telemetry-label">SPPL ERP completion (178/186)</div>
            </div>
            <div class="telemetry-item">
              <div class="telemetry-num measured">100%</div>
              <div class="telemetry-label">LinQ HRMS delivery (176 stories)</div>
            </div>
            <div class="telemetry-item">
              <div class="telemetry-num measured">28 Tests</div>
              <div class="telemetry-label">PO Copilot unit suite (0.895s)</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Grid -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Key enterprise systems</h2>
          <p class="section-desc">Sample systems delivered across pharmaceutical ERP, enterprise HRMS, and developer tools.</p>
        </div>

        <div class="cards-grid">
          <article class="project-card">
            <h3 class="project-card-title">PO Copilot Desktop</h3>
            <p class="project-card-desc">Desktop PO application with SQLite WAL mode persistence, 21 CFR Part 11 electronic signatures, and 28 unit tests.</p>
            <a href="../projects.html#po-copilot" class="btn btn--sm">View Specs</a>
          </article>
          <article class="project-card">
            <h3 class="project-card-title">SPPL Pharma ERP</h3>
            <p class="project-card-desc">Batch manufacturing execution system handling MPCR/BPCR transitions, QA quarantine gates, and OOT deviation handling.</p>
            <a href="../compliance.html" class="btn btn--sm">View Audit Trail</a>
          </article>
          <article class="project-card">
            <h3 class="project-card-title">LinQ Enterprise HRMS</h3>
            <p class="project-card-desc">176 delivered user stories with biometric attendance coupling, petty cash capping, and reporting hierarchy management.</p>
            <a href="../projects.html#linq" class="btn btn--sm">View Specs</a>
          </article>
        </div>
      </div>
    </section>

    <!-- Terminal -->
    <section class="section" style="border-top: var(--rule-hair, 1px) solid var(--color-rule);">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Interactive terminal console</h2>
        </div>
        <div class="terminal-window" id="portfolio-terminal">
          <div class="terminal-bar">
            <span class="measured">viral@security-audit-console: ~</span>
            <span class="chip chip--accent" style="font-size: 0.6875rem;">Online</span>
          </div>
          <div class="terminal-body">
            <div class="terminal-output">
              <div>Viral Parmar Telemetry Console [Version 2.0.0]</div>
              <div>Type <span style="color: var(--color-accent); font-weight: 600;">help</span> to inspect available commands.</div>
            </div>
            <form class="terminal-form">
              <span class="prompt-tag">guest@vp-portfolio:~$</span>
              <input type="text" class="terminal-input" placeholder="help, repos, audit --project sppl..." autocomplete="off" spellcheck="false">
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>

  ${getFooterHtml(true)}

  <script src="../js/themes-data.js"></script>
  <script src="../js/theme-switcher.js"></script>
  <script src="../js/console.js"></script>
</body>
</html>`;

  fs.writeFileSync(path.join(ROOT_DIR, 'portfolios', `${t.slug}.html`), themePageHtml);
}
console.log(`Successfully generated all 50 standalone portfolio pages in ${path.join(ROOT_DIR, 'portfolios')}/`);
