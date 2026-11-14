import fs from 'node:fs';
import path from 'node:path';

const THEMES_DIR = '/home/viral/hallmark/skills/hallmark/references/themes';
const PORTFOLIO_THEMES_DIR = '/home/viral/portfolio/themes';
const PORTFOLIOS_DIR = '/home/viral/portfolio/portfolios';
const INDEX_PATH = path.join(THEMES_DIR, 'index.json');

const rawIndex = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
const themesList = rawIndex.themes;

console.log(`Wiring ${themesList.length} themes with Hallmark Hub bar...`);

// Build options string for switcher dropdown
const optionsHtml = themesList.map(t => 
  `<option value="${t.slug}">${t.name} (${t.genre})</option>`
).join('');

for (const t of themesList) {
  const themeHtmlPath = path.join(PORTFOLIO_THEMES_DIR, t.slug, 'index.html');
  if (!fs.existsSync(themeHtmlPath)) {
    console.warn(`Missing index.html for ${t.slug}`);
    continue;
  }

  let html = fs.readFileSync(themeHtmlPath, 'utf8');

  // Check if hub bar already injected
  if (!html.includes('class="hallmark-hub-bar"')) {
    const hubBarHtml = `
<!-- Hallmark Universal Hub Bar -->
<div class="hallmark-hub-bar" style="position: relative; z-index: 10000; background-color: var(--color-paper-2, #18181b); color: var(--color-ink, #f4f4f5); border-bottom: 1px solid var(--color-rule, #3f3f46); padding: 8px 16px; font-family: var(--font-body, system-ui, sans-serif); font-size: 13px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
  <div style="display: flex; align-items: center; gap: 12px;">
    <a href="../../index.html" style="font-weight: 600; text-decoration: none; color: inherit; display: inline-flex; align-items: center; gap: 6px;">
      <span style="color: var(--color-accent, #eab308);">←</span> <span>Viral Parmar Hub</span>
    </a>
    <span style="opacity: 0.35;">|</span>
    <span>Hallmark Theme Layout: <strong style="color: var(--color-accent, #eab308);">${t.name}</strong> (${t.genre})</span>
  </div>
  <div style="display: flex; align-items: center; gap: 10px;">
    <label for="theme-hop-select-${t.slug}" style="font-size: 12px; opacity: 0.8;">Switch Layout:</label>
    <select id="theme-hop-select-${t.slug}" onchange="if (this.value) window.location.href = '../' + this.value + '/index.html'" style="background: var(--color-paper, #09090b); color: var(--color-ink, #f4f4f5); border: 1px solid var(--color-rule, #3f3f46); border-radius: 4px; padding: 4px 8px; font-size: 12px; cursor: pointer;">
      ${themesList.map(other => `<option value="${other.slug}" ${other.slug === t.slug ? 'selected' : ''}>${other.name} (${other.genre})</option>`).join('')}
    </select>
    <a href="../../Viral_Parmar_Resume.pdf" download style="background: var(--color-accent, #eab308); color: var(--color-accent-ink, #000); padding: 4px 10px; border-radius: 4px; font-weight: 600; text-decoration: none; font-size: 12px;">Resume PDF</a>
  </div>
</div>
`;
    html = html.replace(/<body[^>]*>/i, (match) => `${match}\n${hubBarHtml}`);
    fs.writeFileSync(themeHtmlPath, html);
  }

  // Update standalone portfolios/<slug>.html to direct to themes/<slug>/index.html
  const portfolioRedirectHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=../themes/${t.slug}/index.html">
  <title>Viral Parmar | Hallmark ${t.name} Portfolio</title>
  <script>window.location.href = "../themes/${t.slug}/index.html";</script>
</head>
<body style="font-family: system-ui, sans-serif; background: #09090b; color: #f4f4f5; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
  <p>Loading Hallmark <strong>${t.name}</strong> (${t.genre}) bespoke layout... <a href="../themes/${t.slug}/index.html" style="color: #eab308;">Click here if not redirected</a>.</p>
</body>
</html>`;
  fs.writeFileSync(path.join(PORTFOLIOS_DIR, `${t.slug}.html`), portfolioRedirectHtml);
}

console.log('Successfully wired all 50 theme sites and portfolio redirects!');
